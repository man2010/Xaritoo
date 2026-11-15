-- In-app notifications for tutor review decisions and new private messages.

create table if not exists public.xaritoo_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  notification_type text not null check (notification_type in ('tutor_status', 'new_message')),
  title text not null,
  body text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create index if not exists xaritoo_notifications_user_created_idx
  on public.xaritoo_notifications(user_id, created_at desc);
create index if not exists xaritoo_notifications_unread_idx
  on public.xaritoo_notifications(user_id, created_at desc) where read_at is null;

alter table public.xaritoo_notifications enable row level security;
revoke all on public.xaritoo_notifications from anon, authenticated;
grant select on public.xaritoo_notifications to authenticated;
grant update (read_at) on public.xaritoo_notifications to authenticated;

drop policy if exists xaritoo_notifications_read_own on public.xaritoo_notifications;
create policy xaritoo_notifications_read_own on public.xaritoo_notifications
  for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists xaritoo_notifications_mark_own_read on public.xaritoo_notifications;
create policy xaritoo_notifications_mark_own_read on public.xaritoo_notifications
  for update to authenticated using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create or replace function public.xaritoo_notify_message_recipient()
returns trigger language plpgsql security definer set search_path='' as $$
declare recipient_id uuid; sender_name text; area text;
begin
  select case when c.student_user_id = new.sender_user_id then c.tutor_user_id else c.student_user_id end,
         case when c.student_user_id = new.sender_user_id then tp.display_name else sp.guardian_name end,
         c.support_area
    into recipient_id, sender_name, area
  from public.tutor_conversations c
  join public.tutor_profiles tp on tp.id = c.tutor_profile_id
  join public.student_profiles sp on sp.user_id = c.student_user_id
  where c.id = new.conversation_id
    and (c.student_user_id = new.sender_user_id or c.tutor_user_id = new.sender_user_id);

  if recipient_id is not null then
    insert into public.xaritoo_notifications(user_id, notification_type, title, body, details)
    values (
      recipient_id,
      'new_message',
      'New message from ' || coalesce(nullif(sender_name, ''), 'a Xaritoo member'),
      left(new.body, 240),
      jsonb_build_object('conversation_id', new.conversation_id, 'support_area', area, 'sender_user_id', new.sender_user_id)
    );
  end if;
  return new;
end $$;

drop trigger if exists xaritoo_notify_message_recipient on public.tutor_messages;
create trigger xaritoo_notify_message_recipient
  after insert on public.tutor_messages
  for each row execute function public.xaritoo_notify_message_recipient();

create or replace function public.xaritoo_admin_set_tutor_status(
  p_tutor_profile_id uuid, p_status text, p_note text default ''
) returns void language plpgsql security definer set search_path='' as $$
declare
  next_status public.xaritoo_tutor_status;
  tutor_user_id uuid;
  tutor_name text;
  review_reason text := left(trim(coalesce(p_note, '')), 1000);
  notification_title text;
  notification_body text;
begin
  if not exists(select 1 from public.profiles p where p.user_id=auth.uid() and p.user_role::text='admin') then
    raise exception 'Administrator access required';
  end if;
  if p_status not in ('pending','approved','rejected','paused') then raise exception 'Invalid tutor status'; end if;
  if p_status = 'rejected' and review_reason = '' then
    raise exception 'A reason is required when rejecting a tutor profile';
  end if;

  next_status := p_status::public.xaritoo_tutor_status;
  update public.tutor_profiles
    set approval_status=next_status,
        approved_at=case when next_status='approved' then now() else null end
    where id=p_tutor_profile_id
    returning user_id, coalesce(nullif(display_name, ''), 'there') into tutor_user_id, tutor_name;
  if not found then raise exception 'Tutor profile not found'; end if;

  insert into public.xaritoo_admin_audit(admin_user_id,action,tutor_profile_id,details)
    values(auth.uid(),'tutor_status_changed',p_tutor_profile_id,
      jsonb_build_object('status',p_status,'note',review_reason));

  notification_title := case p_status
    when 'approved' then 'Your tutor profile is approved'
    when 'rejected' then 'Your tutor profile needs changes'
    when 'paused' then 'Your tutor profile is paused'
    else 'Your tutor profile is back under review'
  end;
  notification_body := case p_status
    when 'approved' then 'Congratulations, ' || tutor_name || '! Your profile is approved and visible to students.'
    when 'rejected' then 'Your profile was not approved yet. Please review the administrator feedback below.'
    when 'paused' then 'Your tutor profile is paused and is not currently shown to students.'
    else 'Your tutor profile is being reviewed again by the Xaritoo team.'
  end;

  insert into public.xaritoo_notifications(user_id,notification_type,title,body,details)
    values(tutor_user_id,'tutor_status',notification_title,notification_body,
      jsonb_build_object('tutor_profile_id',p_tutor_profile_id,'status',p_status,'reason',review_reason));
end $$;

revoke all on function public.xaritoo_admin_set_tutor_status(uuid,text,text) from public,anon,authenticated;
grant execute on function public.xaritoo_admin_set_tutor_status(uuid,text,text) to authenticated;

do $$ begin
  if exists(select 1 from pg_publication where pubname='supabase_realtime')
    and not exists(select 1 from pg_publication_tables where pubname='supabase_realtime'
      and schemaname='public' and tablename='xaritoo_notifications') then
    alter publication supabase_realtime add table public.xaritoo_notifications;
  end if;
end $$;
