-- =============================================================================
-- Migration 004: Initialize profile role from auth metadata
-- Musika Multi-Vendor Marketplace
-- =============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  requested_role text;
  normalized_role user_role;
begin
  requested_role := coalesce(new.raw_user_meta_data->>'role', 'student');

  normalized_role := case
    when requested_role in ('student', 'vendor', 'admin') then requested_role::user_role
    else 'student'::user_role
  end;

  insert into public.profiles (id, email, role)
  values (
    new.id,
    new.email,
    normalized_role
  );

  return new;
end;
$$;
