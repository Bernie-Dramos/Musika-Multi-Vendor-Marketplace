-- =============================================================================
-- Migration 005: Auto-promote sandip@gmail.com to admin role
-- Musika Multi-Vendor Marketplace
-- =============================================================================

-- Override handle_new_user to force admin role for the designated admin email
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  requested_role text;
  normalized_role user_role;
begin
  -- Force admin role for the designated platform administrator
  if new.email = 'sandip@gmail.com' then
    normalized_role := 'admin'::user_role;
  else
    requested_role := coalesce(new.raw_user_meta_data->>'role', 'student');
    normalized_role := case
      when requested_role in ('student', 'vendor') then requested_role::user_role
      else 'student'::user_role
    end;
  end if;

  insert into public.profiles (id, email, role)
  values (
    new.id,
    new.email,
    normalized_role
  )
  on conflict (id) do update set role = excluded.role;

  return new;
end;
$$;

-- Also update the profile if the admin user already exists (idempotent)
update public.profiles
set role = 'admin'
where email = 'sandip@gmail.com'
  and role <> 'admin';
