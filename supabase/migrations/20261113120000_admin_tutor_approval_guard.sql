-- Allow the verified Xaritoo admin role to approve/reject/pause tutor listings.
-- This guard runs inside the status RPC and continues to protect direct user updates.

create or replace function public.xaritoo_guard_tutor_approval()
returns trigger language plpgsql set search_path='' as $$
begin
  if coalesce(auth.role(),'') <> 'service_role'
    and current_user <> 'postgres'
    and not exists (
      select 1 from public.profiles p
      where p.user_id=auth.uid() and p.user_role::text='admin'
    ) then
    if new.approval_status is distinct from old.approval_status
      or new.approved_at is distinct from old.approved_at then
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
    if trim(new.display_name)='' or trim(new.bio)='' or new.whatsapp_number=''
      or cardinality(new.support_areas)=0 or cardinality(new.subject_strengths)=0
      or cardinality(new.tutoring_format)=0 then
      raise exception 'Tutor profile needs a name, bio, WhatsApp, subjects, support areas, and tutoring format before approval';
    end if;
  end if;
  return new;
end $$;
