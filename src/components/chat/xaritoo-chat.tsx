"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { colors as C } from "@/lib/design-tokens";
import Icon from "@/components/ui/icon";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

const SUGGESTIONS = [
  { label: "📚 Register My Student (Parents)", prompt: "How do I register my child for the Xaritoo Club?" },
  { label: "🌿 Become a Mentor (Gardener)", prompt: "How can I apply to become a volunteer mentor?" },
  { label: "🌱 Seed–Gardener Framework", prompt: "Can you explain the Seed–Gardener–Garden framework?" },
  { label: "🤝 Community Partners & Contact", prompt: "Who are your partners and how do I contact Xaritoo?" },
];

const INITIAL_WELCOME_MESSAGE =
  "Hello! 👋 I am the official AI assistant of **Xaritoo**.\n\nI can answer any questions about our mentorship programs, student academic support (*Xaritoo Club* for parents), our *Seed–Gardener–Garden* framework, or guide your application.\n\nHow can I help you today?";

function FormattedMessage({ content, isUser }: { content: string; isUser: boolean }) {
  if (isUser) {
    return <div style={{ margin: 0, whiteSpace: "pre-wrap" }}>{content}</div>;
  }

  // Helper to parse bold (**bold**) and links (urls or [label](url))
  const renderInline = (text: string) => {
    const regex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s]+)|(\*\*.*?\*\*)/g;
    const parts: ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      if (match[1] && match[2]) {
        // [Label](url)
        parts.push(
          <a
            key={match.index}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#5B2C83", fontWeight: 700, textDecoration: "underline", wordBreak: "break-word" }}
          >
            {match[1]}
          </a>
        );
      } else if (match[3]) {
        // Standalone URL
        parts.push(
          <a
            key={match.index}
            href={match[3]}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#5B2C83", fontWeight: 700, textDecoration: "underline", wordBreak: "break-word" }}
          >
            {match[3]}
          </a>
        );
      } else if (match[4]) {
        // **bold**
        const boldText = match[4].slice(2, -2);
        parts.push(
          <strong key={match.index} style={{ fontWeight: 700, color: "#251C2D" }}>
            {boldText}
          </strong>
        );
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts;
  };

  const lines = content.split("\n");
  const elements: ReactNode[] = [];
  let currentList: ReactNode[] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul
          key={`ul-${elements.length}`}
          style={{
            margin: "6px 0",
            paddingLeft: 18,
            display: "flex",
            flexDirection: "column",
            gap: 4,
            listStyleType: "disc",
          }}
        >
          {currentList}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((rawLine, idx) => {
    let line = rawLine.trim();

    // Clean stray leading pipes or table formatting
    line = line.replace(/^\|\s*|\s*\|$/g, "");
    if (/^[-|\s]+$/.test(line)) {
      return;
    }

    if (!line) {
      flushList();
      elements.push(<div key={`gap-${idx}`} style={{ height: 6 }} />);
      return;
    }

    // Horizontal separator
    if (/^[-*_]{3,}$/.test(line)) {
      flushList();
      elements.push(
        <hr key={`hr-${idx}`} style={{ border: "none", borderTop: "1px solid rgba(91,44,131,0.15)", margin: "8px 0" }} />
      );
      return;
    }

    // Headers with # (e.g. # Title, ## Title, ### Title)
    const headerMatch = line.match(/^#{1,6}\s*(.+)$/);
    if (headerMatch) {
      flushList();
      elements.push(
        <div
          key={`h-${idx}`}
          style={{
            fontWeight: 700,
            fontSize: 15,
            color: "#5B2C83",
            marginTop: 8,
            marginBottom: 4,
            lineHeight: 1.4,
          }}
        >
          {renderInline(headerMatch[1])}
        </div>
      );
      return;
    }

    // List item (e.g. - Item, * Item, 1. Item, • Item)
    const listMatch = line.match(/^([-*•]|\d+\.)\s+(.+)$/);
    if (listMatch) {
      currentList.push(
        <li key={`li-${idx}`} style={{ fontSize: 14, lineHeight: 1.55, color: "#40364A" }}>
          {renderInline(listMatch[2])}
        </li>
      );
      return;
    }

    // Regular paragraph line
    flushList();
    elements.push(
      <p key={`p-${idx}`} style={{ margin: "3px 0", fontSize: 14, lineHeight: 1.6, color: "#40364A" }}>
        {renderInline(line)}
      </p>
    );
  });

  flushList();

  return <div style={{ margin: 0 }}>{elements}</div>;
}

export default function XaritooChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-en",
      role: "assistant",
      content: INITIAL_WELCOME_MESSAGE,
      timestamp: "Now",
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
        throw new Error(data.error || "An error occurred.");
      }
    } catch (err) {
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content:
          "Sorry, I am temporarily having trouble connecting to the server. You can contact our team directly at **mamediaw@xaritoo.org** or by phone at **+1-312-804-3857**.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <aside aria-label="Xaritoo AI Chat Assistant" className="xaritoo-chat-root">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="xaritoo-chat-fab"
          aria-label="Open Xaritoo AI Chat"
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
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: "#4ade80",
                boxShadow: "0 0 8px #4ade80",
                marginRight: 3,
              }}
            />
            <Icon name="sprout" size={20} style={{ color: C.goldLight }} />
          </div>
          <span>Xaritoo AI Assistant</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Xaritoo AI Assistant"
          className="xaritoo-chat-window"
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 995,
            width: 410,
            maxWidth: "calc(100vw - 32px)",
            height: 620,
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
              max-width: 88%;
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
              background: #F8F4FC;
              color: #251C2D;
              border-bottom-left-radius: 4px;
              border: 1px solid rgba(91,44,131,0.1);
            }
            .chat-chip {
              background: #FFFFFF;
              border: 1.5px solid rgba(91,44,131,0.22);
              color: #5B2C83;
              padding: 8px 12px;
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
              padding: "14px 18px",
              color: C.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: `1px solid rgba(255,255,255,0.12)`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.12)",
                  border: `1.5px solid ${C.goldLight}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon name="sprout" size={20} style={{ color: C.goldLight }} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", gap: 6 }}>
                  Xaritoo Assistant
                  <span style={{ fontSize: 9.5, background: C.goldPrimary, color: C.textDark, padding: "1px 5px", borderRadius: 4, fontWeight: 800 }}>
                    AI
                  </span>
                </div>
                <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.75)", display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80" }} />
                  Online • 24/7 Support
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* Reset / Refresh Chat History */}
              <button
                type="button"
                onClick={() => {
                  setMessages([
                    {
                      id: `reset-${Date.now()}`,
                      role: "assistant",
                      content: INITIAL_WELCOME_MESSAGE,
                      timestamp: "Now",
                    },
                  ]);
                }}
                aria-label="Restart conversation"
                title="Restart conversation"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "rgba(255,255,255,0.9)",
                  cursor: "pointer",
                  padding: "6px 8px",
                  borderRadius: 7,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.2s, color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = C.white;
                  e.currentTarget.style.background = "rgba(255,255,255,0.22)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.9)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                }}
              >
                <Icon name="refresh" size={15} />
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.85)",
                  cursor: "pointer",
                  fontSize: 20,
                  lineHeight: 1,
                  padding: "2px 6px",
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
                <FormattedMessage content={msg.content} isUser={msg.role === "user"} />
                <div
                  style={{
                    fontSize: 10.5,
                    marginTop: 6,
                    textAlign: msg.role === "user" ? "right" : "left",
                    opacity: 0.6,
                  }}
                >
                  {msg.timestamp}
                </div>
              </div>
            ))}

            {/* Quick Suggestions (shown when only welcome message is present) */}
            {messages.length === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 4 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Quick questions:
                </span>
                {SUGGESTIONS.map((item, idx) => (
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
                <span style={{ fontSize: 13, color: C.purplePrimary, fontWeight: 600 }}>
                  Xaritoo is thinking
                </span>
                <span style={{ display: "inline-flex", gap: 3 }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.purplePrimary, animation: "pulse 1s infinite 0s" }} />
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.purplePrimary, animation: "pulse 1s infinite 0.2s" }} />
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.purplePrimary, animation: "pulse 1s infinite 0.4s" }} />
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
                placeholder="Ask any question about Xaritoo..."
                disabled={isLoading}
                maxLength={600}
                style={{
                  flex: 1,
                  padding: "11px 14px",
                  borderRadius: 12,
                  border: `1.5px solid rgba(91,44,131,0.2)`,
                  fontSize: 14,
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
                aria-label="Send message"
                style={{
                  background: input.trim() && !isLoading ? C.purplePrimary : "rgba(91,44,131,0.2)",
                  color: C.white,
                  border: "none",
                  borderRadius: 12,
                  width: 42,
                  height: 42,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: input.trim() && !isLoading ? "pointer" : "not-allowed",
                  transition: "background 0.2s, transform 0.15s",
                  flexShrink: 0,
                }}
              >
                <Icon name="play" size={16} />
              </button>
            </div>
            <div style={{ fontSize: 10.5, color: C.textMuted, textAlign: "center", letterSpacing: "0.02em" }}>
              Official Xaritoo AI Assistant • <em>No Seed Grows Alone</em>
            </div>
          </form>
        </div>
      )}
    </aside>
  );
}
