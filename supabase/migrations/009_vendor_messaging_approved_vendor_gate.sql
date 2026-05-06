-- =============================================================================
-- Migration 009: Restrict New Conversations To Approved Vendors
-- Musika Multi-Vendor Marketplace
-- =============================================================================

drop policy if exists "vendor_conversations_participant_insert" on public.vendor_conversations;

create policy "vendor_conversations_participant_insert"
  on public.vendor_conversations for insert
  with check (
    (auth.uid() = student_id or auth.uid() = vendor_id)
    and exists (
      select 1
      from public.vendor_applications va
      where va.vendor_id = vendor_conversations.vendor_id
        and va.status = 'approved'
    )
  );