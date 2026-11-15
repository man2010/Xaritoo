-- Permanently delete one Supabase Auth user by email.
-- Replace the example address below, review the matching account first,
-- then run the DELETE block in Supabase SQL Editor as the project owner.

-- 1) Preview the exact account that will be deleted:
select id, email, created_at
from auth.users
where lower(email) = lower(trim('mansourbalde2010@gmail.com'));

-- 2) Delete that account and let the configured foreign-key cascades remove
--    its Xaritoo profile, tutor/student data, conversations, messages, and notifications.
do $$
declare
  target_email text := lower(trim('mansourbalde2010@gmail.com'));
  target_user_id uuid;
begin
  select id
    into target_user_id
    from auth.users
    where lower(email) = target_email;

  if target_user_id is null then
    raise exception 'No Auth user found for %', target_email;
  end if;

  delete from auth.users
  where id = target_user_id;

  raise notice 'Deleted Auth user % (%)', target_email, target_user_id;
end $$;
