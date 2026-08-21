"use client";

import { useEffect, useRef, useState } from "react";
import { colors as C } from "@/lib/design-tokens";
import Icon from "@/components/ui/icon";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

const SUGGESTED_PROMPTS = [
  { label: "📚 Inscrire mon enfant au Club (Parents)", prompt: "Comment puis-je inscrire mon enfant au Xaritoo Club ?" },
  { label: "🌿 Devenir Mentor (Gardener)", prompt: "Comment puis-je devenir mentor bénévole pour Xaritoo ?" },
  { label: "🌱 C'est quoi le modèle Seed-Gardener ?", prompt: "Pouvez-vous m'expliquer le modèle Seed–Gardener–Garden ?" },
  { label: "🤝 Partenaires & Contact", prompt: "Qui sont les partenaires de Xaritoo et comment vous contacter ?" },
];

export default function XaritooChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Bonjour ! 👋 Je suis l'assistant virtuel officiel de **Xaritoo**.\n\nJe suis là pour répondre à toutes vos questions sur nos programmes de mentorat, le soutien scolaire pour vos enfants (*Xaritoo Club*), notre philosophie *Seed–Gardener–Garden*, ou pour vous guider dans votre candidature.\n\n*Comment puis-je vous aider aujourd'hui ? / How can I help you today?*",
      timestamp: "À l'instant",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isLoading]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSend = async (userText: string) => {
    const trimmed = userText.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();

      if (response.ok && data.reply) {
        const assistantMessage: Message = {
          id: `bot-${Date.now()}`,
          role: "assistant",
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || "Une erreur est survenue.");
      }
    } catch (err) {
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content:
          "Désolé, je rencontre une petite difficulté momentanée pour joindre le serveur. Vous pouvez nous contacter directement par email à **mamediaw@xaritoo.org** ou par téléphone au **+1-312-804-3857**.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTextWithMarkdown = (text: string) => {
    // Basic formatting for bold and links
    const lines = text.split("\n");
    return lines.map((line, lineIdx) => {
      // replace **bold**
      const parts = line.split(/(\*\*.*?\*\*|https?:\/\/[^\s]+)/g);
      return (
        <span key={lineIdx} style={{ display: "block", minHeight: line.trim() === "" ? 8 : undefined }}>
          {parts.map((part, partIdx) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return <strong key={partIdx} style={{ fontWeight: 700, color: C.purpleDark }}>{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith("http://") || part.startsWith("https://")) {
              return (
                <a
                  key={partIdx}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: C.purplePrimary, textDecoration: "underline", wordBreak: "break-all", fontWeight: 600 }}
                >
                  {part}
                </a>
              );
            }
            return part;
          })}
        </span>
      );
    });
  };

  return (
    <aside aria-label="Xaritoo AI Chat Assistant" className="xaritoo-chat-root">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="xaritoo-chat-fab"
          aria-label="Ouvrir le chat avec l'assistant IA Xaritoo"
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 990,
            background: `linear-gradient(135deg, ${C.purplePrimary} 0%, ${C.purpleDark} 100%)`,
            color: C.white,
            border: `2px solid ${C.goldLight}`,
            borderRadius: 32,
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
            boxShadow: "0 12px 36px rgba(50,25,77,0.38), 0 0 0 1px rgba(226,200,120,0.3)",
            fontFamily: "var(--font-sans)",
            fontSize: 14,
            fontWeight: 700,
            transition: "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-3px) scale(1.03)";
            e.currentTarget.style.boxShadow = "0 16px 44px rgba(50,25,77,0.48), 0 0 0 2px rgba(226,200,120,0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "0 12px 36px rgba(50,25,77,0.38), 0 0 0 1px rgba(226,200,120,0.3)";
          }}
        >
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#4ade80",
                boxShadow: "0 0 10px #4ade80",
                marginRight: 2,
              }}
            />
            <Icon name="sprout" size={20} style={{ color: C.goldLight }} />
          </div>
          <span>Assistant IA Xaritoo</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Assistant IA Xaritoo"
          className="xaritoo-chat-window"
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 995,
            width: 400,
            maxWidth: "calc(100vw - 32px)",
            height: 600,
            maxHeight: "calc(100vh - 48px)",
            background: C.white,
            borderRadius: 20,
            boxShadow: "0 24px 64px rgba(37,28,45,0.32), 0 0 0 1px rgba(91,44,131,0.15)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            border: `1.5px solid rgba(91,44,131,0.25)`,
            animation: "chatPopIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <style>{`
            @keyframes chatPopIn {
              from { opacity: 0; transform: translateY(20px) scale(0.95); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
            .chat-msg-bubble {
              max-width: 85%;
              padding: 12px 16px;
              border-radius: 14px;
              font-size: 14.5px;
              line-height: 1.55;
              word-break: break-word;
            }
            .chat-msg-user {
              align-self: flex-end;
              background: #5B2C83;
              color: #FFFFFF;
              border-bottom-right-radius: 4px;
            }
            .chat-msg-bot {
              align-self: flex-start;
              background: #F2ECF7;
              color: #251C2D;
              border-bottom-left-radius: 4px;
              border: 1px solid rgba(91,44,131,0.08);
            }
            .chat-chip {
              background: #FFFFFF;
              border: 1px solid rgba(91,44,131,0.2);
              color: #5B2C83;
              padding: 7px 12px;
              border-radius: 12px;
              font-size: 12.5px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s ease;
              text-align: left;
            }
            .chat-chip:hover {
              background: #F2ECF7;
              border-color: #5B2C83;
              transform: translateY(-1px);
            }
            @media (max-width: 640px) {
              .xaritoo-chat-window {
                width: 100vw !important;
                max-width: 100vw !important;
                height: 100dvh !important;
                max-height: 100dvh !important;
                bottom: 0 !important;
                right: 0 !important;
                border-radius: 0 !important;
                border: none !important;
              }
            }
          `}</style>

          {/* Header */}
          <div
            style={{
              background: `linear-gradient(135deg, ${C.purpleDark} 0%, ${C.purplePrimary} 100%)`,
              padding: "16px 20px",
              color: C.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: `1px solid rgba(255,255,255,0.12)`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.12)",
                  border: `1.5px solid ${C.goldLight}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="sprout" size={22} style={{ color: C.goldLight }} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", gap: 6 }}>
                  Assistant Xaritoo
                  <span style={{ fontSize: 10, background: C.goldPrimary, color: C.textDark, padding: "1px 6px", borderRadius: 4, fontWeight: 800 }}>
                    AI
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80" }} />
                  En ligne • 24/7 Support
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button
                type="button"
                onClick={() => {
                  setMessages([
                    {
                      id: "welcome",
                      role: "assistant",
                      content: "Conversation réinitialisée. Comment puis-je vous aider ?",
                      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    },
                  ]);
                }}
                aria-label="Réinitialiser la conversation"
                title="Effacer l'historique"
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.7)",
                  cursor: "pointer",
                  padding: 6,
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.white)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
              >
                <Icon name="star" size={16} />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Fermer le chat"
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.85)",
                  cursor: "pointer",
                  fontSize: 22,
                  lineHeight: 1,
                  padding: "4px 8px",
                  borderRadius: 6,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.white)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.85)")}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "18px 16px",
              background: C.bgSoft,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-msg-bubble ${msg.role === "user" ? "chat-msg-user" : "chat-msg-bot"}`}
              >
                <div style={{ margin: 0 }}>{formatTextWithMarkdown(msg.content)}</div>
                <div
                  style={{
                    fontSize: 10.5,
                    marginTop: 6,
                    textAlign: msg.role === "user" ? "right" : "left",
                    opacity: 0.65,
                  }}
                >
                  {msg.timestamp}
                </div>
              </div>
            ))}

            {/* Quick Suggestions (shown when only welcome message is present) */}
            {messages.length === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Suggestions rapides :
                </span>
                {SUGGESTED_PROMPTS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="chat-chip"
                    onClick={() => handleSend(item.prompt)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="chat-msg-bubble chat-msg-bot" style={{ display: "flex", alignItems: "center", gap: 6, width: "fit-content" }}>
                <span style={{ fontSize: 13, color: C.purplePrimary, fontWeight: 600 }}>Xaritoo réfléchit</span>
                <span style={{ display: "inline-flex", gap: 3 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.purplePrimary, animation: "pulse 1s infinite 0s" }} />
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.purplePrimary, animation: "pulse 1s infinite 0.2s" }} />
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.purplePrimary, animation: "pulse 1s infinite 0.4s" }} />
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            style={{
              padding: "12px 14px",
              background: C.white,
              borderTop: `1px solid rgba(91,44,131,0.12)`,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Posez votre question / Ask a question..."
                disabled={isLoading}
                maxLength={600}
                style={{
                  flex: 1,
                  padding: "11px 14px",
                  borderRadius: 12,
                  border: `1.5px solid rgba(91,44,131,0.2)`,
                  fontSize: 14.5,
                  fontFamily: "var(--font-sans)",
                  outline: "none",
                  background: C.white,
                  color: C.textDark,
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = C.purplePrimary)}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(91,44,131,0.2)")}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                aria-label="Envoyer le message"
                style={{
                  background: input.trim() && !isLoading ? C.purplePrimary : "rgba(91,44,131,0.2)",
                  color: C.white,
                  border: "none",
                  borderRadius: 12,
                  width: 44,
                  height: 44,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: input.trim() && !isLoading ? "pointer" : "not-allowed",
                  transition: "background 0.2s, transform 0.15s",
                  flexShrink: 0,
                }}
              >
                <Icon name="play" size={18} />
              </button>
            </div>
            <div style={{ fontSize: 10.5, color: C.textMuted, textAlign: "center", letterSpacing: "0.02em" }}>
              Xaritoo AI Assistant • <em>No Seed Grows Alone</em>
            </div>
          </form>
        </div>
      )}
    </aside>
  );
}
