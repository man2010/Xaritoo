-- Fix missing INSERT policy on xaritoo_admin_audit table.
-- The admin status RPC was unable to write audit logs because RLS was enabled
-- but no INSERT policy existed, causing silent failures on approval/rejection.

drop policy if exists xaritoo_admin_audit_insert on public.xaritoo_admin_audit;
create policy xaritoo_admin_audit_insert on public.xaritoo_admin_audit for insert
  to authenticated with check (
    admin_user_id=(select auth.uid())
    and exists (
      select 1 from public.profiles p
      where p.user_id=(select auth.uid()) and p.user_role::text='admin'
    )
  );
