"use client";

import { useEffect, useState } from "react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

let deferredInstallPrompt: InstallPromptEvent | null = null;

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event as InstallPromptEvent;
    window.dispatchEvent(new Event("xaritoo:install-available"));
  });
}

export default function PwaInstaller() {
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [platform, setPlatform] = useState<"android" | "ios" | "other">("other");

  useEffect(() => {
    const userAgent = navigator.userAgent;
    setPlatform(/android/i.test(userAgent) ? "android" : /iphone|ipad|ipod/i.test(userAgent) ? "ios" : "other");
    setInstalled(
      window.matchMedia("(display-mode: standalone)").matches ||
        ("standalone" in navigator && Boolean(navigator.standalone)),
    );

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.error("Service worker registration failed:", error);
      });
    }

    const onInstallAvailable = () => setPromptEvent(deferredInstallPrompt);
    const onInstalled = () => {
      setInstalled(true);
      deferredInstallPrompt = null;
      setPromptEvent(null);
      setShowHelp(false);
    };

    if (deferredInstallPrompt) setPromptEvent(deferredInstallPrompt);
    window.addEventListener("xaritoo:install-available", onInstallAvailable);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("xaritoo:install-available", onInstallAvailable);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function installApp() {
    const availablePrompt = promptEvent ?? deferredInstallPrompt;
    if (!availablePrompt) {
      setShowHelp((current) => !current);
      return;
    }

    await availablePrompt.prompt();
    const choice = await availablePrompt.userChoice;
    if (choice.outcome === "accepted") setInstalled(true);
    deferredInstallPrompt = null;
    setPromptEvent(null);
  }

  const helpText = platform === "android"
    ? "For the install prompt, open this site in Chrome and tap Download App again when the app is ready to install. You can also open Chrome’s ⋮ menu and choose “Install app” or “Add to Home screen”. If neither option appears, keep the site open for about 30 seconds, then try again."
    : platform === "ios"
      ? "Open Xaritoo in Safari, tap Share, choose “Add to Home Screen”, then tap Add."
      : "Open the browser menu and choose “Install app” or “Add to Home screen”.";

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
          {helpText}
        </p>
      )}
    </div>
  );
}
