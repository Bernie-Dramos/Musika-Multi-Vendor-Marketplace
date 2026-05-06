-- ============================================================
-- Migration 006: Orders table
-- ============================================================

create table if not exists public.orders (
  id               uuid        primary key default gen_random_uuid(),
  user_id          uuid        not null references public.profiles(id) on delete cascade,
  items            jsonb       not null default '[]'::jsonb,
  subtotal         numeric(10, 2) not null,
  shipping         numeric(10, 2) not null default 0,
  total            numeric(10, 2) generated always as (subtotal + shipping) stored,
  status           text        not null default 'pending'
                               check (status in ('pending', 'confirmed', 'processing', 'delivered', 'cancelled')),
  delivery_address jsonb,
  booking_details  jsonb,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Indexes
create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

-- updated_at trigger
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists orders_updated_at on public.orders;
create trigger orders_updated_at
  before update on public.orders
  for each row execute function public.handle_updated_at();

-- Row Level Security
alter table public.orders enable row level security;

-- Users can read and insert their own orders
create policy "Users manage own orders"
  on public.orders
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Admins can read all orders
create policy "Admins read all orders"
  on public.orders
  for select
  using (public.is_admin());
