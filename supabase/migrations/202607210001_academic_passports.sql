create table if not exists public.academic_passports (
  user_id uuid primary key references auth.users(id) on delete cascade,
  preferences jsonb not null default '{}'::jsonb,
  asset_id text,
  completion_state text not null default 'not-started'
    check (completion_state in ('not-started', 'in-progress', 'requires-attention', 'saved')),
  last_completed_step smallint not null default 0
    check (last_completed_step between 0 and 6),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint academic_passports_preferences_object
    check (jsonb_typeof(preferences) = 'object')
);

alter table public.academic_passports enable row level security;

drop policy if exists "students own academic passport" on public.academic_passports;
create policy "students own academic passport"
on public.academic_passports
for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop trigger if exists academic_passports_updated_at on public.academic_passports;
create trigger academic_passports_updated_at
before update on public.academic_passports
for each row execute function public.set_updated_at();

comment on table public.academic_passports is
  'Editable, versioned Academic Passport customization state. Student information remains in student_profiles.';

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'passport-media',
  'passport-media',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "students read own passport media" on storage.objects;
create policy "students read own passport media"
on storage.objects for select to authenticated
using (bucket_id = 'passport-media' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "students upload own passport media" on storage.objects;
create policy "students upload own passport media"
on storage.objects for insert to authenticated
with check (bucket_id = 'passport-media' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "students update own passport media" on storage.objects;
create policy "students update own passport media"
on storage.objects for update to authenticated
using (bucket_id = 'passport-media' and (storage.foldername(name))[1] = auth.uid()::text)
with check (bucket_id = 'passport-media' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "students delete own passport media" on storage.objects;
create policy "students delete own passport media"
on storage.objects for delete to authenticated
using (bucket_id = 'passport-media' and (storage.foldername(name))[1] = auth.uid()::text);
