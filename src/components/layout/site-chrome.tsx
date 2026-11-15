"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import XaritooChat from "@/components/chat/xaritoo-chat";
import WelcomeHelper from "@/components/layout/welcome-helper";
import { getSupabaseBrowserClient, isSupabaseBrowserConfigured } from "@/lib/supabase-browser";

export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const configured = isSupabaseBrowserConfigured();
  const client = useMemo(() => configured ? getSupabaseBrowserClient() : null, [configured]);
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!client) { setChecking(false); return; }
    let mounted = true;
    client.auth.getSession().then(({ data }) => {
      if (mounted) { setSession(data.session); setChecking(false); }
    });
    const { data: listener } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setChecking(false);
    });
    return () => { mounted = false; listener.subscription.unsubscribe(); };
  }, [client]);

  const memberApp = pathname === "/account" && (checking || Boolean(session));
  if (memberApp) return <>{children}</>;

  return <>
    <Header />
    {children}
    <Footer />
    <XaritooChat />
    <WelcomeHelper />
  </>;
}
