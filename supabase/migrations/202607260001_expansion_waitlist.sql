-- Public route-expansion requests collected from the ScholaPort landing page.
-- Visitors may submit a request, but only trusted server/admin contexts may read the list.

create extension if not exists pgcrypto;

create table if not exists public.expansion_waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source_route text not null,
  destination_route text not null,
  created_at timestamptz not null default now(),
  constraint expansion_waitlist_email_format
    check (email = lower(email) and email ~* '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'),
  constraint expansion_waitlist_source_length
    check (char_length(source_route) between 2 and 120),
  constraint expansion_waitlist_destination_length
    check (char_length(destination_route) between 2 and 120),
  constraint expansion_waitlist_email_unique unique (email)
);

alter table public.expansion_waitlist enable row level security;

revoke all on table public.expansion_waitlist from anon, authenticated;
grant insert (email, source_route, destination_route)
  on table public.expansion_waitlist
  to anon, authenticated;

drop policy if exists "Visitors can request an expansion route"
  on public.expansion_waitlist;

create policy "Visitors can request an expansion route"
  on public.expansion_waitlist
  for insert
  to anon, authenticated
  with check (
    email = lower(email)
    and char_length(source_route) between 2 and 120
    and char_length(destination_route) between 2 and 120
  );
