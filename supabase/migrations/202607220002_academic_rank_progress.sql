-- Flexible customization documents and authoritative academic rank progress.

-- Keep this migration safe to run directly from the Supabase SQL editor. The
-- normal migration chain creates this table earlier, but a pasted migration
-- must not assume that the earlier file was also pasted.
create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

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

alter table public.academic_passports
  add column if not exists pori_preferences jsonb not null default '{}'::jsonb,
  add column if not exists card_preferences jsonb not null default '{}'::jsonb,
  add column if not exists revision bigint not null default 0,
  add column if not exists last_synced_at timestamptz not null default now();

update public.academic_passports
set
  pori_preferences = coalesce(preferences -> 'pori', '{}'::jsonb),
  card_preferences = preferences - 'pori',
  revision = greatest(revision, 1),
  last_synced_at = updated_at;

alter table public.academic_passports
  drop constraint if exists academic_passports_pori_preferences_object,
  add constraint academic_passports_pori_preferences_object
    check (jsonb_typeof(pori_preferences) = 'object'),
  drop constraint if exists academic_passports_card_preferences_object,
  add constraint academic_passports_card_preferences_object
    check (jsonb_typeof(card_preferences) = 'object'),
  drop constraint if exists academic_passports_revision_nonnegative,
  add constraint academic_passports_revision_nonnegative check (revision >= 0);

create or replace function public.sync_academic_passport_documents()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.preferences := coalesce(new.preferences, '{}'::jsonb);
  new.pori_preferences := coalesce(new.preferences -> 'pori', '{}'::jsonb);
  new.card_preferences := new.preferences - 'pori';
  new.revision := case
    when tg_op = 'INSERT' then greatest(coalesce(new.revision, 0), 1)
    when new.preferences is distinct from old.preferences then old.revision + 1
    else old.revision
  end;
  new.last_synced_at := now();
  return new;
end;
$$;

drop trigger if exists academic_passports_sync_documents on public.academic_passports;
create trigger academic_passports_sync_documents
before insert or update on public.academic_passports
for each row execute function public.sync_academic_passport_documents();

revoke all on function public.sync_academic_passport_documents() from public;
revoke all on function public.sync_academic_passport_documents() from authenticated;

create table if not exists public.academic_rank_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current_rank_id text not null default 'wayfinder',
  current_level smallint not null default 1,
  calculated_level smallint not null default 1,
  next_rank_id text,
  earned_rank_ids text[] not null default array['wayfinder']::text[],
  metrics jsonb not null default '{}'::jsonb,
  requirements jsonb not null default '{}'::jsonb,
  last_promoted_at timestamptz,
  calculated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint academic_rank_progress_current_rank_check check (
    current_rank_id in (
      'wayfinder', 'passport-holder', 'record-keeper', 'credit-mapper',
      'gap-navigator', 'route-builder', 'passage-ready'
    )
  ),
  constraint academic_rank_progress_next_rank_check check (
    next_rank_id is null or next_rank_id in (
      'passport-holder', 'record-keeper', 'credit-mapper',
      'gap-navigator', 'route-builder', 'passage-ready'
    )
  ),
  constraint academic_rank_progress_level_check check (current_level between 1 and 7),
  constraint academic_rank_progress_calculated_level_check check (calculated_level between 1 and 7),
  constraint academic_rank_progress_metrics_object check (jsonb_typeof(metrics) = 'object'),
  constraint academic_rank_progress_requirements_object check (jsonb_typeof(requirements) = 'object')
);

create table if not exists public.academic_rank_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  rank_id text not null,
  rank_level smallint not null check (rank_level between 1 and 7),
  earned_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id, rank_level),
  constraint academic_rank_events_rank_check check (
    rank_id in (
      'wayfinder', 'passport-holder', 'record-keeper', 'credit-mapper',
      'gap-navigator', 'route-builder', 'passage-ready'
    )
  )
);

alter table public.academic_rank_progress enable row level security;
alter table public.academic_rank_events enable row level security;

drop policy if exists "students read own academic rank" on public.academic_rank_progress;
create policy "students read own academic rank"
on public.academic_rank_progress for select
using (user_id = auth.uid());

drop policy if exists "students read own academic rank events" on public.academic_rank_events;
create policy "students read own academic rank events"
on public.academic_rank_events for select
using (user_id = auth.uid());

create index if not exists academic_rank_events_user_level_idx
  on public.academic_rank_events(user_id, rank_level);

create or replace function public.refresh_academic_rank_progress(target_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  all_rank_ids text[] := array[
    'wayfinder', 'passport-holder', 'record-keeper', 'credit-mapper',
    'gap-navigator', 'route-builder', 'passage-ready'
  ];
  profile_ready boolean := false;
  passport_ready boolean := false;
  pori_ready boolean := false;
  transcript_ready boolean := false;
  gap_ready boolean := false;
  roadmap_ready boolean := false;
  packet_ready boolean := false;
  transcript_id_value uuid;
  gap_analysis_id_value uuid;
  roadmap_id_value uuid;
  course_count_value integer := 0;
  reviewed_course_count_value integer := 0;
  mapped_course_count_value integer := 0;
  resolved_mapping_count_value integer := 0;
  mapped_credits_value numeric := 0;
  gap_requirement_count_value integer := 0;
  planned_gap_requirement_count_value integer := 0;
  completed_roadmap_items_value integer := 0;
  completed_priority_items_value integer := 0;
  total_roadmap_items_value integer := 0;
  calculated_level_value smallint := 1;
  previous_level_value smallint := 0;
  current_level_value smallint := 1;
  current_rank_value text;
  next_rank_value text;
  earned_rank_ids_value text[];
  metrics_value jsonb;
  requirements_value jsonb;
begin
  if target_user_id is null or not exists (
    select 1 from auth.users where id = target_user_id
  ) then
    return;
  end if;

  select exists (
    select 1
    from public.student_profiles profile
    where profile.user_id = target_user_id
      and nullif(trim(profile.first_name), '') is not null
      and nullif(trim(profile.origin_country), '') is not null
      and nullif(trim(profile.source_curriculum), '') is not null
      and nullif(trim(profile.destination_country), '') is not null
      and nullif(trim(profile.target_state), '') is not null
  ) into profile_ready;

  select
    coalesce((select passport.completion_state = 'saved'
      from public.academic_passports passport
      where passport.user_id = target_user_id), false),
    coalesce((select passport.pori_preferences ->> 'status' = 'complete'
      from public.academic_passports passport
      where passport.user_id = target_user_id), false)
  into passport_ready, pori_ready;

  select transcript.id,
    transcript.confirmed_at is not null or transcript.confirmation_status = 'confirmed'
  into transcript_id_value, transcript_ready
  from public.transcripts transcript
  where transcript.user_id = target_user_id
  order by transcript.created_at desc
  limit 1;

  transcript_ready := coalesce(transcript_ready, false);

  if transcript_id_value is not null then
    select
      count(*)::integer,
      count(*) filter (where course.student_confirmed)::integer
    into course_count_value, reviewed_course_count_value
    from public.transcript_courses course
    where course.user_id = target_user_id
      and course.transcript_id = transcript_id_value;

    select
      count(distinct mapping.transcript_course_id) filter (
        where coalesce(mapping.mapping_status, mapping.status, 'candidate')
          not in ('rejected', 'replaced', 'failed')
      )::integer,
      count(distinct mapping.transcript_course_id) filter (
        where coalesce(mapping.mapping_status, mapping.status, 'candidate') in (
          'accepted', 'confirmed', 'student_confirmed', 'counselor_confirmed',
          'counselor_review_required', 'needs_counselor_review', 'counselor_review'
        )
      )::integer,
      coalesce(sum(coalesce(mapping.possible_credit_value, mapping.credits_mapped, 0)) filter (
        where coalesce(mapping.mapping_status, mapping.status, 'candidate')
          not in ('rejected', 'replaced', 'failed')
      ), 0)
    into mapped_course_count_value, resolved_mapping_count_value, mapped_credits_value
    from public.credit_mappings mapping
    where mapping.user_id = target_user_id
      and mapping.transcript_id = transcript_id_value;

    select analysis.id, analysis.status in ('completed', 'needs_review')
    into gap_analysis_id_value, gap_ready
    from public.gap_analyses analysis
    where analysis.user_id = target_user_id
      and analysis.transcript_id = transcript_id_value
    order by analysis.created_at desc
    limit 1;
  end if;

  gap_ready := coalesce(gap_ready, false);

  if gap_analysis_id_value is not null then
    select
      count(*)::integer,
      count(*) filter (
        where coalesce(requirement.missing_amount, requirement.credits_remaining, 0) <= 0
          or requirement.status in ('satisfied', 'likely_satisfied', 'not_applicable')
          or cardinality(coalesce(requirement.suggested_actions, '{}'::text[])) > 0
          or nullif(trim(requirement.counselor_question), '') is not null
      )::integer
    into gap_requirement_count_value, planned_gap_requirement_count_value
    from public.gap_requirements requirement
    where requirement.user_id = target_user_id
      and requirement.gap_analysis_id = gap_analysis_id_value;

    select roadmap.id, roadmap.status in ('active', 'completed', 'needs_review')
    into roadmap_id_value, roadmap_ready
    from public.roadmaps roadmap
    where roadmap.user_id = target_user_id
      and roadmap.gap_analysis_id = gap_analysis_id_value
    order by roadmap.created_at desc
    limit 1;
  end if;

  roadmap_ready := coalesce(roadmap_ready, false);

  if roadmap_id_value is not null then
    select
      count(*)::integer,
      count(*) filter (
        where item.status in ('done', 'completed') or item.completed_at is not null
      )::integer,
      count(*) filter (
        where (item.status in ('done', 'completed') or item.completed_at is not null)
          and item.priority in ('high', 'critical')
      )::integer
    into total_roadmap_items_value, completed_roadmap_items_value, completed_priority_items_value
    from public.roadmap_items item
    where item.user_id = target_user_id
      and item.roadmap_id = roadmap_id_value;
  end if;

  select exists (
    select 1
    from public.counselor_packets packet
    where packet.user_id = target_user_id
      and (transcript_id_value is null or packet.transcript_id = transcript_id_value)
      and packet.status in ('ready', 'needs_review', 'html_ready', 'pdf_ready')
      and packet.stale_reason is null
  ) into packet_ready;

  if profile_ready and passport_ready and pori_ready then
    calculated_level_value := 2;
  end if;
  if calculated_level_value >= 2
    and transcript_ready
    and course_count_value >= 3
    and reviewed_course_count_value >= course_count_value then
    calculated_level_value := 3;
  end if;
  if calculated_level_value >= 3
    and mapped_course_count_value >= ceil(course_count_value * 0.8)
    and resolved_mapping_count_value >= mapped_course_count_value
    and mapped_credits_value >= 3 then
    calculated_level_value := 4;
  end if;
  if calculated_level_value >= 4
    and gap_ready
    and gap_requirement_count_value > 0
    and planned_gap_requirement_count_value >= gap_requirement_count_value then
    calculated_level_value := 5;
  end if;
  if calculated_level_value >= 5
    and roadmap_ready
    and completed_roadmap_items_value >= 2
    and completed_priority_items_value >= 1 then
    calculated_level_value := 6;
  end if;
  if calculated_level_value >= 6
    and total_roadmap_items_value > 0
    and completed_roadmap_items_value >= greatest(3, ceil(total_roadmap_items_value / 2.0))
    and packet_ready then
    calculated_level_value := 7;
  end if;

  select coalesce(progress.current_level, 0)
  into previous_level_value
  from public.academic_rank_progress progress
  where progress.user_id = target_user_id;

  previous_level_value := coalesce(previous_level_value, 0);
  current_level_value := greatest(calculated_level_value, previous_level_value, 1);
  current_rank_value := all_rank_ids[current_level_value];
  next_rank_value := case when current_level_value < 7 then all_rank_ids[current_level_value + 1] end;
  earned_rank_ids_value := all_rank_ids[1:current_level_value];

  metrics_value := jsonb_build_object(
    'profileReady', profile_ready,
    'passportComplete', passport_ready,
    'poriComplete', pori_ready,
    'transcriptConfirmed', transcript_ready,
    'courseCount', course_count_value,
    'reviewedCourseCount', reviewed_course_count_value,
    'mappedCourseCount', mapped_course_count_value,
    'resolvedMappingCount', resolved_mapping_count_value,
    'mappedCredits', mapped_credits_value,
    'gapAnalysisReady', gap_ready,
    'gapRequirementCount', gap_requirement_count_value,
    'plannedGapRequirementCount', planned_gap_requirement_count_value,
    'roadmapReady', roadmap_ready,
    'completedRoadmapItems', completed_roadmap_items_value,
    'completedHighPriorityRoadmapItems', completed_priority_items_value,
    'totalRoadmapItems', total_roadmap_items_value,
    'packetReady', packet_ready
  );

  requirements_value := jsonb_build_object(
    'passport-holder', jsonb_build_object(
      'profile', profile_ready, 'passport', passport_ready, 'pori', pori_ready
    ),
    'record-keeper', jsonb_build_object(
      'minimumCourses', course_count_value >= 3,
      'allCoursesReviewed', course_count_value >= 3 and reviewed_course_count_value >= course_count_value,
      'transcriptConfirmed', transcript_ready
    ),
    'credit-mapper', jsonb_build_object(
      'coverageAtLeast80Percent', course_count_value > 0 and mapped_course_count_value >= ceil(course_count_value * 0.8),
      'allMappingsResolved', mapped_course_count_value > 0 and resolved_mapping_count_value >= mapped_course_count_value,
      'minimumMappedCredits', mapped_credits_value >= 3
    ),
    'gap-navigator', jsonb_build_object(
      'analysisReady', gap_ready,
      'requirementsReviewed', gap_requirement_count_value > 0,
      'everyGapPlanned', gap_requirement_count_value > 0 and planned_gap_requirement_count_value >= gap_requirement_count_value
    ),
    'route-builder', jsonb_build_object(
      'roadmapReady', roadmap_ready,
      'twoActionsComplete', completed_roadmap_items_value >= 2,
      'priorityActionComplete', completed_priority_items_value >= 1
    ),
    'passage-ready', jsonb_build_object(
      'halfRoadmapComplete', total_roadmap_items_value > 0
        and completed_roadmap_items_value >= greatest(3, ceil(total_roadmap_items_value / 2.0)),
      'packetReady', packet_ready
    )
  );

  insert into public.academic_rank_progress (
    user_id, current_rank_id, current_level, calculated_level, next_rank_id,
    earned_rank_ids, metrics, requirements, last_promoted_at, calculated_at, updated_at
  ) values (
    target_user_id, current_rank_value, current_level_value, calculated_level_value, next_rank_value,
    earned_rank_ids_value, metrics_value, requirements_value,
    case when current_level_value > 1 then now() end, now(), now()
  )
  on conflict (user_id) do update set
    current_rank_id = excluded.current_rank_id,
    current_level = excluded.current_level,
    calculated_level = excluded.calculated_level,
    next_rank_id = excluded.next_rank_id,
    earned_rank_ids = excluded.earned_rank_ids,
    metrics = excluded.metrics,
    requirements = excluded.requirements,
    last_promoted_at = case
      when excluded.current_level > academic_rank_progress.current_level then now()
      else academic_rank_progress.last_promoted_at
    end,
    calculated_at = now(),
    updated_at = now();

  insert into public.academic_rank_events (user_id, rank_id, rank_level, earned_at)
  select target_user_id, rank.rank_id, rank.rank_level::smallint, now()
  from unnest(all_rank_ids) with ordinality as rank(rank_id, rank_level)
  where rank.rank_level <= current_level_value
  on conflict (user_id, rank_level) do nothing;
end;
$$;

revoke all on function public.refresh_academic_rank_progress(uuid) from public;
revoke all on function public.refresh_academic_rank_progress(uuid) from authenticated;

create or replace function public.refresh_my_academic_rank()
returns public.academic_rank_progress
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  result public.academic_rank_progress;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;
  perform public.refresh_academic_rank_progress(auth.uid());
  select * into result
  from public.academic_rank_progress
  where user_id = auth.uid();
  return result;
end;
$$;

grant execute on function public.refresh_my_academic_rank() to authenticated;

create or replace function public.refresh_academic_rank_from_row()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  target_user_id uuid;
begin
  target_user_id := case when tg_op = 'DELETE' then old.user_id else new.user_id end;
  perform public.refresh_academic_rank_progress(target_user_id);
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

revoke all on function public.refresh_academic_rank_from_row() from public;
revoke all on function public.refresh_academic_rank_from_row() from authenticated;

do $$
declare
  source_table text;
begin
  foreach source_table in array array[
    'student_profiles', 'academic_passports', 'transcripts', 'transcript_courses',
    'credit_mappings', 'gap_analyses', 'gap_requirements', 'roadmaps',
    'roadmap_items', 'counselor_packets'
  ] loop
    execute format('drop trigger if exists %I on public.%I', source_table || '_refresh_rank', source_table);
    execute format(
      'create trigger %I after insert or update or delete on public.%I for each row execute function public.refresh_academic_rank_from_row()',
      source_table || '_refresh_rank',
      source_table
    );
  end loop;
end;
$$;

do $$
declare
  existing_user record;
begin
  for existing_user in select id from auth.users loop
    perform public.refresh_academic_rank_progress(existing_user.id);
  end loop;
end;
$$;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
    and not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'academic_rank_progress'
    ) then
    alter publication supabase_realtime add table public.academic_rank_progress;
  end if;
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
    and not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'academic_passports'
    ) then
    alter publication supabase_realtime add table public.academic_passports;
  end if;
end;
$$;

comment on table public.academic_rank_progress is
  'Backend-derived, monotonic academic rank state. Users may read their row but cannot set their own level.';
comment on table public.academic_rank_events is
  'Immutable first-earned timestamps for each student rank.';
