-- Admin review workspace and private tutor photo uploads.
-- Run after 20261112000000_xaritoo_profiles_and_tutoring.sql.

alter type public.xaritoo_account_role add value if not exists 'admin';

create table if not exists public.xaritoo_admin_audit (
  id bigint generated always as identity primary key,
  admin_user_id uuid not null references auth.users(id) on delete restrict,
  action text not null,
  tutor_profile_id uuid references public.tutor_profiles(id) on delete set null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.xaritoo_admin_audit enable row level security;
revoke all on public.xaritoo_admin_audit from anon, authenticated;

create or replace function public.xaritoo_admin_dashboard()
returns jsonb language plpgsql stable security definer set search_path='' as $$
declare result jsonb;
begin
  if not exists(select 1 from public.profiles p where p.user_id=auth.uid() and p.user_role::text='admin') then
    raise exception 'Administrator access required';
  end if;
  select jsonb_build_object(
    'summary', jsonb_build_object(
      'students', (select count(*) from public.profiles where user_role::text='student'),
      'tutors', (select count(*) from public.tutor_profiles),
      'pending', (select count(*) from public.tutor_profiles where approval_status='pending'),
      'approved', (select count(*) from public.tutor_profiles where approval_status='approved'),
      'rejected', (select count(*) from public.tutor_profiles where approval_status='rejected'),
      'paused', (select count(*) from public.tutor_profiles where approval_status='paused'),
      'conversations', (select count(*) from public.tutor_conversations),
      'open_conversations', (select count(*) from public.tutor_conversations where status='open')
    ),
    'tutors', coalesce((select jsonb_agg(to_jsonb(t) order by t.created_at desc) from (
      select tp.id,tp.user_id,p.full_name,tp.display_name,tp.education,tp.profession,tp.bio,tp.photo_url,
        tp.whatsapp_number,tp.support_areas,tp.subject_strengths,tp.tutoring_format,tp.student_levels,
        tp.availability,tp.weekly_commitment,tp.approval_status,tp.approved_at,tp.created_at,au.email
      from public.tutor_profiles tp join public.profiles p on p.user_id=tp.user_id
      join auth.users au on au.id=tp.user_id
    ) t), '[]'::jsonb),
    'members', coalesce((select jsonb_agg(to_jsonb(m) order by m.created_at desc) from (
      select p.user_id,p.full_name,p.user_role,p.created_at,au.email
      from public.profiles p join auth.users au on au.id=p.user_id
      order by p.created_at desc limit 300
    ) m), '[]'::jsonb),
    'conversations', coalesce((select jsonb_agg(to_jsonb(c) order by c.updated_at desc) from (
      select tc.id,tc.support_area,tc.status,tc.created_at,tc.updated_at,
        coalesce(nullif(sp.student_name,''),sp.guardian_name) as student_name,
        tp.display_name as tutor_name,
        (select count(*) from public.tutor_messages tm where tm.conversation_id=tc.id) as message_count
      from public.tutor_conversations tc
      join public.student_profiles sp on sp.user_id=tc.student_user_id
      join public.tutor_profiles tp on tp.id=tc.tutor_profile_id
      order by tc.updated_at desc limit 300
    ) c), '[]'::jsonb),
    'audit', coalesce((select jsonb_agg(to_jsonb(a) order by a.created_at desc) from (
      select aa.id,aa.action,aa.tutor_profile_id,aa.details,aa.created_at,p.full_name as admin_name
      from public.xaritoo_admin_audit aa join public.profiles p on p.user_id=aa.admin_user_id
      order by aa.created_at desc limit 30
    ) a), '[]'::jsonb)
  ) into result;
  return result;
end $$;

create or replace function public.xaritoo_admin_set_tutor_status(
  p_tutor_profile_id uuid, p_status text, p_note text default ''
) returns void language plpgsql security definer set search_path='' as $$
declare next_status public.xaritoo_tutor_status;
begin
  if not exists(select 1 from public.profiles p where p.user_id=auth.uid() and p.user_role::text='admin') then
    raise exception 'Administrator access required';
  end if;
  if p_status not in ('pending','approved','rejected','paused') then raise exception 'Invalid tutor status'; end if;
  next_status:=p_status::public.xaritoo_tutor_status;
  update public.tutor_profiles set approval_status=next_status,
    approved_at=case when next_status='approved' then now() else null end
  where id=p_tutor_profile_id;
  if not found then raise exception 'Tutor profile not found'; end if;
  insert into public.xaritoo_admin_audit(admin_user_id,action,tutor_profile_id,details)
    values(auth.uid(),'tutor_status_changed',p_tutor_profile_id,
      jsonb_build_object('status',p_status,'note',left(trim(coalesce(p_note,'')),1000)));
end $$;

revoke all on function public.xaritoo_admin_dashboard() from public,anon,authenticated;
revoke all on function public.xaritoo_admin_set_tutor_status(uuid,text,text) from public,anon,authenticated;
grant execute on function public.xaritoo_admin_dashboard() to authenticated;
grant execute on function public.xaritoo_admin_set_tutor_status(uuid,text,text) to authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('xaritoo-tutor-photos','xaritoo-tutor-photos',true,3145728,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=true,file_size_limit=3145728,allowed_mime_types=array['image/jpeg','image/png','image/webp'];

drop policy if exists xaritoo_tutor_photo_public_read on storage.objects;
create policy xaritoo_tutor_photo_public_read on storage.objects for select to public
  using(bucket_id='xaritoo-tutor-photos');
drop policy if exists xaritoo_tutor_photo_owner_insert on storage.objects;
create policy xaritoo_tutor_photo_owner_insert on storage.objects for insert to authenticated
  with check(bucket_id='xaritoo-tutor-photos' and (storage.foldername(name))[1]=(select auth.uid())::text
    and exists(select 1 from public.profiles p where p.user_id=(select auth.uid()) and p.user_role::text='tutor'));
drop policy if exists xaritoo_tutor_photo_owner_update on storage.objects;
create policy xaritoo_tutor_photo_owner_update on storage.objects for update to authenticated
  using(bucket_id='xaritoo-tutor-photos' and (storage.foldername(name))[1]=(select auth.uid())::text
    and exists(select 1 from public.profiles p where p.user_id=(select auth.uid()) and p.user_role::text='tutor'))
  with check(bucket_id='xaritoo-tutor-photos' and (storage.foldername(name))[1]=(select auth.uid())::text
    and exists(select 1 from public.profiles p where p.user_id=(select auth.uid()) and p.user_role::text='tutor'));
drop policy if exists xaritoo_tutor_photo_owner_delete on storage.objects;
create policy xaritoo_tutor_photo_owner_delete on storage.objects for delete to authenticated
  using(bucket_id='xaritoo-tutor-photos' and (storage.foldername(name))[1]=(select auth.uid())::text
    and exists(select 1 from public.profiles p where p.user_id=(select auth.uid()) and p.user_role::text='tutor'));

-- After signing up the chosen admin account, run in SQL Editor as the project owner:
-- update public.profiles p set user_role='admin'
-- from auth.users u where u.id=p.user_id and lower(u.email)=lower('admin@example.com');
