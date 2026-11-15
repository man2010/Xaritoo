-- Xaritoo Club student/tutor accounts, approval-controlled directory, and private messaging.
-- Execute once in Supabase SQL Editor using the project owner role.

begin;
do $$ begin create type public.xaritoo_account_role as enum ('student','tutor');
exception when duplicate_object then null; end $$;
do $$ begin create type public.xaritoo_tutor_status as enum ('pending','approved','rejected','paused');
exception when duplicate_object then null; end $$;
do $$ begin create type public.xaritoo_conversation_status as enum ('open','closed');
exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  user_role public.xaritoo_account_role not null,
  full_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profile_name_length check (char_length(full_name) <= 120)
);
create table if not exists public.student_profiles (
  user_id uuid primary key references public.profiles(user_id) on delete cascade,
  student_name text not null default '',
  guardian_name text not null default '',
  guardian_phone text not null default '',
  grade_level text not null default '',
  school_name text not null default '',
  support_area text not null default '',
  goals text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint student_name_length check (char_length(student_name) <= 120),
  constraint guardian_name_length check (char_length(guardian_name) <= 120),
  constraint guardian_phone_length check (char_length(guardian_phone) <= 30),
  constraint student_grade_length check (char_length(grade_level) <= 60),
  constraint student_school_length check (char_length(school_name) <= 120),
  constraint student_goals_length check (char_length(goals) <= 500),
  constraint student_support_area_allowed check (support_area = '' or support_area = any(array[
    'Math Tutoring & Support','Science (Biology, Chemistry, Physics)','Writing, Reading & English',
    'Counseling','SAT / ACT Test Preparation','Scholarships & College Planning',
    'Career Guidance & Resume Building','Comprehensive Academic Tutoring',
    'General Mentorship & Accountability','Other / Multiple Areas'
  ]::text[]))
);
create table if not exists public.tutor_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(user_id) on delete cascade,
  display_name text not null default '',
  education text not null default '',
  profession text not null default '',
  bio text not null default '',
  photo_url text,
  whatsapp_number text not null default '',
  support_areas text[] not null default '{}',
  subject_strengths text[] not null default '{}',
  tutoring_format text[] not null default '{}',
  student_levels text not null default '',
  availability text not null default '',
  weekly_commitment text not null default '',
  approval_status public.xaritoo_tutor_status not null default 'pending',
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tutor_name_length check (char_length(display_name) <= 120),
  constraint tutor_education_length check (char_length(education) <= 180),
  constraint tutor_profession_length check (char_length(profession) <= 180),
  constraint tutor_bio_length check (char_length(bio) <= 1500),
  constraint tutor_photo_url check (photo_url is null or (char_length(photo_url) <= 500 and photo_url like 'https://%')),
  constraint tutor_availability_length check (char_length(availability) <= 500),
  constraint tutor_commitment_length check (char_length(weekly_commitment) <= 180),
  constraint tutor_whatsapp_e164 check (whatsapp_number = '' or whatsapp_number ~ '^\+[1-9][0-9]{7,14}$'),
  constraint tutor_areas_limit check (cardinality(support_areas) <= 10),
  constraint tutor_support_areas_allowed check (support_areas <@ array[
    'Math Tutoring & Support','Science (Biology, Chemistry, Physics)','Writing, Reading & English',
    'Counseling','SAT / ACT Test Preparation','Scholarships & College Planning',
    'Career Guidance & Resume Building','Comprehensive Academic Tutoring',
    'General Mentorship & Accountability','Other / Multiple Areas'
  ]::text[]),
  constraint tutor_strengths_limit check (cardinality(subject_strengths) <= 20 and char_length(array_to_string(subject_strengths, ',')) <= 500),
  constraint tutor_format_values check (tutoring_format <@ array['Virtual','In person']::text[])
);
create table if not exists public.tutor_conversations (
  id uuid primary key default gen_random_uuid(),
  student_user_id uuid not null references public.student_profiles(user_id) on delete cascade,
  tutor_user_id uuid not null references public.tutor_profiles(user_id) on delete cascade,
  tutor_profile_id uuid not null references public.tutor_profiles(id) on delete cascade,
  support_area text not null,
  status public.xaritoo_conversation_status not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint distinct_members check (student_user_id <> tutor_user_id),
  constraint unique_student_tutor_area unique (student_user_id,tutor_user_id,support_area)
);
create table if not exists public.tutor_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.tutor_conversations(id) on delete cascade,
  sender_user_id uuid not null references public.profiles(user_id) on delete cascade,
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now()
);
create index if not exists tutor_approved_areas_idx on public.tutor_profiles using gin(support_areas) where approval_status='approved';
create index if not exists tutor_conversations_student_idx on public.tutor_conversations(student_user_id,updated_at desc);
create index if not exists tutor_conversations_tutor_idx on public.tutor_conversations(tutor_user_id,updated_at desc);
create index if not exists tutor_messages_conversation_idx on public.tutor_messages(conversation_id,created_at);

create or replace function public.xaritoo_touch_updated_at()
returns trigger language plpgsql set search_path='' as $$
begin new.updated_at:=now(); return new; end $$;

create or replace function public.xaritoo_guard_profile_role()
returns trigger language plpgsql set search_path='' as $$
begin
  if new.user_role is distinct from old.user_role and coalesce(auth.role(),'') <> 'service_role' and current_user <> 'postgres' then
    raise exception 'Account role is managed by Xaritoo';
  end if;
  return new;
end $$;

create or replace function public.xaritoo_guard_tutor_approval()
returns trigger language plpgsql set search_path='' as $$
begin
  if coalesce(auth.role(),'') <> 'service_role' and current_user <> 'postgres' then
    if new.approval_status is distinct from old.approval_status or new.approved_at is distinct from old.approved_at then
      raise exception 'Tutor approval is managed by Xaritoo administrators';
    end if;
    if old.approval_status='approved' and (
      new.display_name is distinct from old.display_name or new.education is distinct from old.education or
      new.profession is distinct from old.profession or new.bio is distinct from old.bio or
      new.photo_url is distinct from old.photo_url or new.whatsapp_number is distinct from old.whatsapp_number or
      new.support_areas is distinct from old.support_areas or new.subject_strengths is distinct from old.subject_strengths or
      new.tutoring_format is distinct from old.tutoring_format or new.student_levels is distinct from old.student_levels or
      new.availability is distinct from old.availability or new.weekly_commitment is distinct from old.weekly_commitment
    ) then
      new.approval_status:='pending';
      new.approved_at:=null;
    end if;
  elsif new.approval_status='approved' and old.approval_status is distinct from 'approved' then
    if trim(new.display_name)='' or trim(new.bio)='' or new.whatsapp_number='' or
       cardinality(new.support_areas)=0 or cardinality(new.subject_strengths)=0 or cardinality(new.tutoring_format)=0 then
      raise exception 'Tutor profile needs a name, bio, WhatsApp, subjects, support areas, and tutoring format before approval';
    end if;
  end if;
  return new;
end $$;

create or replace function public.xaritoo_handle_signup()
returns trigger language plpgsql security definer set search_path='' as $$
declare requested_role text; safe_name text;
begin
  requested_role:=lower(coalesce(new.raw_user_meta_data->>'account_role','student'));
  if requested_role not in ('student','tutor') then requested_role:='student'; end if;
  safe_name:=left(trim(coalesce(new.raw_user_meta_data->>'full_name','')),120);
  insert into public.profiles(user_id,user_role,full_name)
    values(new.id,requested_role::public.xaritoo_account_role,safe_name);
  if requested_role='student' then
    insert into public.student_profiles(user_id,guardian_name) values(new.id,safe_name);
  else
    insert into public.tutor_profiles(user_id,display_name) values(new.id,safe_name);
  end if;
  return new;
end $$;

create or replace function public.xaritoo_list_approved_tutors(p_support_area text default null)
returns table(tutor_profile_id uuid,display_name text,education text,profession text,bio text,photo_url text,
  whatsapp_number text,support_areas text[],subject_strengths text[],tutoring_format text[],student_levels text,
  availability text,weekly_commitment text)
language plpgsql stable security definer set search_path='' as $$
begin
  if auth.uid() is null then raise exception 'Sign in is required'; end if;
  if not exists(select 1 from public.profiles p where p.user_id=auth.uid() and p.user_role='student') then
    raise exception 'Only students can browse the tutor directory';
  end if;
  return query select t.id,t.display_name,t.education,t.profession,t.bio,t.photo_url,t.whatsapp_number,
    t.support_areas,t.subject_strengths,t.tutoring_format,t.student_levels,t.availability,t.weekly_commitment
  from public.tutor_profiles t
  where t.approval_status='approved'
    and (nullif(trim(p_support_area),'') is null or trim(p_support_area)=any(t.support_areas))
  order by t.display_name;
end $$;

create or replace function public.xaritoo_start_conversation(p_tutor_profile_id uuid,p_support_area text,p_first_message text)
returns uuid language plpgsql security definer set search_path='' as $$
declare uid uuid:=auth.uid(); tutor public.tutor_profiles%rowtype; conversation_id uuid;
  area text:=left(trim(coalesce(p_support_area,'')),120); message text:=left(trim(coalesce(p_first_message,'')),4000);
begin
  if uid is null then raise exception 'Sign in is required'; end if;
  if not exists(select 1 from public.profiles p where p.user_id=uid and p.user_role='student') then
    raise exception 'Only students can start a tutor conversation';
  end if;
  if area='' or message='' then raise exception 'Choose a subject and write a message'; end if;
  select * into tutor from public.tutor_profiles t where t.id=p_tutor_profile_id
    and t.approval_status='approved' and area=any(t.support_areas);
  if not found then raise exception 'Tutor unavailable for this subject'; end if;
  insert into public.tutor_conversations(student_user_id,tutor_user_id,tutor_profile_id,support_area)
  values(uid,tutor.user_id,tutor.id,area)
  on conflict(student_user_id,tutor_user_id,support_area)
  do update set status='open',updated_at=now() returning id into conversation_id;
  insert into public.tutor_messages(conversation_id,sender_user_id,body) values(conversation_id,uid,message);
  return conversation_id;
end $$;

create or replace function public.xaritoo_my_conversations()
returns table(conversation_id uuid,support_area text,status public.xaritoo_conversation_status,
  other_name text,last_message text,updated_at timestamptz)
language plpgsql stable security definer set search_path='' as $$
begin
  if auth.uid() is null then raise exception 'Sign in is required'; end if;
  return query select c.id,c.support_area,c.status,
    case when c.student_user_id=auth.uid() then tp.display_name else sp.student_name end,
    (select m.body from public.tutor_messages m where m.conversation_id=c.id order by m.created_at desc limit 1),
    c.updated_at
  from public.tutor_conversations c
  join public.student_profiles sp on sp.user_id=c.student_user_id
  join public.tutor_profiles tp on tp.id=c.tutor_profile_id
  where c.student_user_id=auth.uid() or c.tutor_user_id=auth.uid()
  order by c.updated_at desc;
end $$;

create or replace function public.xaritoo_send_message(p_conversation_id uuid,p_body text)
returns uuid language plpgsql security definer set search_path='' as $$
declare uid uuid:=auth.uid(); message_id uuid; body_text text:=left(trim(coalesce(p_body,'')),4000);
begin
  if uid is null then raise exception 'Sign in is required'; end if;
  if body_text='' then raise exception 'Message cannot be empty'; end if;
  update public.tutor_conversations c set updated_at=now() where c.id=p_conversation_id
    and c.status='open' and (c.student_user_id=uid or c.tutor_user_id=uid);
  if not found then raise exception 'Conversation not found or closed'; end if;
  insert into public.tutor_messages(conversation_id,sender_user_id,body)
    values(p_conversation_id,uid,body_text) returning id into message_id;
  return message_id;
end $$;

create or replace function public.xaritoo_conversation_messages(p_conversation_id uuid)
returns table(id uuid,sender_user_id uuid,body text,created_at timestamptz)
language plpgsql stable security definer set search_path='' as $$
begin
  if auth.uid() is null or not exists(select 1 from public.tutor_conversations c where c.id=p_conversation_id
    and (c.student_user_id=auth.uid() or c.tutor_user_id=auth.uid())) then
    raise exception 'Conversation not found or access denied';
  end if;
  return query select m.id,m.sender_user_id,m.body,m.created_at from public.tutor_messages m
    where m.conversation_id=p_conversation_id order by m.created_at;
end $$;

do $$ begin
  if exists(select 1 from pg_publication where pubname='supabase_realtime')
    and not exists(select 1 from pg_publication_tables where pubname='supabase_realtime'
      and schemaname='public' and tablename='tutor_messages') then
    alter publication supabase_realtime add table public.tutor_messages;
  end if;
end $$;

drop trigger if exists xaritoo_auth_signup on auth.users;
create trigger xaritoo_auth_signup after insert on auth.users for each row execute function public.xaritoo_handle_signup();
drop trigger if exists xaritoo_profiles_touch on public.profiles;
create trigger xaritoo_profiles_touch before update on public.profiles for each row execute function public.xaritoo_touch_updated_at();
drop trigger if exists xaritoo_profiles_role_guard on public.profiles;
create trigger xaritoo_profiles_role_guard before update on public.profiles for each row execute function public.xaritoo_guard_profile_role();
drop trigger if exists xaritoo_students_touch on public.student_profiles;
create trigger xaritoo_students_touch before update on public.student_profiles for each row execute function public.xaritoo_touch_updated_at();
drop trigger if exists xaritoo_tutors_touch on public.tutor_profiles;
create trigger xaritoo_tutors_touch before update on public.tutor_profiles for each row execute function public.xaritoo_touch_updated_at();
drop trigger if exists xaritoo_tutors_approval_guard on public.tutor_profiles;
create trigger xaritoo_tutors_approval_guard before update on public.tutor_profiles for each row execute function public.xaritoo_guard_tutor_approval();

alter table public.profiles enable row level security;
alter table public.student_profiles enable row level security;
alter table public.tutor_profiles enable row level security;
alter table public.tutor_conversations enable row level security;
alter table public.tutor_messages enable row level security;

drop policy if exists profiles_read_self on public.profiles;
create policy profiles_read_self on public.profiles for select to authenticated using(user_id=(select auth.uid()));
drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles for update to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));

drop policy if exists student_profile_read_owner_or_matched_tutor on public.student_profiles;
create policy student_profile_read_owner_or_matched_tutor on public.student_profiles for select to authenticated using(
  user_id=(select auth.uid()) or exists(select 1 from public.tutor_conversations c
    where c.student_user_id=student_profiles.user_id and c.tutor_user_id=(select auth.uid()))
);
drop policy if exists student_profile_update_owner on public.student_profiles;
create policy student_profile_update_owner on public.student_profiles for update to authenticated
  using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));

drop policy if exists tutor_profile_owner_read on public.tutor_profiles;
create policy tutor_profile_owner_read on public.tutor_profiles for select to authenticated using(user_id=(select auth.uid()));
drop policy if exists tutor_profile_owner_update on public.tutor_profiles;
create policy tutor_profile_owner_update on public.tutor_profiles for update to authenticated
  using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));

drop policy if exists conversation_participant_read on public.tutor_conversations;
create policy conversation_participant_read on public.tutor_conversations for select to authenticated
  using(student_user_id=(select auth.uid()) or tutor_user_id=(select auth.uid()));
drop policy if exists message_participant_read on public.tutor_messages;
create policy message_participant_read on public.tutor_messages for select to authenticated using(
  exists(select 1 from public.tutor_conversations c where c.id=tutor_messages.conversation_id
    and (c.student_user_id=(select auth.uid()) or c.tutor_user_id=(select auth.uid())))
);

revoke all on public.profiles,public.student_profiles,public.tutor_profiles,public.tutor_conversations,public.tutor_messages from anon,authenticated;
grant select on public.profiles,public.student_profiles,public.tutor_profiles,public.tutor_conversations,public.tutor_messages to authenticated;
grant update(full_name) on public.profiles to authenticated;
grant update(student_name,guardian_name,guardian_phone,grade_level,school_name,support_area,goals) on public.student_profiles to authenticated;
grant update(display_name,education,profession,bio,photo_url,whatsapp_number,support_areas,subject_strengths,tutoring_format,student_levels,availability,weekly_commitment)
  on public.tutor_profiles to authenticated;

revoke all on function public.xaritoo_handle_signup() from public,anon,authenticated;
revoke all on function public.xaritoo_guard_profile_role() from public,anon,authenticated;
revoke all on function public.xaritoo_guard_tutor_approval() from public,anon,authenticated;
revoke all on function public.xaritoo_touch_updated_at() from public,anon,authenticated;
revoke all on function public.xaritoo_list_approved_tutors(text) from public,anon;
revoke all on function public.xaritoo_start_conversation(uuid,text,text) from public,anon;
revoke all on function public.xaritoo_my_conversations() from public,anon;
revoke all on function public.xaritoo_send_message(uuid,text) from public,anon;
revoke all on function public.xaritoo_conversation_messages(uuid) from public,anon;
grant execute on function public.xaritoo_list_approved_tutors(text) to authenticated;
grant execute on function public.xaritoo_start_conversation(uuid,text,text) to authenticated;
grant execute on function public.xaritoo_my_conversations() to authenticated;
grant execute on function public.xaritoo_send_message(uuid,text) to authenticated;
grant execute on function public.xaritoo_conversation_messages(uuid) to authenticated;

commit;

-- Admin approval (execute as Supabase project owner after checking a tutor):
-- update public.tutor_profiles set approval_status='approved',approved_at=now() where id='<tutor_profile_id>';
-- Disable a tutor listing:
-- update public.tutor_profiles set approval_status='paused',approved_at=null where id='<tutor_profile_id>';

