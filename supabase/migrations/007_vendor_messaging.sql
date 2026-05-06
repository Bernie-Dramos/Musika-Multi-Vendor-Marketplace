-- =============================================================================
-- Migration 007: Vendor Messaging (Student <-> Vendor)
-- Musika Multi-Vendor Marketplace
-- =============================================================================

-- ─── vendor_conversations ───────────────────────────────────────────────────
create table if not exists public.vendor_conversations (
  id                    uuid primary key default gen_random_uuid(),
  student_id            uuid not null references public.profiles(id) on delete cascade,
  vendor_id             uuid not null references public.profiles(id) on delete cascade,
  last_message_preview  text,
  last_message_at       timestamptz,
  last_message_sender_id uuid references public.profiles(id) on delete set null,
  student_unread_count  integer not null default 0 check (student_unread_count >= 0),
  vendor_unread_count   integer not null default 0 check (vendor_unread_count >= 0),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  unique (student_id, vendor_id),
  constraint vendor_conversations_distinct_participants check (student_id <> vendor_id)
);

create trigger vendor_conversations_set_updated_at
  before update on public.vendor_conversations
  for each row execute procedure public.set_updated_at();

create index if not exists vendor_conversations_student_idx on public.vendor_conversations (student_id);
create index if not exists vendor_conversations_vendor_idx on public.vendor_conversations (vendor_id);
create index if not exists vendor_conversations_updated_at_idx on public.vendor_conversations (updated_at desc);

-- ─── vendor_messages ────────────────────────────────────────────────────────
create table if not exists public.vendor_messages (
  id               uuid primary key default gen_random_uuid(),
  conversation_id  uuid not null references public.vendor_conversations(id) on delete cascade,
  sender_id        uuid not null references public.profiles(id) on delete cascade,
  sender_role      user_role not null,
  message          text not null,
  read_at          timestamptz,
  created_at       timestamptz not null default now(),
  constraint vendor_messages_non_empty_message check (length(trim(message)) > 0)
);

create index if not exists vendor_messages_conversation_idx on public.vendor_messages (conversation_id, created_at);
create index if not exists vendor_messages_sender_idx on public.vendor_messages (sender_id);

-- Keep conversation summary columns in sync whenever a message is sent.
create or replace function public.sync_vendor_conversation_on_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.vendor_conversations
  set
    last_message_preview = left(new.message, 180),
    last_message_at = new.created_at,
    last_message_sender_id = new.sender_id,
    student_unread_count = case
      when new.sender_id = vendor_id then student_unread_count + 1
      else student_unread_count
    end,
    vendor_unread_count = case
      when new.sender_id = student_id then vendor_unread_count + 1
      else vendor_unread_count
    end,
    updated_at = now()
  where id = new.conversation_id;

  return new;
end;
$$;

drop trigger if exists vendor_messages_sync_conversation on public.vendor_messages;
create trigger vendor_messages_sync_conversation
  after insert on public.vendor_messages
  for each row execute procedure public.sync_vendor_conversation_on_message();

-- ─── Row Level Security ─────────────────────────────────────────────────────
alter table public.vendor_conversations enable row level security;
alter table public.vendor_messages enable row level security;

create policy "vendor_conversations_participant_or_admin_read"
  on public.vendor_conversations for select
  using (
    auth.uid() = student_id
    or auth.uid() = vendor_id
    or public.is_admin()
  );

create policy "vendor_conversations_participant_insert"
  on public.vendor_conversations for insert
  with check (
    auth.uid() = student_id
    or auth.uid() = vendor_id
  );

create policy "vendor_conversations_participant_update"
  on public.vendor_conversations for update
  using (
    auth.uid() = student_id
    or auth.uid() = vendor_id
    or public.is_admin()
  )
  with check (
    auth.uid() = student_id
    or auth.uid() = vendor_id
    or public.is_admin()
  );

create policy "vendor_messages_participant_or_admin_read"
  on public.vendor_messages for select
  using (
    public.is_admin()
    or exists (
      select 1
      from public.vendor_conversations vc
      where vc.id = vendor_messages.conversation_id
        and (vc.student_id = auth.uid() or vc.vendor_id = auth.uid())
    )
  );

create policy "vendor_messages_participant_insert"
  on public.vendor_messages for insert
  with check (
    sender_id = auth.uid()
    and sender_role in ('student', 'vendor')
    and exists (
      select 1
      from public.vendor_conversations vc
      where vc.id = vendor_messages.conversation_id
        and (vc.student_id = auth.uid() or vc.vendor_id = auth.uid())
    )
  );

create policy "vendor_messages_participant_update"
  on public.vendor_messages for update
  using (
    exists (
      select 1
      from public.vendor_conversations vc
      where vc.id = vendor_messages.conversation_id
        and (vc.student_id = auth.uid() or vc.vendor_id = auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.vendor_conversations vc
      where vc.id = vendor_messages.conversation_id
        and (vc.student_id = auth.uid() or vc.vendor_id = auth.uid())
    )
  );