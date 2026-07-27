-- Private, authenticated feedback for Beta 1.0.
-- Every signed-in Beta 1.0 account is already a beta tester, so user_id is the
-- only tester identifier needed.

create table if not exists public.beta_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null check (category in ('bug', 'confusing', 'idea', 'other')),
  message text not null check (char_length(message) between 10 and 2000),
  page_path text not null default '/app',
  status text not null default 'new' check (status in ('new', 'reviewing', 'resolved')),
  created_at timestamptz not null default now()
);

create index if not exists beta_feedback_created_at_idx
  on public.beta_feedback (created_at desc);

create index if not exists beta_feedback_user_id_idx
  on public.beta_feedback (user_id);

alter table public.beta_feedback enable row level security;

drop policy if exists "beta testers submit own feedback" on public.beta_feedback;
create policy "beta testers submit own feedback"
on public.beta_feedback
for insert
to authenticated
with check (user_id = auth.uid());

revoke all on table public.beta_feedback from anon;
grant insert on table public.beta_feedback to authenticated;

comment on table public.beta_feedback is
  'Private Beta 1.0 product feedback linked to the authenticated tester.';
