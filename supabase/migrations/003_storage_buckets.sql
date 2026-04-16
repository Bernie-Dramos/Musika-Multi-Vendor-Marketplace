-- =============================================================================
-- Migration 003: Storage Buckets
-- Musika Multi-Vendor Marketplace
-- =============================================================================
-- Run this in the Supabase dashboard SQL editor or via the CLI.
-- Storage bucket policies use the Supabase storage schema.

-- ─── Create buckets ──────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  -- Public avatar images (profile pictures)
  (
    'avatars',
    'avatars',
    true,
    5242880, -- 5 MB
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  ),
  -- Private vendor verification documents
  (
    'vendor-docs',
    'vendor-docs',
    false,
    10485760, -- 10 MB
    array['image/jpeg', 'image/png', 'application/pdf']
  ),
  -- Private support ticket attachments
  (
    'support-attachments',
    'support-attachments',
    false,
    10485760, -- 10 MB
    array['image/jpeg', 'image/png', 'application/pdf', 'image/webp']
  )
on conflict (id) do nothing;

-- ─── avatars: public read, owner write ───────────────────────────────────────

create policy "avatars_public_read"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "avatars_owner_insert"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid() is not null
    -- Enforce path: avatars/{user_id}/filename
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "avatars_owner_update"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "avatars_owner_delete"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ─── vendor-docs: private, owner + admin only ────────────────────────────────

create policy "vendor_docs_owner_read"
  on storage.objects for select
  using (
    bucket_id = 'vendor-docs'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or exists (
        select 1 from public.profiles
        where id = auth.uid() and role = 'admin'
      )
    )
  );

create policy "vendor_docs_owner_insert"
  on storage.objects for insert
  with check (
    bucket_id = 'vendor-docs'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "vendor_docs_owner_delete"
  on storage.objects for delete
  using (
    bucket_id = 'vendor-docs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ─── support-attachments: ticket owner + admin ───────────────────────────────

create policy "support_attachments_owner_read"
  on storage.objects for select
  using (
    bucket_id = 'support-attachments'
    and (
      -- Path: support-attachments/{ticket_id}/{filename}
      -- Ticket owner check
      exists (
        select 1 from public.support_tickets
        where id::text = (storage.foldername(name))[1]
          and user_id = auth.uid()
      )
      or exists (
        select 1 from public.profiles
        where id = auth.uid() and role = 'admin'
      )
    )
  );

create policy "support_attachments_owner_insert"
  on storage.objects for insert
  with check (
    bucket_id = 'support-attachments'
    and auth.uid() is not null
    and exists (
      select 1 from public.support_tickets
      where id::text = (storage.foldername(name))[1]
        and user_id = auth.uid()
    )
  );
