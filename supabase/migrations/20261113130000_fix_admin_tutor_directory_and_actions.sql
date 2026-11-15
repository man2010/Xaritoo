-- Keep promoted admin accounts out of the tutor directory and authorize admin review actions.

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
      'tutors', (select count(*) from public.tutor_profiles tp join public.profiles p on p.user_id=tp.user_id where p.user_role::text='tutor'),
      'pending', (select count(*) from public.tutor_profiles tp join public.profiles p on p.user_id=tp.user_id where p.user_role::text='tutor' and tp.approval_status='pending'),
      'approved', (select count(*) from public.tutor_profiles tp join public.profiles p on p.user_id=tp.user_id where p.user_role::text='tutor' and tp.approval_status='approved'),
      'rejected', (select count(*) from public.tutor_profiles tp join public.profiles p on p.user_id=tp.user_id where p.user_role::text='tutor' and tp.approval_status='rejected'),
      'paused', (select count(*) from public.tutor_profiles tp join public.profiles p on p.user_id=tp.user_id where p.user_role::text='tutor' and tp.approval_status='paused'),
      'conversations', (select count(*) from public.tutor_conversations),
      'open_conversations', (select count(*) from public.tutor_conversations where status='open')
    ),
    'tutors', coalesce((select jsonb_agg(to_jsonb(t) order by t.created_at desc) from (
      select tp.id,tp.user_id,p.full_name,tp.display_name,tp.education,tp.profession,tp.bio,tp.photo_url,
        tp.whatsapp_number,tp.support_areas,tp.subject_strengths,tp.tutoring_format,tp.student_levels,
        tp.availability,tp.weekly_commitment,tp.approval_status,tp.approved_at,tp.created_at,au.email
      from public.tutor_profiles tp join public.profiles p on p.user_id=tp.user_id
      join auth.users au on au.id=tp.user_id
      where p.user_role::text='tutor'
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

create or replace function public.xaritoo_guard_tutor_approval()
returns trigger language plpgsql set search_path='' as $$
begin
  if coalesce(auth.role(),'') <> 'service_role'
    and current_user <> 'postgres'
    and not exists(select 1 from public.profiles p where p.user_id=auth.uid() and p.user_role::text='admin') then
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
      new.approval_status:='pending'; new.approved_at:=null;
    end if;
  elsif new.approval_status='approved' and old.approval_status is distinct from 'approved' then
    if trim(new.display_name)='' or trim(new.bio)='' or new.whatsapp_number=''
      or cardinality(new.support_areas)=0 or cardinality(new.subject_strengths)=0
      or cardinality(new.tutoring_format)=0 then
      raise exception 'Tutor profile needs a name, bio, WhatsApp, subjects, support areas, and tutoring format before approval';
    end if;
  end if;
  return new;
end $$;
