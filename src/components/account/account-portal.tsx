"use client";

import { useCallback, useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseBrowserClient, isSupabaseBrowserConfigured } from "@/lib/supabase-browser";

const SUPPORT_AREAS = [
  "Math Tutoring & Support",
  "Science (Biology, Chemistry, Physics)",
  "Writing, Reading & English",
  "Counseling",
  "SAT / ACT Test Preparation",
  "Scholarships & College Planning",
  "Career Guidance & Resume Building",
  "Comprehensive Academic Tutoring",
  "General Mentorship & Accountability",
  "Other / Multiple Areas",
];
const SIGNUP_CODE_LIFETIME_SECONDS = 30;

type AccountRole = "student" | "tutor" | "admin";
type Profile = { user_id: string; user_role: AccountRole; full_name: string };
type StudentProfile = {
  student_name: string; guardian_name: string; guardian_phone: string;
  grade_level: string; school_name: string; support_area: string; goals: string;
};
type TutorProfile = {
  id: string; display_name: string; education: string; profession: string; bio: string;
  photo_url: string | null; whatsapp_number: string; support_areas: string[];
  subject_strengths: string[]; tutoring_format: string[]; student_levels: string;
  availability: string; weekly_commitment: string; approval_status: string;
};
type TutorCard = Omit<TutorProfile, "id" | "approval_status"> & { tutor_profile_id: string };
type Conversation = {
  conversation_id: string; support_area: string; status: "open" | "closed";
  other_name: string; last_message: string; updated_at: string;
};
type ChatMessage = { id: string; sender_user_id: string; body: string; created_at: string };
type MemberNotification = {
  id: string;
  notification_type: "tutor_status" | "new_message";
  title: string;
  body: string;
  details: { conversation_id?: string; support_area?: string; status?: string; reason?: string };
  created_at: string;
  read_at: string | null;
};
type AdminTutor = TutorProfile & { user_id: string; full_name: string; email: string; created_at: string; approved_at: string | null };
type AdminMember = { user_id: string; full_name: string; user_role: AccountRole; created_at: string; email: string };
type AdminConversation = { id: string; support_area: string; status: string; created_at: string; updated_at: string; student_name: string; tutor_name: string; message_count: number };
type AdminAudit = { id: number; action: string; tutor_profile_id: string | null; details: { status?: string; note?: string }; created_at: string; admin_name: string };
type AdminDashboardData = { summary: Record<string, number>; tutors: AdminTutor[]; members: AdminMember[]; conversations: AdminConversation[]; audit: AdminAudit[] };

const blankStudent: StudentProfile = {
  student_name: "", guardian_name: "", guardian_phone: "", grade_level: "",
  school_name: "", support_area: "", goals: "",
};
const blankTutor = {
  display_name: "", education: "", profession: "", bio: "", photo_url: "",
  whatsapp_number: "", support_areas: [] as string[], subject_strengths: "",
  tutoring_format: [] as string[], student_levels: "", availability: "", weekly_commitment: "",
};

const fieldStyle = {
  width: "100%", boxSizing: "border-box" as const, padding: "12px 14px",
  border: "1px solid rgba(91,44,131,.2)", borderRadius: 10, color: "#251c2d",
  background: "#fff", font: "inherit",
};

function e164(value: string) {
  return value.replace(/[^+\d]/g, "");
}

function authErrorMessage(error: unknown) {
  const authError = error as { code?: string; message?: string };
  if (authError?.code === "over_email_send_rate_limit" || authError?.message?.toLowerCase().includes("email rate limit")) {
    return "Too many confirmation emails were requested. Please wait before trying again. For ongoing sign-ups, Xaritoo needs custom SMTP configured in Supabase.";
  }
  if (["email_already_in_use", "user_already_exists"].includes(authError?.code || "") || authError?.message?.toLowerCase().includes("already registered")) {
    return "This email may already have an account. Sign in or use “Forgot password?” to recover it.";
  }
  return authError?.message || "Authentication failed. Please try again.";
}

function DashboardIcon({ name }: { name: "overview" | "tutors" | "conversations" | "profile" }) {
  const common = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true as const };
  if (name === "overview") return <svg {...common}><rect x="3.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.5" /></svg>;
  if (name === "tutors") return <svg {...common}><path d="M12 20.5s-7.5-4.4-7.5-10a4.2 4.2 0 0 1 7.5-2.6 4.2 4.2 0 0 1 7.5 2.6c0 5.6-7.5 10-7.5 10Z" /><path d="M8.5 12h2l1-2.2 1.4 4 1-1.8h1.6" /></svg>;
  if (name === "conversations") return <svg {...common}><path d="M20.5 11.5a7.8 7.8 0 0 1-8.2 7.4 9 9 0 0 1-3.2-.6l-4.6 1.2 1.2-4.2a7 7 0 0 1-1.5-4.3 7.8 7.8 0 0 1 8.2-7.4 7.8 7.8 0 0 1 8.1 7.9Z" /><path d="M8.5 11.5h.1m3.3 0h.1m3.3 0h.1" /></svg>;
  return <svg {...common}><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></svg>;
}

export default function AccountPortal() {
  const configured = isSupabaseBrowserConfigured();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [student, setStudent] = useState<StudentProfile>(blankStudent);
  const [tutor, setTutor] = useState<TutorProfile | null>(null);
  const [tutorDraft, setTutorDraft] = useState(blankTutor);
  const [tutors, setTutors] = useState<TutorCard[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messageDraft, setMessageDraft] = useState("");
  const [newTutor, setNewTutor] = useState<TutorCard | null>(null);
  const [firstMessage, setFirstMessage] = useState("");
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [verificationPendingEmail, setVerificationPendingEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationSecondsLeft, setVerificationSecondsLeft] = useState(0);
  const [signupRole, setSignupRole] = useState<AccountRole>("student");
  const [guardianAttested, setGuardianAttested] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [directoryArea, setDirectoryArea] = useState("");
  const [dashboardSection, setDashboardSection] = useState<"overview" | "tutors" | "conversations" | "profile">("overview");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<MemberNotification[]>([]);
  const [adminDashboard, setAdminDashboard] = useState<AdminDashboardData | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);

  const client = useMemo(() => configured ? getSupabaseBrowserClient() : null, [configured]);

  useEffect(() => {
    if (!verificationPendingEmail || verificationSecondsLeft <= 0) return;
    const timer = window.setInterval(() => {
      setVerificationSecondsLeft((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [verificationPendingEmail, verificationSecondsLeft]);

  const loadAdminDashboard = useCallback(async () => {
    if (!client) return;
    const { data, error: dashboardError } = await client.rpc("xaritoo_admin_dashboard");
    if (dashboardError) throw dashboardError;
    setAdminDashboard(data as AdminDashboardData);
  }, [client]);

  const updateTutorApproval = useCallback(async (tutorId: string, status: string, note: string) => {
    if (!client) throw new Error("Supabase is not configured in this browser.");
    const { error: updateError } = await client.rpc("xaritoo_admin_set_tutor_status", {
      p_tutor_profile_id: tutorId,
      p_status: status,
      p_note: note.trim() || null,
    });
    if (updateError) throw updateError;
  }, [client]);

  const loadNotifications = useCallback(async (userId: string) => {
    if (!client) return;
    const { data, error: notificationError } = await client
      .from("xaritoo_notifications")
      .select("id,notification_type,title,body,details,created_at,read_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);
    if (notificationError) throw notificationError;
    setNotifications((data ?? []) as MemberNotification[]);
  }, [client]);

  const markNotificationRead = useCallback(async (notificationId: string) => {
    if (!client) return;
    const readAt = new Date().toISOString();
    setNotifications((current) => current.map((notification) =>
      notification.id === notificationId ? { ...notification, read_at: notification.read_at || readAt } : notification,
    ));
    const { error: readError } = await client.from("xaritoo_notifications")
      .update({ read_at: readAt }).eq("id", notificationId);
    if (readError) throw readError;
  }, [client]);

  const loadAccount = useCallback(async (currentSession: Session) => {
    if (!client) return;
    const uid = currentSession.user.id;
    const { data: account, error: profileError } = await client
      .from("profiles").select("user_id,user_role,full_name").eq("user_id", uid).single();
    if (profileError) throw profileError;
    const typedAccount = account as Profile;
    setProfile(typedAccount);
    setName(typedAccount.full_name);

    if (typedAccount.user_role === "admin") {
      setTutor(null);
      setStudent(blankStudent);
      await loadAdminDashboard();
      return;
    }
    if (typedAccount.user_role === "student") {
      const { data, error: studentError } = await client.from("student_profiles").select("*").eq("user_id", uid).single();
      if (studentError) throw studentError;
      setStudent(data as StudentProfile);
      const { data: directory, error: directoryError } = await client.rpc("xaritoo_list_approved_tutors", {
        p_support_area: (data as StudentProfile).support_area || null,
      });
      if (directoryError) throw directoryError;
      setTutors((directory ?? []) as TutorCard[]);
    } else {
      const { data, error: tutorError } = await client.from("tutor_profiles").select("*").eq("user_id", uid).single();
      if (tutorError) throw tutorError;
      const tutorProfile = data as TutorProfile;
      setTutor(tutorProfile);
      setTutorDraft({
        display_name: tutorProfile.display_name || "",
        education: tutorProfile.education || "",
        profession: tutorProfile.profession || "",
        bio: tutorProfile.bio || "",
        photo_url: tutorProfile.photo_url || "",
        whatsapp_number: tutorProfile.whatsapp_number || "",
        support_areas: tutorProfile.support_areas || [],
        subject_strengths: (tutorProfile.subject_strengths || []).join(", "),
        tutoring_format: tutorProfile.tutoring_format || [],
        student_levels: tutorProfile.student_levels || "",
        availability: tutorProfile.availability || "",
        weekly_commitment: tutorProfile.weekly_commitment || "",
      });
    }
    await loadConversations();
  }, [client, loadAdminDashboard]);

  const loadConversations = useCallback(async () => {
    if (!client) return;
    const { data, error: conversationsError } = await client.rpc("xaritoo_my_conversations");
    if (conversationsError) throw conversationsError;
    setConversations((data ?? []) as Conversation[]);
  }, [client]);

  useEffect(() => {
    if (!client) return;
    let alive = true;
    client.auth.getSession().then(async ({ data, error: sessionError }) => {
      if (!alive) return;
      if (sessionError) { setError(sessionError.message); return; }
      setSession(data.session);
      if (data.session) {
        try { await loadAccount(data.session); }
        catch (loadError) { if (alive) setError(loadError instanceof Error ? loadError.message : "Could not load your account."); }
      }
    });
    const { data: listener } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession) {
        setProfile(null); setTutor(null); setTutors([]); setConversations([]); setAdminDashboard(null); setNotifications([]);
        return;
      }
      queueMicrotask(() => loadAccount(nextSession).catch((loadError) =>
        setError(loadError instanceof Error ? loadError.message : "Could not load your account."),
      ));
    });
    return () => { alive = false; listener.subscription.unsubscribe(); };
  }, [client, loadAccount]);

  useEffect(() => {
    const userId = profile?.user_id;
    if (!client || !userId || profile?.user_role === "admin") return;
    let alive = true;
    void loadNotifications(userId).catch((loadError) => {
      if (alive) setError(loadError instanceof Error ? loadError.message : "Could not load notifications.");
    });
    const channel = client.channel(`xaritoo-notifications-${userId}`)
      .on("postgres_changes", {
        event: "*", schema: "public", table: "xaritoo_notifications", filter: `user_id=eq.${userId}`,
      }, () => {
        void loadNotifications(userId).catch((loadError) => {
          if (alive) setError(loadError instanceof Error ? loadError.message : "Could not refresh notifications.");
        });
      })
      .subscribe();
    return () => { alive = false; void client.removeChannel(channel); };
  }, [client, loadNotifications, profile?.user_id, profile?.user_role]);

  useEffect(() => {
    if (!client || !profile || profile.user_role !== "student") return;
    client.rpc("xaritoo_list_approved_tutors", { p_support_area: directoryArea || student.support_area || null })
      .then(({ data, error: directoryError }) => {
        if (directoryError) setError(directoryError.message);
        else setTutors((data ?? []) as TutorCard[]);
      });
  }, [client, directoryArea, profile, student.support_area]);

  useEffect(() => {
    if (!client || !activeConversation) return;
    const channel = client
      .channel(`xaritoo-conversation-${activeConversation}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "tutor_messages",
        filter: `conversation_id=eq.${activeConversation}`,
      }, () => {
        void refreshMessages(activeConversation);
        void loadConversations();
      })
      .subscribe();
    return () => { void client.removeChannel(channel); };
  }, [activeConversation, client, loadConversations]);

  async function handleAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!client) return;
    setBusy(true); setError(""); setNotice("");
    try {
      if (authMode === "signup") {
        if (password.length < 10) throw new Error("Use a password with at least 10 characters.");
        if (signupRole === "student" && !guardianAttested) throw new Error("A parent, guardian, or responsible adult must create and manage a student account.");
        const { data, error: signUpError } = await client.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { account_role: signupRole, full_name: name.trim() },
            emailRedirectTo: `${window.location.origin}/account`,
          },
        });
        if (signUpError) throw signUpError;
        if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
          setAuthMode("signin");
          setNotice("An account may already use this email. Sign in or use “Forgot password?” to recover it. One email can only have one Xaritoo account.");
        } else if (!data.session) {
          setVerificationPendingEmail(email.trim());
          setVerificationCode("");
          setVerificationSecondsLeft(SIGNUP_CODE_LIFETIME_SECONDS);
          setNotice("");
        }
        else setNotice("Your account is ready.");
      } else {
        const { error: signInError } = await client.auth.signInWithPassword({ email: email.trim(), password });
        if (signInError) throw signInError;
      }
    } catch (authError) {
      setError(authErrorMessage(authError));
    } finally { setBusy(false); }
  }

  async function sendPasswordReset() {
    if (!client) return;
    if (!email.trim()) { setError("Enter your email address first, and we’ll send you a password reset link."); return; }
    setBusy(true); setError(""); setNotice("");
    try {
      const { error: resetError } = await client.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/account` });
      if (resetError) throw resetError;
      setNotice("If an account exists for this email, a password reset link is on its way.");
    } catch (resetError) { setError(authErrorMessage(resetError)); }
    finally { setBusy(false); }
  }

  async function verifySignupCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!client || verificationCode.length !== 6) return;
    if (verificationSecondsLeft <= 0) { setError("This code has expired. Request a new one to continue."); return; }
    setBusy(true); setError(""); setNotice("");
    try {
      const { error: verifyError } = await client.auth.verifyOtp({
        email: verificationPendingEmail, token: verificationCode, type: "email",
      });
      if (verifyError) throw verifyError;
      setVerificationPendingEmail("");
      setVerificationCode("");
      setVerificationSecondsLeft(0);
      setNotice("Email verified. Your member space is ready.");
    } catch (verifyError) { setError(authErrorMessage(verifyError)); }
    finally { setBusy(false); }
  }

  async function resendSignupCode() {
    if (!client || !verificationPendingEmail) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const { error: resendError } = await client.auth.resend({
        type: "signup", email: verificationPendingEmail,
        options: { emailRedirectTo: `${window.location.origin}/account` },
      });
      if (resendError) throw resendError;
      setVerificationCode("");
      setVerificationSecondsLeft(SIGNUP_CODE_LIFETIME_SECONDS);
      setNotice("A new verification code has been sent. Only the latest code will work.");
    } catch (resendError) { setError(authErrorMessage(resendError)); }
    finally { setBusy(false); }
  }

  async function saveStudent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!client || !session) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const { error: saveError } = await client.from("student_profiles").update(student).eq("user_id", session.user.id);
      if (saveError) throw saveError;
      const { error: nameError } = await client.from("profiles").update({ full_name: student.guardian_name }).eq("user_id", session.user.id);
      if (nameError) throw nameError;
      setNotice("Student and guardian profile saved.");
      const { data, error: listError } = await client.rpc("xaritoo_list_approved_tutors", { p_support_area: student.support_area || null });
      if (listError) throw listError;
      setTutors((data ?? []) as TutorCard[]);
      await loadConversations();
    } catch (saveError) { setError(saveError instanceof Error ? saveError.message : "Could not save profile."); }
    finally { setBusy(false); }
  }

  async function saveTutor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!client || !session) return;
    if (!/^\+[1-9]\d{7,14}$/.test(e164(tutorDraft.whatsapp_number))) {
      setError("Enter the tutor WhatsApp number in international format, for example +16305551234.");
      return;
    }
    setBusy(true); setError(""); setNotice("");
    try {
      const update = {
        display_name: tutorDraft.display_name.trim(),
        education: tutorDraft.education.trim(), profession: tutorDraft.profession.trim(),
        bio: tutorDraft.bio.trim(), photo_url: tutorDraft.photo_url.trim() || null,
        whatsapp_number: e164(tutorDraft.whatsapp_number),
        support_areas: tutorDraft.support_areas,
        subject_strengths: tutorDraft.subject_strengths.split(",").map((item) => item.trim()).filter(Boolean).slice(0, 20),
        tutoring_format: tutorDraft.tutoring_format,
        student_levels: tutorDraft.student_levels.trim(), availability: tutorDraft.availability.trim(),
        weekly_commitment: tutorDraft.weekly_commitment.trim(),
      };
      const { data: savedTutor, error: saveError } = await client.from("tutor_profiles").update(update).eq("user_id", session.user.id).select("*").single();
      if (saveError) throw saveError;
      const { error: nameError } = await client.from("profiles").update({ full_name: update.display_name }).eq("user_id", session.user.id);
      if (nameError) throw nameError;
      setTutor(savedTutor as TutorProfile);
      setNotice((savedTutor as TutorProfile).approval_status === "approved"
        ? "Your tutor profile is updated."
        : "Tutor profile submitted for review. It will appear to students after Xaritoo approves it.");
      await loadConversations();
    } catch (saveError) { setError(saveError instanceof Error ? saveError.message : "Could not save tutor profile."); }
    finally { setBusy(false); }
  }

  async function startConversation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!client || !newTutor || !student.support_area) return;
    setBusy(true); setError("");
    try {
      const { data, error: startError } = await client.rpc("xaritoo_start_conversation", {
        p_tutor_profile_id: newTutor.tutor_profile_id,
        p_support_area: directoryArea || student.support_area,
        p_first_message: firstMessage,
      });
      if (startError) throw startError;
      setActiveConversation(data as string);
      setNewTutor(null); setFirstMessage("");
      await refreshMessages(data as string);
      await loadConversations();
    } catch (startError) { setError(startError instanceof Error ? startError.message : "Could not start conversation."); }
    finally { setBusy(false); }
  }

  async function refreshMessages(conversationId: string) {
    if (!client) return;
    const { data, error: messageError } = await client.rpc("xaritoo_conversation_messages", { p_conversation_id: conversationId });
    if (messageError) throw messageError;
    setMessages((data ?? []) as ChatMessage[]);
  }

  async function openConversation(conversationId: string) {
    setError("");
    try {
      await refreshMessages(conversationId);
      setActiveConversation(conversationId);
    } catch (openError) { setError(openError instanceof Error ? openError.message : "Could not open conversation."); }
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!client || !activeConversation || !messageDraft.trim()) return;
    setBusy(true); setError("");
    try {
      const { error: sendError } = await client.rpc("xaritoo_send_message", {
        p_conversation_id: activeConversation, p_body: messageDraft,
      });
      if (sendError) throw sendError;
      setMessageDraft("");
      await refreshMessages(activeConversation);
      await loadConversations();
    } catch (sendError) { setError(sendError instanceof Error ? sendError.message : "Could not send message."); }
    finally { setBusy(false); }
  }

  async function signOut() {
    if (!client) return;
    await client.auth.signOut();
    setNotice("You have signed out.");
  }

  function setStudentField(field: keyof StudentProfile, value: string) {
    setStudent((current) => ({ ...current, [field]: value }));
  }

  function setTutorField<K extends keyof typeof tutorDraft>(field: K, value: (typeof tutorDraft)[K]) {
    setTutorDraft((current) => ({ ...current, [field]: value }));
  }

  async function uploadTutorPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file || !client || !session) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Choose a JPG, PNG, or WebP photo."); return;
    }
    if (file.size > 3 * 1024 * 1024) { setError("Your photo must be 3 MB or smaller."); return; }
    setPhotoUploading(true); setError(""); setNotice("");
    try {
      const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
      const path = `${session.user.id}/profile.${extension}`;
      const { data, error: uploadError } = await client.storage.from("xaritoo-tutor-photos").upload(path, file, {
        cacheControl: "3600", contentType: file.type, upsert: true,
      });
      if (uploadError) throw uploadError;
      const { data: publicUrl } = client.storage.from("xaritoo-tutor-photos").getPublicUrl(data.path);
      setTutorField("photo_url", publicUrl.publicUrl);
      setNotice("Photo uploaded. Save your profile to apply the change.");
    } catch (uploadError) { setError(uploadError instanceof Error ? uploadError.message : "Could not upload your photo."); }
    finally { setPhotoUploading(false); }
  }

  const panelStyle = { background: "#fff", border: "1px solid rgba(91,44,131,.12)", borderRadius: 18, padding: "clamp(18px,4vw,30px)", boxShadow: "0 15px 45px rgba(50,25,77,.06)" };

  if (!configured) return (
    <main className="account-page" style={{ maxWidth: 760 }}>
      <h1 style={{ color: "#32194D", fontFamily: "var(--font-serif)" }}>Xaritoo Club accounts</h1>
      <section className="account-panel" style={panelStyle}>
        <h2>Supabase configuration is required</h2>
        <p>Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> to your local environment and hosting provider. Follow <code>SUPABASE_SETUP.md</code>.</p>
      </section>
    </main>
  );

  return (
    <main className={session ? "account-page account-page--member" : "account-page"} style={{ color: "#40364A" }}>
      {!session && <div className="account-intro">
        <p className="account-kicker" style={{ color: "#B58A2A", fontSize: 12, fontWeight: 800, letterSpacing: ".14em", textTransform: "uppercase" }}>Xaritoo Club</p>
        <h1 style={{ margin: "6px 0 8px", color: "#32194D", fontFamily: "var(--font-serif)", fontSize: "clamp(30px,5vw,44px)" }}>Member space</h1>
        <p style={{ margin: 0, lineHeight: 1.7 }}>Create a student or volunteer tutor account, find support by subject, and keep private conversations in one place.</p>
      </div>}

      {notice && <p id="admin-review-result" role="status" tabIndex={-1} style={{ ...panelStyle, borderColor: "rgba(79,125,85,.3)", color: "#315D37" }}>{notice}</p>}
      {error && <p id="admin-review-result" role="alert" tabIndex={-1} style={{ ...panelStyle, borderColor: "#C45A55", color: "#8A2925" }}>{error}</p>}

      {!session ? (
        <section className="account-panel account-auth-panel" style={{ ...panelStyle, maxWidth: 560 }}>
          <div className="account-auth-heading">
            <span>{verificationPendingEmail ? "EMAIL VERIFICATION" : authMode === "signin" ? "WELCOME BACK" : "XARITOO CLUB"}</span>
            <h2>{verificationPendingEmail ? "Check your email" : authMode === "signin" ? "Sign in to your account" : "Create your account"}</h2>
            <p>{verificationPendingEmail ? `Enter the 6-digit code sent to ${verificationPendingEmail}.` : authMode === "signin" ? "Continue to your conversations and member space." : "Join the community as a student or volunteer tutor."}</p>
          </div>
          {verificationPendingEmail ? <form onSubmit={verifySignupCode} className="account-otp-form">
            <label style={labelStyle}>6-digit verification code<input required type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={verificationCode} onChange={(event) => setVerificationCode(event.target.value.replace(/\D/g, "").slice(0, 6))} className="account-otp-input" aria-label="6-digit email verification code" /></label>
            <p className={verificationSecondsLeft > 0 ? "account-otp-countdown" : "account-otp-countdown account-otp-countdown--expired"} role="status">{verificationSecondsLeft > 0 ? `Code expires in 00:${String(verificationSecondsLeft).padStart(2, "0")}` : "This code has expired. Request a new one."}</p>
            <button disabled={busy || verificationCode.length !== 6 || verificationSecondsLeft <= 0} className="account-auth-submit" style={primaryButton}>{busy ? "Verifying…" : "Verify email"}<span aria-hidden="true">→</span></button>
            <p className="account-auth-switch">Didn’t receive the code?<button type="button" disabled={busy || verificationSecondsLeft > 0} onClick={() => void resendSignupCode()}>{verificationSecondsLeft > 0 ? `Resend in 00:${String(verificationSecondsLeft).padStart(2, "0")}` : "Resend code"}</button></p>
            <button type="button" className="account-change-email" onClick={() => { setVerificationPendingEmail(""); setVerificationCode(""); setAuthMode("signup"); setError(""); setNotice(""); }}>Use a different email</button>
          </form> : <>
          <form onSubmit={handleAuth} style={{ display: "grid", gap: 14 }}>
            {authMode === "signup" && <>
              <label style={labelStyle}>Account type
                <select value={signupRole} onChange={(event) => setSignupRole(event.target.value as AccountRole)} style={fieldStyle}>
                  <option value="student">Student / parent or guardian</option>
                  <option value="tutor">Volunteer tutor</option>
                </select>
              </label>
              <label style={labelStyle}>Your full name
                <input required maxLength={120} value={name} onChange={(event) => setName(event.target.value)} style={fieldStyle} autoComplete="name" />
              </label>
              {signupRole === "student" && <label style={{ display: "flex", alignItems: "flex-start", gap: 9, color: "#40364A", fontSize: 13, lineHeight: 1.5 }}>
                <input type="checkbox" checked={guardianAttested} onChange={(event) => setGuardianAttested(event.target.checked)} style={{ marginTop: 3 }} />
                I am a parent, guardian, or responsible adult who will create and manage this student account.
              </label>}
            </>}
            <label style={labelStyle}>Email address
              <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} style={fieldStyle} autoComplete="email" />
            </label>
            <label style={labelStyle}>Password
              <input required type="password" minLength={10} value={password} onChange={(event) => setPassword(event.target.value)} style={fieldStyle} autoComplete={authMode === "signup" ? "new-password" : "current-password"} />
            </label>
            {authMode === "signin" && <button type="button" className="account-forgot-link" onClick={() => void sendPasswordReset()} disabled={busy}>Forgot password?</button>}
            <button disabled={busy} className="account-auth-submit" style={primaryButton}>{busy ? "Please wait…" : authMode === "signup" ? "Create my account" : "Sign in"}<span aria-hidden="true">→</span></button>
          </form>
          <p className="account-auth-switch">{authMode === "signin" ? "Don’t have an account?" : "Already have an account?"}<button type="button" onClick={() => { setError(""); setNotice(""); setAuthMode(authMode === "signin" ? "signup" : "signin"); }}>{authMode === "signin" ? "Create an account" : "Sign in"}</button></p>
          {authMode === "signup" && <p className="account-auth-privacy">Students under 18 must use this space with a parent or guardian. Keep sensitive medical and financial details out of profile notes and messages.</p>}
          </>}
        </section>
      ) : !profile ? (
        <section className="account-panel" style={panelStyle}>Loading your secure profile…</section>
      ) : (
        <>
          <div className="member-topbar">
            <a href="/" className="member-topbar__brand" aria-label="Xaritoo home"><img src="/images/xaritoo-logo.jpeg" alt="" /><span>XARITOO</span></a>
            <div className="member-topbar__actions">
            {profile.user_role !== "admin" && <div className="member-notifications">
              <button type="button" className="member-notification-trigger" aria-label={`Notifications${notifications.filter((item) => !item.read_at).length ? `, ${notifications.filter((item) => !item.read_at).length} unread` : ""}`} aria-expanded={notificationMenuOpen} onClick={() => { setNotificationMenuOpen((open) => !open); setSelectedNotificationId(null); }}>
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></svg>
                {notifications.some((item) => !item.read_at) && <span className="member-notification-count">{Math.min(notifications.filter((item) => !item.read_at).length, 99)}</span>}
              </button>
              {notificationMenuOpen && <section className="member-notification-panel" aria-label="Notifications">
                <header><div><strong>Notifications</strong><small>{notifications.filter((item) => !item.read_at).length} unread</small></div><button type="button" aria-label="Close notifications" onClick={() => setNotificationMenuOpen(false)}>×</button></header>
                <div className="member-notification-list">
                  {notifications.length === 0 ? <p className="member-notification-empty">You’re all caught up. Profile updates and new messages will appear here.</p> : notifications.map((item) => <button key={item.id} type="button" className={`member-notification-item${item.read_at ? "" : " member-notification-item--unread"}`} onClick={() => {
                    setSelectedNotificationId(item.id);
                    if (!item.read_at) void markNotificationRead(item.id).catch((readError) => setError(readError instanceof Error ? readError.message : "Could not mark notification as read."));
                  }}>
                    <span className={`member-notification-kind${item.notification_type === "new_message" ? " member-notification-kind--message" : ""}`}>{item.notification_type === "new_message" ? "✉" : "✓"}</span>
                    <span className="member-notification-copy"><strong>{item.title}</strong><small>{item.body}</small><time>{new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.created_at))}</time></span>
                    {!item.read_at && <i aria-label="Unread" />}
                  </button>)}
                </div>
                {notifications.find((item) => item.id === selectedNotificationId) && (() => {
                  const item = notifications.find((entry) => entry.id === selectedNotificationId)!;
                  return <div className="member-notification-detail"><strong>{item.title}</strong><p>{item.body}</p>{item.details.status && <small>Status: {item.details.status}</small>}{item.details.reason && <p><strong>Admin feedback:</strong> {item.details.reason}</p>}{item.details.conversation_id && <button type="button" onClick={() => {
                    setNotificationMenuOpen(false);
                    setDashboardSection("conversations");
                    void openConversation(item.details.conversation_id!);
                  }}>Open conversation{item.details.support_area ? ` · ${item.details.support_area}` : ""} →</button>}</div>;
                })()}
              </section>}
            </div>}
            <div className="member-profile-menu">
              <button type="button" className="member-avatar" aria-label="Open profile menu" aria-haspopup="menu" aria-expanded={profileMenuOpen} onClick={() => setProfileMenuOpen((open) => !open)}>
                {(tutor?.photo_url || (typeof session.user.user_metadata?.avatar_url === "string" ? session.user.user_metadata.avatar_url : "")) ? <img src={tutor?.photo_url || String(session.user.user_metadata.avatar_url)} alt="" /> : <span>{(profile.full_name || session.user.email || "X").trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase()}</span>}
              </button>
              {profileMenuOpen && <div className="member-profile-popover" role="menu">
                <strong>{profile.full_name || "Xaritoo member"}</strong>
                <span>{profile.user_role === "student" ? "Student / guardian" : profile.user_role === "admin" ? "Xaritoo administrator" : "Volunteer tutor"}</span>
                <button type="button" role="menuitem" onClick={() => { setProfileMenuOpen(false); void signOut(); }}>Log out</button>
              </div>}
            </div>
            </div>
          </div>

          {profile.user_role === "admin" ? (
            adminDashboard ? <AdminWorkspace data={adminDashboard} onStatusChange={updateTutorApproval} onRefresh={loadAdminDashboard} /> :
              <section className="account-panel" style={panelStyle}>Loading the administration workspace…</section>
          ) : <>

          <section className="tutor-welcome">
            <div><span className="tutor-welcome__eyebrow">Xaritoo Club · {profile.user_role === "tutor" ? "Volunteer community" : "Student & family space"}</span><h2>{profile.user_role === "tutor" ? `Welcome, ${tutorDraft.display_name || profile.full_name.split(" ")[0]}!` : `Welcome, ${student.guardian_name || profile.full_name.split(" ")[0]}!`}</h2><p>{profile.user_role === "tutor" ? "Your experience can help a student feel more confident. Keep your profile up to date and stay close to your conversations." : "Find a tutor, tell us what support you need, and keep every conversation in one easy place."}</p></div>
            {profile.user_role === "tutor" ? <div className={`tutor-status tutor-status--${tutor?.approval_status || "pending"}`}><span className="tutor-status__dot" />{tutor?.approval_status === "approved" ? "Profile live" : tutor?.approval_status === "rejected" ? "Review needed" : "Under review"}</div> : <div className="tutor-status"><span className="tutor-status__dot" />{tutors.length} {tutors.length === 1 ? "tutor" : "tutors"} to explore</div>}
          </section>
          <nav className="tutor-dashboard-tabs" aria-label="Member space sections">
            <button type="button" aria-label="Overview" title="Overview" aria-current={dashboardSection === "overview" ? "page" : undefined} onClick={() => setDashboardSection("overview")}><DashboardIcon name="overview" /><span className="member-nav-label">Overview</span></button>
            {profile.user_role === "student" && <button type="button" aria-label="Tutors" title="Tutors" aria-current={dashboardSection === "tutors" ? "page" : undefined} onClick={() => setDashboardSection("tutors")}><DashboardIcon name="tutors" /><span className="member-nav-label">Tutors</span><b>{tutors.length}</b></button>}
            <button type="button" aria-label="Conversations" title="Conversations" aria-current={dashboardSection === "conversations" ? "page" : undefined} onClick={() => setDashboardSection("conversations")}><DashboardIcon name="conversations" /><span className="member-nav-label">Conversations</span><b>{conversations.length}</b></button>
            <button type="button" aria-label="My profile" title="My profile" aria-current={dashboardSection === "profile" ? "page" : undefined} onClick={() => setDashboardSection("profile")}><DashboardIcon name="profile" /><span className="member-nav-label">My profile</span></button>
          </nav>

          {profile.user_role === "student" ? (
            <>
              {dashboardSection === "overview" && <section className="member-overview">
                <article><span className="member-overview__icon">✦</span><div><h3>Your support area</h3><p>{student.support_area || "Choose a subject in your profile to find a great match."}</p></div><button type="button" onClick={() => setDashboardSection("profile")}>Complete profile <span aria-hidden="true">→</span></button></article>
                <article><span className="member-overview__icon">♡</span><div><h3>Find your tutor</h3><p>{tutors.length ? `${tutors.length} approved ${tutors.length === 1 ? "tutor is" : "tutors are"} ready to support you.` : "Browse available tutors and find the right support."}</p></div><button type="button" onClick={() => setDashboardSection("tutors")}>Explore tutors <span aria-hidden="true">→</span></button></article>
                <article><span className="member-overview__icon">✉</span><div><h3>Your conversations</h3><p>{conversations.length ? `${conversations.length} private conversation${conversations.length === 1 ? "" : "s"} with your support team.` : "Your messages with tutors will appear here."}</p></div><button type="button" onClick={() => setDashboardSection("conversations")}>Open messages <span aria-hidden="true">→</span></button></article>
              </section>}
              {dashboardSection === "profile" && <section className="account-panel" style={panelStyle}>
                <h2 style={sectionHeading}>Student &amp; guardian profile</h2>
                <p style={mutedText}>These details are private. A tutor can see them only after you start a conversation with that tutor.</p>
                <form onSubmit={saveStudent} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 }}>
                  <label style={labelStyle}>Student full name<input required maxLength={120} value={student.student_name} onChange={(e) => setStudentField("student_name", e.target.value)} style={fieldStyle} /></label>
                  <label style={labelStyle}>Parent / guardian name<input required maxLength={120} value={student.guardian_name} onChange={(e) => setStudentField("guardian_name", e.target.value)} style={fieldStyle} /></label>
                  <label style={labelStyle}>Guardian WhatsApp (optional)<input type="tel" maxLength={30} value={student.guardian_phone} onChange={(e) => setStudentField("guardian_phone", e.target.value)} style={fieldStyle} autoComplete="tel" /></label>
                  <label style={labelStyle}>Grade / school year<input required maxLength={60} value={student.grade_level} onChange={(e) => setStudentField("grade_level", e.target.value)} style={fieldStyle} /></label>
                  <label style={labelStyle}>School / district (optional)<input maxLength={120} value={student.school_name} onChange={(e) => setStudentField("school_name", e.target.value)} style={fieldStyle} /></label>
                  <label style={labelStyle}>Main support area<select required value={student.support_area} onChange={(e) => setStudentField("support_area", e.target.value)} style={fieldStyle}><option value="">Choose an area</option>{SUPPORT_AREAS.map((area) => <option key={area}>{area}</option>)}</select></label>
                  <label style={{ ...labelStyle, gridColumn: "1 / -1" }}>Goals and subjects<textarea maxLength={500} rows={3} value={student.goals} onChange={(e) => setStudentField("goals", e.target.value)} style={{ ...fieldStyle, resize: "vertical" }} placeholder="For example, Biology homework and scholarship essays" /></label>
                  <button disabled={busy} style={{ ...primaryButton, gridColumn: "1 / -1" }}>{busy ? "Saving…" : "Save my profile"}</button>
                </form>
              </section>}
              {dashboardSection === "tutors" && <section className="account-panel" style={panelStyle}>
                <h2 style={sectionHeading}>Tutors for your support area</h2>
                <label style={labelStyle}>Filter by area<select value={directoryArea || student.support_area} onChange={(e) => setDirectoryArea(e.target.value)} style={fieldStyle}><option value="">All approved tutors</option>{SUPPORT_AREAS.map((area) => <option key={area}>{area}</option>)}</select></label>
                <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
                  {tutors.length === 0 && <p style={mutedText}>No approved tutors are listed for this area yet. Check back soon or contact Xaritoo.</p>}
                  {tutors.map((item) => (
                    <article key={item.tutor_profile_id} style={{ border: "1px solid rgba(91,44,131,.13)", padding: 16, borderRadius: 14 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                        {item.photo_url && <img src={item.photo_url} alt={`${item.display_name} profile`} loading="lazy" referrerPolicy="no-referrer" style={{ width: 56, height: 56, objectFit: "cover", borderRadius: "50%" }} />}
                        <h3 style={{ margin: 0, color: "#32194D" }}>{item.display_name}</h3>
                      </div>
                      <p style={mutedText}>{[item.education, item.profession].filter(Boolean).join(" · ")}</p>
                      {item.bio && <p style={{ fontSize: 14, lineHeight: 1.6 }}>{item.bio}</p>}
                      <p style={mutedText}><strong>Areas:</strong> {item.support_areas.join(", ")}</p>
                      {item.subject_strengths.length > 0 && <p style={mutedText}><strong>Subjects:</strong> {item.subject_strengths.join(", ")}</p>}
                      {item.tutoring_format.length > 0 && <p style={mutedText}><strong>Format:</strong> {item.tutoring_format.join(" · ")}</p>}
                      {item.student_levels && <p style={mutedText}><strong>Student levels:</strong> {item.student_levels}</p>}
                      {item.availability && <p style={mutedText}><strong>Availability:</strong> {item.availability}</p>}
                      {item.weekly_commitment && <p style={mutedText}><strong>Commitment:</strong> {item.weekly_commitment}</p>}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                        <button type="button" onClick={() => { setNewTutor(item); setFirstMessage(""); }} style={primaryButton}>Message tutor</button>
                        {item.whatsapp_number && <a href={`https://wa.me/${item.whatsapp_number.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" style={{ ...secondaryButton, textDecoration: "none" }}>Contact on WhatsApp</a>}
                      </div>
                    </article>
                  ))}
                </div>
              </section>}
            </>
          ) : (
            dashboardSection === "profile" ? <section className="account-panel account-tutor-panel" style={{ ...panelStyle, maxWidth: 900 }}>
              <h2 style={sectionHeading}>Volunteer tutor profile</h2>
              <p style={mutedText}>A few details help students and families find the right support. You can update this anytime.</p>
              {tutor?.approval_status === "pending" && <p role="status" style={{ padding: 12, background: "#FFF7E6", borderRadius: 10 }}>Your profile is awaiting review. Students can see it after the Xaritoo team approves it.</p>}
              {tutor?.approval_status === "rejected" && <p role="status" style={{ padding: 12, background: "#FFF0EF", borderRadius: 10 }}>Please contact Xaritoo about your tutor application before submitting again.</p>}
              <form onSubmit={saveTutor} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 }}>
                <label style={labelStyle}>Display name<input required maxLength={120} value={tutorDraft.display_name} onChange={(e) => setTutorField("display_name", e.target.value)} style={fieldStyle} /></label>
                <label style={labelStyle}>Education<input maxLength={180} value={tutorDraft.education} onChange={(e) => setTutorField("education", e.target.value)} style={fieldStyle} /></label>
                <label style={labelStyle}>Profession<input maxLength={180} value={tutorDraft.profession} onChange={(e) => setTutorField("profession", e.target.value)} style={fieldStyle} /></label>
                <label style={labelStyle}>WhatsApp number in international format<input required type="tel" placeholder="+16305551234" value={tutorDraft.whatsapp_number} onChange={(e) => setTutorField("whatsapp_number", e.target.value)} style={fieldStyle} /></label>
                <div className="tutor-photo-field" style={{ gridColumn: "1 / -1" }}><label style={labelStyle}>Profile photo (optional)<span className="tutor-photo-field__control">{tutorDraft.photo_url ? <img src={tutorDraft.photo_url} alt="Tutor profile preview" /> : <span className="tutor-photo-field__placeholder" aria-hidden="true">{tutorDraft.display_name.slice(0, 1).toUpperCase() || "＋"}</span>}<span><strong>{photoUploading ? "Uploading photo…" : tutorDraft.photo_url ? "Change your photo" : "Choose a photo"}</strong><small>JPG, PNG, or WebP · up to 3 MB</small></span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadTutorPhoto} disabled={photoUploading} /></span></label></div>
                <label style={{ ...labelStyle, gridColumn: "1 / -1" }}>Background and experience<textarea required maxLength={1500} rows={4} value={tutorDraft.bio} onChange={(e) => setTutorField("bio", e.target.value)} style={{ ...fieldStyle, resize: "vertical" }} /></label>
                <fieldset className="tutor-area-picker" style={{ gridColumn: "1 / -1", border: 0, padding: 0, margin: 0 }}><legend style={labelStyle}>How can you help? <small style={mutedText}>Choose all that apply.</small></legend><div className="tutor-chip-grid">{SUPPORT_AREAS.map((area) => { const selected = tutorDraft.support_areas.includes(area); return <button key={area} type="button" className={selected ? "tutor-chip tutor-chip--selected" : "tutor-chip"} aria-pressed={selected} onClick={() => setTutorField("support_areas", selected ? tutorDraft.support_areas.filter((item) => item !== area) : [...tutorDraft.support_areas, area])}>{selected && <span aria-hidden="true">✓ </span>}{area}</button>; })}</div></fieldset>
                <label style={{ ...labelStyle, gridColumn: "1 / -1" }}>Subject strengths (comma-separated)<input required maxLength={500} value={tutorDraft.subject_strengths} onChange={(e) => setTutorField("subject_strengths", e.target.value)} style={fieldStyle} placeholder="Biology, Chemistry, scholarship essays" /></label>
                <fieldset style={{ gridColumn: "1 / -1", border: "1px solid rgba(91,44,131,.18)", borderRadius: 10, padding: 14 }}>
                  <legend style={labelStyle}>Tutoring format</legend>
                  {(["Virtual", "In person"] as const).map((format) => <label key={format} style={{ display: "inline-flex", alignItems: "center", gap: 8, marginRight: 20 }}><input type="checkbox" checked={tutorDraft.tutoring_format.includes(format)} onChange={(e) => setTutorField("tutoring_format", e.target.checked ? [...tutorDraft.tutoring_format, format] : tutorDraft.tutoring_format.filter((item) => item !== format))} />{format}</label>)}
                </fieldset>
                <label style={labelStyle}>Student levels<input maxLength={180} value={tutorDraft.student_levels} onChange={(e) => setTutorField("student_levels", e.target.value)} style={fieldStyle} placeholder="Middle school, high school…" /></label>
                <label style={labelStyle}>Availability<input maxLength={500} value={tutorDraft.availability} onChange={(e) => setTutorField("availability", e.target.value)} style={fieldStyle} placeholder="Days and time windows" /></label>
                <label style={labelStyle}>Weekly commitment<input maxLength={180} value={tutorDraft.weekly_commitment} onChange={(e) => setTutorField("weekly_commitment", e.target.value)} style={fieldStyle} placeholder="Once a week, 2–3 hours" /></label>
                <button disabled={busy} style={{ ...primaryButton, gridColumn: "1 / -1" }}>{busy ? "Saving…" : "Save tutor profile"}</button>
              </form>
            </section> : dashboardSection === "overview" ? <section className="member-overview">
              <article><span className="member-overview__icon">✦</span><div><h3>Your tutor profile</h3><p>{tutor?.approval_status === "approved" ? "Your profile is visible to students." : "Add your experience and support areas so families can find you."}</p></div><button type="button" onClick={() => setDashboardSection("profile")}>Update profile <span aria-hidden="true">→</span></button></article>
              <article><span className="member-overview__icon">✉</span><div><h3>Conversations</h3><p>{conversations.length ? `${conversations.length} student conversation${conversations.length === 1 ? "" : "s"} to follow up.` : "When a family contacts you, your conversation will appear here."}</p></div><button type="button" onClick={() => setDashboardSection("conversations")}>Open messages <span aria-hidden="true">→</span></button></article>
            </section> : null
          )}

          {dashboardSection === "conversations" && <section className="account-panel account-conversations" style={{ ...panelStyle, marginTop: 20 }}>
            <h2 style={sectionHeading}>Private conversations</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: 18 }}>
              <div style={{ display: "grid", alignContent: "start", gap: 8 }}>
                {conversations.length === 0 && <p style={mutedText}>Your tutor conversations will appear here.</p>}
                {conversations.map((conversation) => (
                  <button key={conversation.conversation_id} type="button" onClick={() => openConversation(conversation.conversation_id)} style={{ ...tabStyle(activeConversation === conversation.conversation_id), textAlign: "left", padding: 14 }}>
                    <strong style={{ display: "block" }}>{conversation.other_name || "Xaritoo member"} · {conversation.support_area}</strong>
                    <span style={{ display: "block", marginTop: 5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 12, fontWeight: 400 }}>{conversation.last_message}</span>
                  </button>
                ))}
              </div>
              <div style={{ minHeight: 200, border: "1px solid rgba(91,44,131,.12)", borderRadius: 12, padding: 14 }}>
                {!activeConversation ? <p style={mutedText}>Choose a conversation to read and reply.</p> : <>
                  <div style={{ display: "grid", gap: 8, maxHeight: 360, overflowY: "auto", marginBottom: 14 }}>
                    {messages.map((message) => <p key={message.id} style={{ justifySelf: message.sender_user_id === session.user.id ? "end" : "start", maxWidth: "85%", margin: 0, padding: "9px 12px", borderRadius: 12, background: message.sender_user_id === session.user.id ? "#5B2C83" : "#F2ECF7", color: message.sender_user_id === session.user.id ? "#fff" : "#251C2D", whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{message.body}</p>)}
                  </div>
                  <form className="account-chat-composer" onSubmit={sendMessage} style={{ display: "flex", gap: 8 }}>
                    <input maxLength={4000} value={messageDraft} onChange={(e) => setMessageDraft(e.target.value)} style={fieldStyle} placeholder="Write a private message…" />
                    <button disabled={busy || !messageDraft.trim()} style={primaryButton}>Send</button>
                  </form>
                </>}
              </div>
            </div>
          </section>}
          </>}
        </>
      )}

      {newTutor && <div role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setNewTutor(null); }} style={{ position: "fixed", inset: 0, zIndex: 1500, background: "rgba(25,13,36,.65)", display: "grid", placeItems: "center", padding: 16 }}>
        <section className="account-panel" role="dialog" aria-modal="true" aria-labelledby="new-conversation-title" style={{ ...panelStyle, width: "min(100%,520px)", maxHeight: "calc(100dvh - 32px)", overflowY: "auto" }}>
          <h2 id="new-conversation-title" style={sectionHeading}>Contact {newTutor.display_name}</h2>
          <p style={mutedText}>Your profile details are shared only with the tutor you contact, so they can respond to your request.</p>
          <form onSubmit={startConversation} style={{ display: "grid", gap: 12 }}>
            <label style={labelStyle}>Your first message<textarea required maxLength={4000} rows={4} value={firstMessage} onChange={(e) => setFirstMessage(e.target.value)} style={{ ...fieldStyle, resize: "vertical" }} /></label>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button type="button" onClick={() => setNewTutor(null)} style={secondaryButton}>Cancel</button>
              <button disabled={busy} style={primaryButton}>{busy ? "Sending…" : "Start private conversation"}</button>
            </div>
          </form>
        </section>
      </div>}
    </main>
  );
}

function AdminWorkspace({ data, onStatusChange, onRefresh }: {
  data: AdminDashboardData;
  onStatusChange: (tutorId: string, status: string, note: string) => Promise<void>;
  onRefresh: () => Promise<void>;
}) {
  const [section, setSection] = useState<"overview" | "approvals" | "members" | "conversations">("overview");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [search, setSearch] = useState("");
  const [reviewNote, setReviewNote] = useState("");
  const [submittingTutorId, setSubmittingTutorId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const summary = data.summary;
  const visibleTutors = data.tutors.filter((tutor) =>
    (statusFilter === "all" || tutor.approval_status === statusFilter) &&
    `${tutor.display_name} ${tutor.full_name} ${tutor.email} ${tutor.support_areas.join(" ")}`.toLowerCase().includes(search.toLowerCase()),
  );
  const formatDate = (value: string) => new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

  const handleStatusChange = async (tutor: AdminTutor, status: string) => {
    if (status === "rejected" && !reviewNote.trim()) {
      setSubmitError("Enter a rejection reason first. The tutor will receive this feedback in their notifications.");
      return;
    }
    setSubmittingTutorId(tutor.id);
    setSubmitError("");
    setSubmitSuccess("");
    try {
      await onStatusChange(tutor.id, status, reviewNote);
      setReviewNote("");
      setSubmitSuccess(`Tutor ${status === "approved" ? "approved" : status === "rejected" ? "rejected" : status}.`);
      try {
        await onRefresh();
      } catch (refreshError) {
        const message = refreshError instanceof Error ? refreshError.message : "Unknown refresh error.";
        setSubmitSuccess(`Tutor status was changed, but the dashboard could not refresh. Reload the page. (${message})`);
      }
    } catch (error) {
      const details = error as { code?: string; message?: string; details?: string; hint?: string };
      const message = [
        details?.message || (error instanceof Error ? error.message : "Unknown Supabase error."),
        details?.code && `Code: ${details.code}`,
        details?.details,
        details?.hint && `Hint: ${details.hint}`,
      ].filter(Boolean).join(" · ");
      setSubmitError(`Supabase did not change the tutor status. ${message}`);
    } finally {
      setSubmittingTutorId(null);
    }
  };

  const reviewForm = (tutor: AdminTutor, status: string, label: string, className = "", blockedReason = "") => {
    const isSubmitting = submittingTutorId === tutor.id;
    return <div key={status} style={{ display: "inline-block" }}>
      <button
        type="button"
        disabled={Boolean(blockedReason) || isSubmitting}
        title={blockedReason || undefined}
        className={`admin-action ${className}`}
        onClick={() => void handleStatusChange(tutor, status)}
      >
        {isSubmitting ? "Processing…" : label}
      </button>
      {blockedReason && <small className="admin-review-blocked">{blockedReason}</small>}
    </div>;
  };
  const statItems = [
    ["Students", summary.students ?? 0, "Across the member space"],
    ["Tutor applications", summary.tutors ?? 0, `${summary.pending ?? 0} waiting for review`],
    ["Approved tutors", summary.approved ?? 0, `${summary.paused ?? 0} paused listings`],
    ["Open conversations", summary.open_conversations ?? 0, `${summary.conversations ?? 0} total conversations`],
  ] as const;
  const tutorCard = (tutor: AdminTutor) => {
    const missingApprovalFields = [
      !(tutor.display_name || "").trim() && "name",
      !(tutor.bio || "").trim() && "bio",
      !(tutor.whatsapp_number || "").trim() && "WhatsApp number",
      !(tutor.support_areas || []).length && "support areas",
      !(tutor.subject_strengths || []).length && "subjects",
      !(tutor.tutoring_format || []).length && "tutoring format",
    ].filter(Boolean);
    const approvalBlockedReason = missingApprovalFields.length
      ? `Complete the tutor profile before approval: ${missingApprovalFields.join(", ")}.`
      : "";
    return <article className="admin-tutor-card" key={tutor.id}>
    <div className="admin-tutor-card__header">
      {tutor.photo_url ? <img src={tutor.photo_url} alt="" /> : <span>{tutor.display_name.slice(0, 1).toUpperCase() || "T"}</span>}
      <div><h3>{tutor.display_name || tutor.full_name}</h3><p>{tutor.email} · Applied {formatDate(tutor.created_at)}</p></div>
      <span className={`admin-status admin-status--${tutor.approval_status}`}>{tutor.approval_status}</span>
    </div>
    <div className="admin-tutor-card__facts">
      <p><strong>Education / profession</strong>{[tutor.education, tutor.profession].filter(Boolean).join(" · ") || "Not provided"}</p>
      <p><strong>WhatsApp</strong>{tutor.whatsapp_number || "Not provided"}</p>
      <p><strong>Support areas</strong>{tutor.support_areas.join(" · ") || "Not selected"}</p>
      <p><strong>Subjects & strengths</strong>{tutor.subject_strengths.join(" · ") || "Not provided"}</p>
      <p><strong>Format & levels</strong>{[...tutor.tutoring_format, tutor.student_levels].filter(Boolean).join(" · ") || "Not provided"}</p>
      <p><strong>Availability</strong>{[tutor.availability, tutor.weekly_commitment].filter(Boolean).join(" · ") || "Not provided"}</p>
    </div>
    {tutor.bio && <p className="admin-tutor-card__bio">{tutor.bio}</p>}
    <div className="admin-tutor-card__actions">
      {tutor.approval_status !== "approved" && reviewForm(tutor, "approved", "Approve tutor", "admin-action--approve", approvalBlockedReason)}
      {tutor.approval_status !== "rejected" && reviewForm(tutor, "rejected", "Reject", "admin-action--reject")}
      {tutor.approval_status === "approved" && reviewForm(tutor, "paused", "Pause listing")}
      {tutor.approval_status !== "pending" && reviewForm(tutor, "pending", "Return to review")}
    </div>
  </article>;
  };

  return <div className="admin-workspace">
    <header className="admin-workspace__heading"><div><span>ADMINISTRATION · XARITOO CLUB</span><h1>Platform overview</h1><p>Review applications, manage members, and monitor activity from one workspace.</p></div><span className="admin-secure-badge">Secure admin</span></header>
    {submitSuccess && <div role="status" style={{ position: "fixed", zIndex: 4000, top: "max(12px, env(safe-area-inset-top))", left: "50%", width: "min(620px, calc(100vw - 24px))", boxSizing: "border-box", padding: "14px 18px", border: "1px solid #86efac", borderRadius: 12, background: "#f0fdf4", color: "#166534", boxShadow: "0 14px 48px rgba(35,15,51,.2)", fontWeight: 600, transform: "translateX(-50%)" }}>{submitSuccess}</div>}
    {submitError && <div role="alert" style={{ position: "fixed", zIndex: 4000, top: "max(12px, env(safe-area-inset-top))", left: "50%", width: "min(620px, calc(100vw - 24px))", boxSizing: "border-box", padding: "14px 18px", border: "1px solid #fca5a5", borderRadius: 12, background: "#fef2f2", color: "#991b1b", boxShadow: "0 14px 48px rgba(35,15,51,.2)", fontWeight: 600, transform: "translateX(-50%)", overflowWrap: "anywhere" }}>{submitError}</div>}
    <nav className="admin-tabs" aria-label="Administration sections">
      {([["overview", "Overview"], ["approvals", `Tutor approvals (${summary.pending ?? 0})`], ["members", "Members"], ["conversations", "Conversations"]] as const).map(([key, label]) => <button key={key} type="button" aria-current={section === key ? "page" : undefined} onClick={() => setSection(key)}>{label}</button>)}
    </nav>
    {section === "overview" && <>
      <div className="admin-stats">{statItems.map(([label, value, hint]) => <article key={label}><span>{label}</span><strong>{value}</strong><small>{hint}</small></article>)}</div>
      <section className="admin-section"><div className="admin-section__heading"><div><h2>Applications to review</h2><p>New tutors stay hidden from students until approved.</p></div><button type="button" onClick={() => setSection("approvals")}>View all applications →</button></div>
        {data.tutors.some((tutor) => tutor.approval_status === "pending") && <div className="admin-filters"><label className="admin-filters__note">Rejection reason (required to reject)<input value={reviewNote} onChange={(event) => setReviewNote(event.target.value)} maxLength={1000} placeholder="This feedback will be sent to the tutor" /></label></div>}
        {data.tutors.filter((tutor) => tutor.approval_status === "pending").slice(0, 3).map(tutorCard)}
        {summary.pending === 0 && <p className="admin-empty">You’re all caught up. New tutor applications will appear here.</p>}
      </section>
      <section className="admin-section"><div className="admin-section__heading"><div><h2>Recent admin actions</h2><p>Approval decisions and listing changes.</p></div></div>
        {data.audit.length === 0 ? <p className="admin-empty">Admin actions will be recorded here.</p> : <div className="admin-audit-list">{data.audit.slice(0, 6).map((entry) => <article key={entry.id}><span className="admin-audit-list__marker" /><div><strong>{entry.admin_name || "Administrator"} {entry.action.replaceAll("_", " ")}</strong><p>{entry.details.status ? `Status set to ${entry.details.status}` : "Tutor application updated"}{entry.details.note ? ` · ${entry.details.note}` : ""}</p></div><time>{formatDate(entry.created_at)}</time></article>)}</div>}
      </section>
    </>}

    {section === "approvals" && <section className="admin-section"><div className="admin-section__heading"><div><h2>Tutor applications</h2><p>Review complete profiles and choose the appropriate listing status.</p></div></div>
      <div className="admin-filters"><label>Application status<select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="pending">Pending review</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="paused">Paused</option><option value="all">All applications</option></select></label><label>Search<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name, email, subject…" /></label><label className="admin-filters__note">Rejection reason (required to reject)<input value={reviewNote} onChange={(event) => setReviewNote(event.target.value)} maxLength={1000} placeholder="This feedback will be sent to the tutor" /></label></div>
      {visibleTutors.length ? visibleTutors.map(tutorCard) : <p className="admin-empty">No tutor applications match this view.</p>}
    </section>}

    {section === "members" && <section className="admin-section"><div className="admin-section__heading"><div><h2>Member directory</h2><p>{data.members.length} most recently created student, tutor, and admin accounts.</p></div><label className="admin-search"><span className="sr-only">Search members</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name or email" /></label></div>
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Member</th><th>Role</th><th>Joined</th></tr></thead><tbody>{data.members.filter((member) => `${member.full_name} ${member.email}`.toLowerCase().includes(search.toLowerCase())).map((member) => <tr key={member.user_id}><td><strong>{member.full_name || "No name provided"}</strong><small>{member.email}</small></td><td><span className="admin-role">{member.user_role}</span></td><td>{formatDate(member.created_at)}</td></tr>)}</tbody></table></div>
    </section>}

    {section === "conversations" && <section className="admin-section"><div className="admin-section__heading"><div><h2>Platform conversations</h2><p>Activity and participation overview. Private message contents are not shown here.</p></div></div>
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Student</th><th>Tutor</th><th>Support area</th><th>Status</th><th>Messages</th><th>Last activity</th></tr></thead><tbody>{data.conversations.map((conversation) => <tr key={conversation.id}><td>{conversation.student_name}</td><td>{conversation.tutor_name}</td><td>{conversation.support_area}</td><td><span className={`admin-status admin-status--${conversation.status}`}>{conversation.status}</span></td><td>{conversation.message_count}</td><td>{formatDate(conversation.updated_at)}</td></tr>)}</tbody></table></div>
    </section>}
  </div>;
}

const labelStyle = { display: "grid", gap: 7, color: "#251C2D", fontSize: 14, fontWeight: 650 };
const mutedText = { color: "#746C7A", fontSize: 13, lineHeight: 1.6 };
const sectionHeading = { margin: "0 0 12px", color: "#32194D", fontFamily: "var(--font-serif)", fontSize: 24 };
const primaryButton = { border: 0, borderRadius: 10, padding: "12px 16px", background: "#5B2C83", color: "#fff", fontWeight: 700, cursor: "pointer" };
const secondaryButton = { border: "1px solid rgba(91,44,131,.25)", borderRadius: 10, padding: "10px 14px", background: "#fff", color: "#4D2670", fontWeight: 700, cursor: "pointer" };
const tabStyle = (active: boolean) => ({ border: `1px solid ${active ? "#5B2C83" : "rgba(91,44,131,.18)"}`, borderRadius: 10, padding: "10px 14px", background: active ? "#F2ECF7" : "#fff", color: "#4D2670", fontWeight: 700, cursor: "pointer" });

