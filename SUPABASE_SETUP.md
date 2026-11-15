# Xaritoo Supabase setup

The migrations are `supabase/migrations/20261112000000_xaritoo_profiles_and_tutoring.sql`, `supabase/migrations/20261112100000_xaritoo_admin_and_photos.sql`, `supabase/migrations/20261113120000_admin_tutor_approval_guard.sql`, and `supabase/migrations/20261113130000_fix_admin_tutor_directory_and_actions.sql`. Together they create student/guardian and tutor profiles, the approval-controlled directory, private conversations, a secured admin workspace, an audit log, and tutor photo storage.

## 1. Run the database migrations

1. Open the Xaritoo project in the Supabase Dashboard.
2. Go to **SQL Editor** → **New query**.
3. Run all four migrations in timestamp order. Copy each entire SQL file into its own SQL Editor query. If the first three were already run, run only the fourth migration now.
4. If Supabase reports a permission error for the `supabase_realtime` publication, ask a project owner to enable Realtime for `public.tutor_messages` in **Database** → **Publications**. The app continues to support sending and loading messages without live updates.

New tutors are hidden from students until approved. The second migration creates the `xaritoo-tutor-photos` public bucket; uploads are limited to signed-in tutor accounts, their own user-ID folder, JPG/PNG/WebP files, and 3 MB per photo.

## 2. Create the first administrator

1. Create the intended administrator account through the normal `/account` sign-up flow. Do not insert credentials directly into `auth.users`.
2. In Supabase **SQL Editor**, run this as the project owner after replacing the email with that account's sign-in email:

```sql
update public.profiles p
set user_role = 'admin'
from auth.users u
where u.id = p.user_id
  and lower(u.email) = lower('admin@example.com');
```

3. Sign out and sign back in. The `/account` page opens the admin workspace for that account. Admin is not a public sign-up role and cannot be assigned by ordinary users.

The workspace provides tutor approvals, tutor/member directories, platform conversation activity (without private message text), and an audit trail. Admin-only SQL functions re-check the caller's role before returning data or changing a tutor listing.

## 3. Configure local development

1. In the Dashboard, open **Connect** and copy the project URL and **Publishable key**. These are also under **Project Settings** → **API Keys**.
2. Add the following values to a local `.env.local` file at the repository root. Replace the placeholders; do not commit the file.

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_SECRET_KEY=sb_secret_...
```

The first two variables are used in the browser and must be a **publishable** key. The secret key is server-only and is used by the existing WhatsApp webhook's tutor lookup. The app accepts the older `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_KEY` names for backward compatibility, but new setups should use the current publishable/secret keys. Never use `NEXT_PUBLIC_` on a secret key.

## 4. Gmail SMTP and six-digit signup verification

In Supabase **Authentication** → **SMTP Settings**, enable custom SMTP and use:

| Setting | Value |
| --- | --- |
| Sender email | `xaritoomentorship@gmail.com` |
| Sender name | `Xaritoo Mentorship` |
| Host | `smtp.gmail.com` |
| Port | `587` (STARTTLS) |
| Username | `xaritoomentorship@gmail.com` |
| Password | A Google **App Password**, not the normal Gmail password |

Google requires 2-Step Verification to create an App Password. Generate it in the Google Account for `xaritoomentorship@gmail.com`, then enter it only in the Supabase SMTP settings; never add it to `.env.local`, the repo, or this chat. See [Google App Password requirements](https://support.google.com/accounts/answer/185833?hl=en) and [Supabase custom SMTP setup](https://supabase.com/docs/guides/auth/auth-smtp).

Next, in **Authentication** → **Providers** → **Email**, keep email confirmations enabled, set the email OTP length to **6**, and set **Email OTP Expiration** to **30 seconds**. This Auth setting is enforced server-side; it also shortens the validity of other Auth email OTPs and links, including password resets. In **Authentication** → **Email Templates** → **Confirm signup**, set the subject to `Your Xaritoo Club verification code` and replace the body with the contents of [`supabase/templates/confirm-signup.html`](supabase/templates/confirm-signup.html). Confirm the template contains `{{ .Token }}` and remove `{{ .ConfirmationURL }}`. Save the template, then request a **new** signup email; previously sent emails remain links and are not changed retroactively.

The account form shows a six-digit input, a 30-second countdown, blocks expired codes in the UI, and offers a resend button when the countdown ends. To allow resending at 30 seconds, open **Authentication** → **Rate Limits** and set **Signup confirmation request** to **30 seconds** (the default is 60 seconds). The Auth server still decides whether a code is valid; changing only the website countdown does not revoke it. Supabase's built-in sender is limited to two emails per hour project-wide; custom SMTP avoids that built-in sender restriction, though other Auth rate limits still apply. See [Supabase OTP email templates](https://supabase.com/docs/guides/auth/auth-email-templates), [OTP expiry](https://supabase.com/docs/guides/auth/auth-email-passwordless), and [Auth rate limits](https://supabase.com/docs/guides/auth/rate-limits).

For production, add the same variables in **AWS Amplify** → your app → **Hosting** → **Environment variables**. Mark `SUPABASE_SECRET_KEY` as a secret if the console offers that option. The public URL and publishable key may be exposed to the client; the RLS policies are what restrict user access. `NEXT_PUBLIC_SUPABASE_URL` must be present when Next.js starts/builds because the Content Security Policy derives the allowed Supabase API and Realtime origins from it. Restart the local dev server after changing `next.config.ts` or the Supabase URL.

## 5. Enable email sign-in

1. Go to **Authentication** → **Sign In / Providers** (the Dashboard may label this **Auth** → **Providers**).
2. Enable **Email** sign-in and configure email confirmation to match your program's onboarding policy.
3. Go to **Authentication** → **URL Configuration**.
4. Set the **Site URL** to the deployed Xaritoo URL.
5. Add redirect URLs for the deployed account page (for example `https://YOUR_DOMAIN/account`) and local development (`http://localhost:3000/account`).

Students under 18 must create/use the student account with a parent, guardian, or responsible adult. The profile's guardian contact details and student goals are visible only to that account and a tutor after the student starts a conversation with them. Tutors' profiles and WhatsApp numbers are returned to signed-in student accounts only, and only after Xaritoo has approved the tutor.

## 6. Add and review tutor profiles

Tutors register at `/account`, choose **Volunteer tutor**, upload a photo from their device, complete the profile, and save it. The account remains **pending**. Admins review applications in the `/account` workspace and can approve, reject, pause, or return an application to review. Decisions are recorded in the admin audit log. The latest migrations authorize the authenticated admin role in the approval trigger, exclude promoted admin accounts from the tutor list, preserve profile-completeness checks, and prevent ordinary members from changing review status.

The tutor support-area choices use the exact Xaritoo Club registration dropdown labels so students can filter by the same categories. WhatsApp phone numbers must be international/E.164 format, for example `+16305551234`.

## Tables and access model

- `profiles`: account role and display name; a trigger creates this row on signup. A user cannot change their role.
- `student_profiles`: student and guardian information; readable by the account owner and a tutor only after a conversation exists.
- `tutor_profiles`: tutor application and listing fields; tutor status is pending until an administrator approves it.
- `xaritoo_admin_audit`: admin review decisions and notes; direct table access is revoked from browser roles.
- `storage.objects` in `xaritoo-tutor-photos`: public photo reads, with writes restricted to the signed-in tutor's own folder.
- `tutor_conversations` and `tutor_messages`: private student-to-tutor threads; only the two participants can read messages.
- `xaritoo_list_approved_tutors`: returns selected public tutor-card fields to signed-in student accounts. It does not return tutor email or account IDs.
- `xaritoo_start_conversation`, `xaritoo_my_conversations`, `xaritoo_send_message`, and `xaritoo_conversation_messages`: authenticated functions that validate the caller and keep message operations within participant boundaries.
- `xaritoo_admin_dashboard` and `xaritoo_admin_set_tutor_status`: admin-only functions that enforce role checks in the database.

All exposed tables have RLS enabled; direct inserts/deletes are revoked from app users. Profile writes are limited to editable columns, and role/approval fields are protected by database triggers. Do not remove those controls or expose the service/secret key.

## Before inviting families

Create a student/guardian test account and a tutor test account. Approve the test tutor, confirm the student sees only approved tutors, open a conversation, verify new messages arrive, and sign in as a third account to confirm it cannot see either profile or conversation. Confirm guardian contact and student notes do not appear in the tutor directory.
