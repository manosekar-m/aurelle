"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Sparkles,
  Send,
  X,
  RotateCcw,
  Key,
  ChevronRight,
  Check,
  ArrowUpRight,
  SlidersHorizontal,
} from "lucide-react";
import { collection, ChapterData } from "@/data/collection";
import LookDetailModal from "@/components/sections/LookDetailModal";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  suggestedDressId?: string;
  suggestions?: string[];
  timestamp: string;
}

interface Props {
  onOpenLook?: (look: ChapterData) => void;
}

const INITIAL_MESSAGE: Message = {
  id: "msg-init",
  role: "assistant",
  content: `Good evening. Welcome to the House of Aurelle.\n\nI am your personal **Atelier AI Stylist**. Allow me to curate your look for the evening, answer questions on our five collection chapters, or advise on bespoke sizing and fabrics.\n\nHow may I assist your wardrobe tonight?`,
  suggestions: [
    "Recommend a dress for a black-tie gala",
    "Which look is best for dancing?",
    "Tell me about The Spotlight gown",
    "How does sizing run?",
  ],
  timestamp: "Just now",
};

export default function AIChatBot({ onOpenLook }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalLook, setModalLook] = useState<ChapterData | null>(null);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [savedApiKey, setSavedApiKey] = useState("");
  const [keySavedToast, setKeySavedToast] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load custom API key from localStorage if saved
  useEffect(() => {
    try {
      const stored = localStorage.getItem("aurelle_ai_api_key");
      if (stored) {
        setSavedApiKey(stored);
        setApiKeyInput(stored);
      }
    } catch {
      // localStorage may be unavailable
    }
  }, []);

  // Auto-scroll on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  const handleSaveApiKey = () => {
    try {
      const trimmed = apiKeyInput.trim();
      if (trimmed) {
        localStorage.setItem("aurelle_ai_api_key", trimmed);
        setSavedApiKey(trimmed);
      } else {
        localStorage.removeItem("aurelle_ai_api_key");
        setSavedApiKey("");
      }
      setKeySavedToast(true);
      setTimeout(() => {
        setKeySavedToast(false);
        setShowKeyModal(false);
      }, 1500);
    } catch {
      setShowKeyModal(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          apiKey: savedApiKey || undefined,
        }),
      });

      const data = await res.json();

      const assistantMessage: Message = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: data.reply || "Allow me to review our atelier collection for you.",
        suggestedDressId: data.suggestedDressId,
        suggestions: data.suggestions,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: "assistant",
          content:
            "Our atelier records are momentarily resting. Please explore our After Dark chapters directly or request a consultation.",
          timestamp: "Just now",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([INITIAL_MESSAGE]);
  };

  const getDressData = (id?: string) => {
    if (!id) return null;
    return collection.find((c) => c.id === id);
  };

  return (
    <>
      {/* Look Detail Modal when dress preview is clicked */}
      <LookDetailModal look={modalLook} onClose={() => setModalLook(null)} />

      {/* ── FLOATING TRIGGER PILL ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[150]"
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open Aurelle AI Stylist"
          className="group relative flex items-center gap-3 px-5 py-3 rounded-full bg-[#0a0a0a]/90 backdrop-blur-xl border border-gold/40 shadow-[0_8px_32px_rgba(0,0,0,0.6)] hover:border-gold transition-all duration-500 hover:shadow-[0_0_25px_rgba(197,160,89,0.35)] cursor-pointer"
        >
          {/* Subtle gold breathing aura */}
          <span className="absolute -inset-1 rounded-full bg-gold/15 blur-sm opacity-50 group-hover:opacity-100 transition-opacity animate-pulse" />

          {/* Active status pulse dot */}
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="absolute w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping opacity-75" />
          </div>

          <Sparkles size={15} className="text-gold transition-transform group-hover:rotate-12 duration-300" />

          <div className="flex flex-col text-left">
            <span className="font-sans text-[8px] tracking-[0.35em] uppercase text-gold font-medium leading-tight">
              AURELLE AI
            </span>
            <span className="font-sans text-[9px] tracking-[0.2em] text-ivory/80 leading-tight">
              ATELIER STYLIST
            </span>
          </div>

          <div className="w-4 h-px bg-gold/40 group-hover:w-6 transition-all duration-300" />
        </button>
      </motion.div>

      {/* ── CHAT WINDOW DRAWER ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-4 sm:right-8 z-[160] w-[calc(100vw-2rem)] sm:w-[410px] h-[580px] max-h-[82vh] flex flex-col bg-[#070707]/95 backdrop-blur-2xl border border-gold/30 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-hidden"
          >
            {/* Top gold ambient line */}
            <div className="h-[2px] w-full shrink-0 bg-gradient-to-r from-transparent via-gold to-transparent" />

            {/* ── HEADER ── */}
            <div className="shrink-0 px-5 py-4 border-b border-gold/15 bg-black/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Crest Avatar */}
                <div className="w-8 h-8 rounded-full border border-gold/50 flex items-center justify-center bg-gold/10 font-serif text-gold text-xs font-semibold shadow-[0_0_10px_rgba(197,160,89,0.2)]">
                  A
                </div>
                <div>
                  <h3 className="font-serif text-sm tracking-widest text-ivory flex items-center gap-1.5 leading-none">
                    AURELLE ATELIER AI
                    <Sparkles size={11} className="text-gold" />
                  </h3>
                  <p className="font-sans text-[8px] tracking-[0.25em] text-gold/80 uppercase mt-1 leading-none">
                    Couture Advisor · Online
                  </p>
                </div>
              </div>

              {/* Header actions */}
              <div className="flex items-center gap-1">
                {/* Key settings button */}
                <button
                  onClick={() => setShowKeyModal(!showKeyModal)}
                  title="Configure AI API Key (Optional)"
                  className="p-1.5 text-ivory/50 hover:text-gold transition-colors rounded hover:bg-white/5"
                >
                  <Key size={14} className={savedApiKey ? "text-gold" : ""} />
                </button>

                {/* Reset chat */}
                <button
                  onClick={handleResetChat}
                  title="Reset conversation"
                  className="p-1.5 text-ivory/50 hover:text-ivory transition-colors rounded hover:bg-white/5"
                >
                  <RotateCcw size={14} />
                </button>

                {/* Close window */}
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  className="p-1.5 text-ivory/50 hover:text-ivory transition-colors rounded hover:bg-white/5 ml-1"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* ── API KEY SETTINGS SUB-DRAWER ── */}
            <AnimatePresence>
              {showKeyModal && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-b border-gold/20 bg-[#0d0d0d] px-5 py-3 overflow-hidden text-xs"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-sans text-[8px] tracking-[0.3em] uppercase text-gold font-medium">
                      API KEY CONFIGURATION (OPTIONAL)
                    </span>
                    <button
                      onClick={() => setShowKeyModal(false)}
                      className="text-white/40 hover:text-white"
                    >
                      <X size={12} />
                    </button>
                  </div>
                  <p className="font-sans text-[9px] text-ivory/60 leading-relaxed mb-2.5">
                    Enter a <strong>Gemini</strong> or <strong>OpenAI</strong> API key to connect directly, or set <code className="text-gold">GEMINI_API_KEY</code> in environment. If omitted, the curated Atelier Intelligence responds instantly.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      placeholder="Paste AIza... or sk-..."
                      className="flex-1 bg-black/60 border border-gold/30 rounded px-2.5 py-1.5 font-mono text-[10px] text-white outline-none focus:border-gold"
                    />
                    <button
                      onClick={handleSaveApiKey}
                      className="px-3 py-1.5 bg-gold text-[#050505] font-sans text-[8px] tracking-[0.2em] uppercase font-semibold rounded hover:opacity-90"
                    >
                      SAVE
                    </button>
                  </div>
                  {keySavedToast && (
                    <p className="text-emerald-400 font-sans text-[8px] tracking-wider mt-1.5 flex items-center gap-1">
                      <Check size={10} /> Saved successfully.
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── MESSAGES SCROLL AREA ── */}
            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 scrollbar-thin scrollbar-thumb-gold/20">
              {messages.map((msg) => {
                const isAssistant = msg.role === "assistant";
                const dress = getDressData(msg.suggestedDressId);

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex flex-col ${isAssistant ? "items-start" : "items-end"}`}
                  >
                    {/* Message Bubble */}
                    <div
                      className={`max-w-[85%] rounded-xl px-4 py-3 text-xs leading-relaxed ${
                        isAssistant
                          ? "bg-[#121212] border border-gold/20 text-ivory/90 shadow-sm"
                          : "bg-gold/15 border border-gold/40 text-ivory self-end"
                      }`}
                    >
                      {/* Stylist Badge */}
                      {isAssistant && (
                        <div className="flex items-center gap-1.5 mb-1.5 text-gold font-sans text-[7px] tracking-[0.3em] uppercase">
                          <Sparkles size={9} />
                          AURELLE STYLIST
                        </div>
                      )}

                      {/* Content with simple paragraph rendering */}
                      <div className="font-sans whitespace-pre-line text-[11px] leading-relaxed">
                        {msg.content.split("\n\n").map((para, i) => (
                          <p key={i} className={i > 0 ? "mt-2" : ""}>
                            {para.split("**").map((part, pIdx) =>
                              pIdx % 2 === 1 ? (
                                <strong key={pIdx} className="text-gold font-medium">
                                  {part}
                                </strong>
                              ) : (
                                part
                              )
                            )}
                          </p>
                        ))}
                      </div>

                      {/* Timestamp */}
                      <span className="block text-[8px] text-ivory/30 tracking-wider text-right mt-1.5">
                        {msg.timestamp}
                      </span>
                    </div>

                    {/* Interactive Dress Preview Card (if a dress was recommended) */}
                    {dress && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-2.5 max-w-[85%] border border-gold/40 rounded-lg bg-[#0e0e0e] p-3 flex gap-3 items-center group cursor-pointer hover:border-gold transition-colors"
                        onClick={() => {
                          if (onOpenLook) onOpenLook(dress);
                          setModalLook(dress);
                        }}
                      >
                        <div className="relative w-14 h-18 rounded overflow-hidden shrink-0 border border-gold/20">
                          <Image
                            src={dress.imagePrimary}
                            alt={dress.title}
                            fill
                            sizes="60px"
                            className="object-cover object-top"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-sans text-[7px] tracking-[0.3em] uppercase text-gold">
                            CHAPTER {dress.index}
                          </span>
                          <h5 className="font-serif text-sm text-ivory tracking-wide truncate">
                            {dress.title}
                          </h5>
                          <p className="font-sans text-[8px] text-ivory/50 truncate">
                            {dress.details.silhouette}
                          </p>
                          <div className="flex items-center gap-1 mt-1 text-[8px] text-gold">
                            <span>★★★★★</span>
                            <span className="text-ivory/70 text-[8px]">{dress.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        <div className="shrink-0 p-1.5 rounded-full border border-gold/30 text-gold group-hover:bg-gold group-hover:text-black transition-all">
                          <ArrowUpRight size={14} />
                        </div>
                      </motion.div>
                    )}

                    {/* Follow-up suggestions chips */}
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[90%]">
                        {msg.suggestions.map((sug) => (
                          <button
                            key={sug}
                            onClick={() => handleSendMessage(sug)}
                            className="px-2.5 py-1 rounded-full border border-gold/25 bg-black/40 hover:border-gold hover:bg-gold/10 font-sans text-[8px] tracking-wider text-ivory/80 transition-all text-left flex items-center gap-1"
                          >
                            <span>✦</span>
                            <span>{sug}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {/* Typing indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 p-3 max-w-[70%] rounded-xl bg-[#121212] border border-gold/20"
                >
                  <Sparkles size={11} className="text-gold animate-spin" />
                  <span className="font-sans text-[9px] tracking-wider text-ivory/60">
                    Stylist is composing...
                  </span>
                  <div className="flex gap-1 ml-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ── INPUT BAR ── */}
            <div className="shrink-0 p-3.5 border-t border-gold/15 bg-black/60">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask your atelier stylist..."
                  className="flex-1 bg-white/[0.04] border border-gold/25 rounded-full px-4 py-2 font-sans text-xs text-ivory placeholder:text-ivory/30 outline-none transition-colors focus:border-gold"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  aria-label="Send message"
                  className="w-8 h-8 rounded-full bg-gold text-[#050505] flex items-center justify-center shrink-0 disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                >
                  <Send size={13} className="translate-x-[-0.5px]" />
                </button>
              </form>

              <div className="mt-2 flex items-center justify-between text-[7px] font-sans tracking-[0.25em] uppercase text-ivory/35">
                <span>House of Aurelle AI</span>
                <span>Haute Couture Intelligence</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
