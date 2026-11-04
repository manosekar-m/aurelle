"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Globe, User as UserIcon, Crown, ChevronDown, Check } from "lucide-react";
import Magnetic from "./Magnetic";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { Language } from "@/data/translations";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const { language, setLanguage, languages, t } = useLanguage();
  const { user } = useAuth();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  // Close language menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: t.nav.collection, href: "/#collection" },
    { name: t.nav.theNight, href: "/#the-night" },
    { name: t.nav.about, href: "/#about" },
    { name: t.nav.contact, href: "/#contact" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 1 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out ${
          isScrolled
            ? "py-3.5 bg-onyx/60 backdrop-blur-2xl border-b border-gold/15 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
            : "py-7 bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="group inline-block" data-cursor="enter">
            <h1 className="font-serif text-2xl md:text-3xl tracking-widest text-ivory group-hover:text-gold transition-colors duration-500">
              AURELLE
            </h1>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Magnetic key={link.href}>
                <Link
                  href={link.href}
                  className="font-sans text-xs tracking-[0.2em] text-ivory/80 hover:text-gold relative overflow-hidden group py-2"
                >
                  <span className="relative z-10">{link.name}</span>
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gold origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100" />
                </Link>
              </Magnetic>
            ))}
          </nav>

          {/* Desktop Right Utilities (Language Selector + Auth Portal) */}
          <div className="hidden sm:flex items-center gap-4">
            
            {/* ── LANGUAGE SWITCHER ── */}
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gold/30 hover:border-gold bg-black/40 text-ivory/90 hover:text-gold transition-colors font-sans text-[9px] tracking-widest uppercase cursor-pointer"
                aria-label="Change language"
              >
                <Globe size={11} className="text-gold" />
                <span>{language.toUpperCase()}</span>
                <ChevronDown size={10} className={`transition-transform duration-300 ${isLangMenuOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isLangMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-44 bg-[#0a0a0a]/95 backdrop-blur-2xl border border-gold/30 rounded-sm shadow-[0_15px_40px_rgba(0,0,0,0.8)] py-1.5 z-50 overflow-hidden"
                  >
                    <div className="px-3 py-1.5 border-b border-gold/15 text-[7px] font-sans tracking-[0.3em] uppercase text-gold/70">
                      SELECT REGION & LANGUAGE
                    </div>
                    {languages.map((lang) => {
                      const isCurrent = language === lang.code;
                      return (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code);
                            setIsLangMenuOpen(false);
                          }}
                          className={`w-full px-3 py-2 text-left font-sans text-xs flex items-center justify-between transition-colors ${
                            isCurrent
                              ? "bg-gold/15 text-gold font-medium"
                              : "text-white/70 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <div>
                            <span className="font-sans text-[11px] block">{lang.nativeName}</span>
                            <span className="font-sans text-[8px] text-white/40 tracking-wider uppercase block">
                              {lang.region}
                            </span>
                          </div>
                          {isCurrent && <Check size={12} className="text-gold" />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── CLIENT / ADMIN AUTH BUTTON ── */}
            <Link
              href="/login"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-[9px] font-sans tracking-[0.2em] uppercase transition-all duration-300 ${
                user?.role === "admin"
                  ? "border-gold bg-gold/15 text-gold font-semibold shadow-[0_0_15px_rgba(197,160,89,0.3)]"
                  : user?.role === "client"
                  ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-300"
                  : "border-gold/30 hover:border-gold text-ivory/80 hover:text-gold bg-white/[0.02]"
              }`}
            >
              {user?.role === "admin" ? (
                <>
                  <Crown size={12} className="text-gold" />
                  <span>{t.nav.adminPortal}</span>
                </>
              ) : user?.role === "client" ? (
                <>
                  <UserIcon size={11} className="text-emerald-400" />
                  <span className="truncate max-w-[100px]">VIP · {user.name.split(" ")[0]}</span>
                </>
              ) : (
                <>
                  <UserIcon size={11} className="text-gold/80" />
                  <span>{t.nav.signIn}</span>
                </>
              )}
            </Link>

          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 z-50 relative"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            <span
              className={`w-6 h-[1px] bg-ivory transition-transform duration-500 ${
                isMobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""
              }`}
            />
            <span
              className={`w-6 h-[1px] bg-ivory transition-opacity duration-500 ${
                isMobileMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`w-6 h-[1px] bg-ivory transition-transform duration-500 ${
                isMobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""
              }`}
            />
          </button>
        </div>
      </motion.header>

      {/* ── MOBILE MENU DRAWER ── */}
      <motion.div
        initial={false}
        animate={isMobileMenuOpen ? "open" : "closed"}
        variants={{
          open: { opacity: 1, pointerEvents: "auto" },
          closed: { opacity: 0, pointerEvents: "none" },
        }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-40 bg-onyx flex flex-col justify-center items-center px-6"
      >
        <div className="flex flex-col items-center gap-7 text-center">
          {navLinks.map((link, i) => (
            <motion.div
              key={link.href}
              variants={{
                open: { opacity: 1, y: 0, transition: { delay: 0.08 * i + 0.2, duration: 0.5 } },
                closed: { opacity: 0, y: 20 },
              }}
            >
              <Link
                href={link.href}
                className="font-serif text-2xl tracking-widest text-ivory hover:text-gold transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            </motion.div>
          ))}

          {/* Mobile Auth Button */}
          <motion.div
            variants={{
              open: { opacity: 1, y: 0, transition: { delay: 0.45, duration: 0.5 } },
              closed: { opacity: 0, y: 20 },
            }}
            className="pt-4"
          >
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="inline-flex items-center gap-2 px-6 py-3 border border-gold/50 text-gold font-sans text-xs tracking-[0.25em] uppercase"
            >
              {user?.role === "admin" ? (
                <>
                  <Crown size={14} />
                  <span>{t.nav.adminPortal}</span>
                </>
              ) : user ? (
                <>
                  <UserIcon size={14} />
                  <span>VIP · {user.name}</span>
                </>
              ) : (
                <>
                  <UserIcon size={14} />
                  <span>{t.nav.signIn}</span>
                </>
              )}
            </Link>
          </motion.div>

          {/* Mobile Language Selector Pills */}
          <motion.div
            variants={{
              open: { opacity: 1, y: 0, transition: { delay: 0.55, duration: 0.5 } },
              closed: { opacity: 0, y: 20 },
            }}
            className="flex flex-wrap justify-center gap-2 pt-6 border-t border-white/10 max-w-xs"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`px-3 py-1.5 text-[9px] font-sans tracking-widest uppercase border transition-colors ${
                  language === lang.code
                    ? "border-gold bg-gold/20 text-gold font-semibold"
                    : "border-white/15 text-white/50 hover:text-white"
                }`}
              >
                {lang.code.toUpperCase()} · {lang.name}
              </button>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
