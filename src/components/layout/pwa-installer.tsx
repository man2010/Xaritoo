"use client";

import { useEffect, useState } from "react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function PwaInstaller() {
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.error("Service worker registration failed:", error);
      });
    }

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as InstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setPromptEvent(null);
      setShowHelp(false);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function installApp() {
    if (!promptEvent) {
      setShowHelp((current) => !current);
      return;
    }

    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    if (choice.outcome === "accepted") setInstalled(true);
    setPromptEvent(null);
  }

  if (installed) return null;

  return (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        onClick={installApp}
        aria-expanded={showHelp}
        aria-describedby={showHelp ? "pwa-install-help" : undefined}
        style={{
          background: "transparent",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.4)",
          borderRadius: 8,
          padding: "8px 12px",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        Download App
      </button>
      {showHelp && (
        <p
          id="pwa-install-help"
          role="status"
          style={{
            position: "absolute",
            zIndex: 110,
            top: "100%",
            right: 0,
            width: 260,
            marginTop: 8,
            padding: 12,
            borderRadius: 8,
            background: "#fff",
            color: "#251C2D",
            boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
            fontSize: 13,
            lineHeight: 1.5,
          }}
        >
          Pour installer Xaritoo, ouvre le menu de ton navigateur puis choisis « Ajouter à l’écran d’accueil » ou « Installer l’application ».
        </p>
      )}
    </div>
  );
}
