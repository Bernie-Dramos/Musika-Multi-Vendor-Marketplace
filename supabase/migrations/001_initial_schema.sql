-- =============================================================================
-- Migration 001: Initial Schema
-- Musika Multi-Vendor Marketplace
-- =============================================================================

-- ─── Extensions ──────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm"; -- For full-text search on forum/resources

-- ─── Enums ───────────────────────────────────────────────────────────────────
create type user_role as enum ('student', 'vendor', 'admin');

create type vendor_application_status as enum (
  'draft', 'submitted', 'review', 'approved', 'rejected', 'revision_required'
);

create type vendor_business_type as enum ('individual', 'business', 'non_profit');

create type payment_method as enum ('bank_transfer', 'stripe', 'paypal');

create type resource_category as enum (
  'visa', 'legal', 'housing', 'transport', 'healthcare', 'discounts', 'emergency'
);

create type forum_category as enum ('housing', 'academics', 'legal', 'events', 'general');

create type support_ticket_status as enum (
  'open', 'in_progress', 'waiting_customer', 'resolved', 'closed'
);

create type support_ticket_priority as enum ('low', 'medium', 'high', 'urgent');

-- ─── profiles ────────────────────────────────────────────────────────────────
-- Extends auth.users. Created automatically via trigger on user sign-up.
create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text not null,
  full_name     text,
  avatar_url    text,
  role          user_role not null default 'student',
  university    text,
  country       text,
  marketing_consent boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Auto-create profile on sign-up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (
    new.id,
    new.email,
    'student'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at on profiles
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- ─── vendor_applications ─────────────────────────────────────────────────────
create table public.vendor_applications (
  id                            uuid primary key default gen_random_uuid(),
  vendor_id                     uuid not null references public.profiles(id) on delete cascade,
  business_name                 text not null,
  business_type                 vendor_business_type not null default 'individual',
  owner_name                    text not null,
  owner_email                   text not null,
  owner_phone                   text not null,
  business_description          text not null,
  category                      text not null,
  business_registration         text,
  tax_id                        text,
  payment_method                payment_method not null default 'bank_transfer',
  bank_name                     text,
  bank_account_holder           text,
  -- NOTE: Store only last 4 digits in plaintext; full number encrypted at app layer
  bank_account_number_encrypted text,
  status                        vendor_application_status not null default 'draft',
  submitted_at                  timestamptz,
  reviewed_at                   timestamptz,
  review_notes                  text,
  created_at                    timestamptz not null default now(),
  updated_at                    timestamptz not null default now()
);

create trigger vendor_applications_set_updated_at
  before update on public.vendor_applications
  for each row execute procedure public.set_updated_at();

-- A user may only have one active (non-rejected) application at a time
create unique index vendor_applications_one_active
  on public.vendor_applications (vendor_id)
  where status not in ('rejected');

-- ─── resources ───────────────────────────────────────────────────────────────
create table public.resources (
  id          serial primary key,
  slug        text not null unique,
  title       text not null,
  description text not null,
  category    resource_category not null,
  country     text not null,
  city        text,
  url         text,
  phone       text,
  email       text,
  address     text,
  is_verified boolean not null default false,
  is_free     boolean not null default true,
  created_by  uuid references public.profiles(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger resources_set_updated_at
  before update on public.resources
  for each row execute procedure public.set_updated_at();

create index resources_category_idx on public.resources (category);
create index resources_country_idx  on public.resources (country);
create index resources_search_idx   on public.resources using gin (
  to_tsvector('english', title || ' ' || description)
);

-- ─── forum_posts ─────────────────────────────────────────────────────────────
create table public.forum_posts (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  content       text not null,
  category      forum_category not null default 'general',
  author_id     uuid not null references public.profiles(id) on delete cascade,
  views         integer not null default 0,
  upvotes       integer not null default 0,
  replies_count integer not null default 0,
  saved_count   integer not null default 0,
  is_answered   boolean not null default false,
  tags          text[] not null default '{}',
  is_trending   boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger forum_posts_set_updated_at
  before update on public.forum_posts
  for each row execute procedure public.set_updated_at();

create index forum_posts_category_idx   on public.forum_posts (category);
create index forum_posts_author_idx     on public.forum_posts (author_id);
create index forum_posts_trending_idx   on public.forum_posts (is_trending) where is_trending = true;
create index forum_posts_unanswered_idx on public.forum_posts (is_answered) where is_answered = false;
create index forum_posts_search_idx     on public.forum_posts using gin (
  to_tsvector('english', title || ' ' || content)
);
create index forum_posts_tags_idx       on public.forum_posts using gin (tags);

-- ─── forum_comments ──────────────────────────────────────────────────────────
create table public.forum_comments (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references public.forum_posts(id) on delete cascade,
  content    text not null,
  author_id  uuid not null references public.profiles(id) on delete cascade,
  upvotes    integer not null default 0,
  is_answer  boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger forum_comments_set_updated_at
  before update on public.forum_comments
  for each row execute procedure public.set_updated_at();

create index forum_comments_post_idx on public.forum_comments (post_id);

-- Auto-increment replies_count on forum_post when a comment is added/deleted
create or replace function public.sync_forum_replies_count()
returns trigger language plpgsql as $$
begin
  if TG_OP = 'INSERT' then
    update public.forum_posts set replies_count = replies_count + 1 where id = new.post_id;
  elsif TG_OP = 'DELETE' then
    update public.forum_posts set replies_count = greatest(replies_count - 1, 0) where id = old.post_id;
  end if;
  return null;
end;
$$;

create trigger forum_comments_sync_count
  after insert or delete on public.forum_comments
  for each row execute procedure public.sync_forum_replies_count();

-- ─── support_tickets ─────────────────────────────────────────────────────────
create table public.support_tickets (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  subject     text not null,
  category    text not null,
  description text not null,
  status      support_ticket_status not null default 'open',
  priority    support_ticket_priority not null default 'medium',
  resolved_at timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger support_tickets_set_updated_at
  before update on public.support_tickets
  for each row execute procedure public.set_updated_at();

create index support_tickets_user_idx   on public.support_tickets (user_id);
create index support_tickets_status_idx on public.support_tickets (status);

-- ─── support_messages ────────────────────────────────────────────────────────
create table public.support_messages (
  id              uuid primary key default gen_random_uuid(),
  ticket_id       uuid not null references public.support_tickets(id) on delete cascade,
  author_id       uuid references public.profiles(id) on delete set null,
  author_role     text not null check (author_role in ('customer', 'support')),
  message         text not null,
  attachment_urls text[] not null default '{}',
  created_at      timestamptz not null default now()
);

create index support_messages_ticket_idx on public.support_messages (ticket_id);

-- ─── saved_resources ─────────────────────────────────────────────────────────
create table public.saved_resources (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  resource_id integer not null references public.resources(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (user_id, resource_id)
);

create index saved_resources_user_idx on public.saved_resources (user_id);
