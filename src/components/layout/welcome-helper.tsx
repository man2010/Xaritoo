"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { usePathname } from "next/navigation";

const CLUB_INTENT = /\b(xaritoo\s*club|join(?:ing)?\s+(?:the\s+)?(?:xaritoo\s*)?club|register\s+(?:my|our|a)\s+(?:child|student|son|daughter)|enroll\s+(?:my|our|a)\s+(?:child|student)|sign\s*up\s+(?:my|our|a)\s+(?:child|student)|inscri(?:re|ption|s|t)\s+(?:mon|ma|mes|notre|nos|un|une)?\s*(?:enfant|élève|eleve|fils|fille|club)|inscrire\s+(?:au|à|a)\s+(?:xaritoo\s*)?club|soutien\s+scolaire|aide\s+aux\s+devoirs|academic\s+support|tutoring\s+(?:for\s+)?(?:my|our|a)\s+(?:child|student))\b/i;

const CLUB_QUESTION = "How can I register my child for Xaritoo Club?";

export default function WelcomeHelper() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem("xaritoo-welcome-dismissed") !== "1") {
      const timer = window.setTimeout(() => setOpen(true), 650);
      return () => window.clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function close() {
    setOpen(false);
    sessionStorage.setItem("xaritoo-welcome-dismissed", "1");
  }

  function goToClubForm() {
    close();
    if (pathname !== "/") {
      window.location.assign("/#club-registration");
      return;
    }
    window.dispatchEvent(new Event("xaritoo:open-club-registration"));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    if (CLUB_INTENT.test(trimmed)) {
      goToClubForm();
      return;
    }

    setLoading(true);
    setAnswer("");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: trimmed }] }),
      });
      const data = await response.json();
      if (!response.ok || !data.reply) throw new Error(data.error || "Unable to get a response.");
      setAnswer(data.reply);
    } catch {
      setAnswer("I’m having trouble connecting right now. You can still find the Xaritoo Club registration in Programs, or contact us at Xaritoomentorship@gmail.com.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1200,
        display: "grid",
        placeItems: "center",
        padding: 18,
        background: "rgba(25, 13, 36, 0.68)",
        backdropFilter: "blur(5px)",
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-helper-title"
        style={{
          position: "relative",
          width: "min(100%, 520px)",
          maxHeight: "min(88dvh, 720px)",
          overflowY: "auto",
          padding: "clamp(24px, 6vw, 40px)",
          borderRadius: 24,
          background: "#fff",
          boxShadow: "0 28px 90px rgba(0,0,0,.3)",
        }}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close welcome helper"
          style={{ position: "absolute", top: 14, right: 16, border: 0, background: "transparent", color: "#746C7A", fontSize: 26, cursor: "pointer" }}
        >
          ×
        </button>
        <div style={{ color: "#B58A2A", fontSize: 12, fontWeight: 800, letterSpacing: ".14em", textTransform: "uppercase" }}>
          Welcome to Xaritoo
        </div>
        <h2 id="welcome-helper-title" style={{ margin: "10px 32px 10px 0", color: "#32194D", fontFamily: "var(--font-serif)", fontSize: "clamp(26px, 6vw, 36px)", lineHeight: 1.15 }}>
          How can we help you today?
        </h2>
        <p style={{ margin: "0 0 22px", color: "#5E5365", lineHeight: 1.6 }}>
          Ask a question or tell us what you’re looking for. Parents can register a student for Xaritoo Club here.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="welcome-helper-question" style={{ display: "block", marginBottom: 7, color: "#251C2D", fontSize: 14, fontWeight: 700 }}>
            What can we help you with?
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              ref={inputRef}
              id="welcome-helper-question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="For example: I want to join Xaritoo Club"
              maxLength={500}
              style={{ minWidth: 0, flex: 1, padding: "12px 14px", border: "1px solid rgba(91,44,131,.25)", borderRadius: 10, color: "#251C2D", fontSize: 15 }}
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              style={{ padding: "0 16px", border: 0, borderRadius: 10, background: "#5B2C83", color: "#fff", fontWeight: 700, cursor: loading ? "wait" : "pointer" }}
            >
              {loading ? "…" : "Go"}
            </button>
          </div>
        </form>

        <button
          type="button"
          onClick={goToClubForm}
          style={{ width: "100%", marginTop: 14, padding: "13px 16px", border: "1px solid rgba(91,44,131,.18)", borderRadius: 10, background: "#F5F0F8", color: "#4D2670", textAlign: "left", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
        >
          📚 I’m a parent — register my student for Xaritoo Club →
        </button>

        {loading && <p role="status" style={{ color: "#746C7A", fontSize: 14 }}>One moment, I’m finding the right information…</p>}
        {answer && (
          <div role="status" style={{ marginTop: 18, padding: 16, borderRadius: 12, background: "#F8F4FC", color: "#40364A", fontSize: 14, lineHeight: 1.65, whiteSpace: "pre-wrap" }}>
            {answer}
            <button type="button" onClick={goToClubForm} style={{ display: "block", marginTop: 14, padding: 0, border: 0, background: "transparent", color: "#5B2C83", fontWeight: 700, textDecoration: "underline", cursor: "pointer" }}>
              Parent looking to register a student? Open the Xaritoo Club form
            </button>
          </div>
        )}
        <button type="button" onClick={close} style={{ display: "block", margin: "20px auto 0", padding: 6, border: 0, background: "transparent", color: "#746C7A", fontSize: 13, cursor: "pointer" }}>
          Continue to the website
        </button>
      </section>
    </div>
  );
}
