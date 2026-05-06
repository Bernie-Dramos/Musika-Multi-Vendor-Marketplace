-- =============================================================================
-- Migration 008: Sync Vendor Profile Role On Application Approval
-- Musika Multi-Vendor Marketplace
-- =============================================================================

create or replace function public.sync_vendor_profile_role_on_application()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'approved' and (tg_op = 'INSERT' or old.status is distinct from 'approved') then
    update public.profiles
    set
      role = 'vendor',
      updated_at = now()
    where id = new.vendor_id
      and role is distinct from 'vendor';
  end if;

  return new;
end;
$$;

drop trigger if exists vendor_applications_sync_vendor_role on public.vendor_applications;
create trigger vendor_applications_sync_vendor_role
  after insert or update of status on public.vendor_applications
  for each row execute procedure public.sync_vendor_profile_role_on_application();

-- Ensure existing approved applications are reflected in profile roles.
update public.profiles p
set
  role = 'vendor',
  updated_at = now()
where p.id in (
  select va.vendor_id
  from public.vendor_applications va
  where va.status = 'approved'
)
and p.role is distinct from 'vendor';