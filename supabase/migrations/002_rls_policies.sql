-- =============================================================================
-- Migration 002: Row Level Security Policies
-- Musika Multi-Vendor Marketplace
-- =============================================================================

-- ─── Enable RLS on all tables ─────────────────────────────────────────────

alter table public.profiles            enable row level security;
alter table public.vendor_applications enable row level security;
alter table public.resources           enable row level security;
alter table public.forum_posts         enable row level security;
alter table public.forum_comments      enable row level security;
alter table public.support_tickets     enable row level security;
alter table public.support_messages    enable row level security;
alter table public.saved_resources     enable row level security;

-- ─── Helper: current user is admin ───────────────────────────────────────────
create or replace function public.is_admin()
returns boolean language sql stable security definer as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- =============================================================================
-- profiles
-- =============================================================================

-- Anyone can read all profiles (public display names / avatars)
create policy "profiles_public_read"
  on public.profiles for select
  using (true);

-- Users can update only their own profile
create policy "profiles_owner_update"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Admins can update any profile (e.g., role changes)
create policy "profiles_admin_update"
  on public.profiles for update
  using (public.is_admin());

-- Insert handled by trigger (handle_new_user); block direct inserts from API
create policy "profiles_no_direct_insert"
  on public.profiles for insert
  with check (false);

-- =============================================================================
-- vendor_applications
-- =============================================================================

-- Vendors can read their own applications
create policy "vendor_applications_owner_read"
  on public.vendor_applications for select
  using (auth.uid() = vendor_id);

-- Admins can read all applications
create policy "vendor_applications_admin_read"
  on public.vendor_applications for select
  using (public.is_admin());

-- Authenticated users can create an application for themselves
create policy "vendor_applications_owner_insert"
  on public.vendor_applications for insert
  with check (auth.uid() = vendor_id);

-- Vendors can update their own draft/revision-required applications
create policy "vendor_applications_owner_update"
  on public.vendor_applications for update
  using (
    auth.uid() = vendor_id
    and status in ('draft', 'revision_required')
  )
  with check (auth.uid() = vendor_id);

-- Admins can update any application (status changes, review notes)
create policy "vendor_applications_admin_update"
  on public.vendor_applications for update
  using (public.is_admin());

-- =============================================================================
-- resources
-- =============================================================================

-- Public read for all resources
create policy "resources_public_read"
  on public.resources for select
  using (true);

-- Authenticated users can submit a new resource
create policy "resources_authenticated_insert"
  on public.resources for insert
  with check (auth.uid() is not null);

-- Creator or admin can update
create policy "resources_creator_or_admin_update"
  on public.resources for update
  using (
    auth.uid() = created_by
    or public.is_admin()
  );

-- Only admins can delete
create policy "resources_admin_delete"
  on public.resources for delete
  using (public.is_admin());

-- =============================================================================
-- forum_posts
-- =============================================================================

-- Public read
create policy "forum_posts_public_read"
  on public.forum_posts for select
  using (true);

-- Authenticated users can create posts
create policy "forum_posts_authenticated_insert"
  on public.forum_posts for insert
  with check (auth.uid() is not null and auth.uid() = author_id);

-- Authors can update their own posts
create policy "forum_posts_author_update"
  on public.forum_posts for update
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

-- Admins can update any post (moderation)
create policy "forum_posts_admin_update"
  on public.forum_posts for update
  using (public.is_admin());

-- Authors or admins can delete posts
create policy "forum_posts_author_or_admin_delete"
  on public.forum_posts for delete
  using (auth.uid() = author_id or public.is_admin());

-- =============================================================================
-- forum_comments
-- =============================================================================

-- Public read
create policy "forum_comments_public_read"
  on public.forum_comments for select
  using (true);

-- Authenticated users can comment
create policy "forum_comments_authenticated_insert"
  on public.forum_comments for insert
  with check (auth.uid() is not null and auth.uid() = author_id);

-- Authors can update own comments
create policy "forum_comments_author_update"
  on public.forum_comments for update
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

-- Authors or admins can delete comments
create policy "forum_comments_author_or_admin_delete"
  on public.forum_comments for delete
  using (auth.uid() = author_id or public.is_admin());

-- =============================================================================
-- support_tickets
-- =============================================================================

-- Users can read their own tickets
create policy "support_tickets_owner_read"
  on public.support_tickets for select
  using (auth.uid() = user_id);

-- Admins / support can read all tickets
create policy "support_tickets_admin_read"
  on public.support_tickets for select
  using (public.is_admin());

-- Authenticated users can create tickets for themselves
create policy "support_tickets_owner_insert"
  on public.support_tickets for insert
  with check (auth.uid() = user_id);

-- Only admins can update tickets (status changes)
create policy "support_tickets_admin_update"
  on public.support_tickets for update
  using (public.is_admin());

-- =============================================================================
-- support_messages
-- =============================================================================

-- Ticket owner can read messages on their tickets
create policy "support_messages_ticket_owner_read"
  on public.support_messages for select
  using (
    exists (
      select 1 from public.support_tickets
      where id = support_messages.ticket_id
        and user_id = auth.uid()
    )
  );

-- Admins/support can read all messages
create policy "support_messages_admin_read"
  on public.support_messages for select
  using (public.is_admin());

-- Ticket owner or admin can insert messages
create policy "support_messages_ticket_owner_insert"
  on public.support_messages for insert
  with check (
    exists (
      select 1 from public.support_tickets
      where id = support_messages.ticket_id
        and user_id = auth.uid()
    )
    or public.is_admin()
  );

-- =============================================================================
-- saved_resources
-- =============================================================================

-- Users can read their own saved resources
create policy "saved_resources_owner_read"
  on public.saved_resources for select
  using (auth.uid() = user_id);

-- Users can save/unsave for themselves
create policy "saved_resources_owner_insert"
  on public.saved_resources for insert
  with check (auth.uid() = user_id);

create policy "saved_resources_owner_delete"
  on public.saved_resources for delete
  using (auth.uid() = user_id);
