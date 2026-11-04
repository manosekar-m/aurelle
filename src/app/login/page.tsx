"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  Crown,
  Sparkles,
  ArrowRight,
  Check,
  LogOut,
  Calendar,
  Clock,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { collection } from "@/data/collection";

export default function LoginPage() {
  const router = useRouter();
  const { user, login, signup, adminLogin, logout, enquiries, updateEnquiryStatus } = useAuth();
  const { t, language } = useLanguage();

  const [activeTab, setActiveTab] = useState<"login" | "signup" | "admin">("login");
  const [adminSubTab, setAdminSubTab] = useState<"enquiries" | "inventory" | "metrics">("enquiries");
  const [enquiryFilter, setEnquiryFilter] = useState<"all" | "New" | "Fitting Scheduled" | "Completed">("all");

  // Client Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Client Signup form
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupInterest, setSignupInterest] = useState("Gala & Red Carpet Eveningwear");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupError, setSignupError] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);

  // Admin Login form
  const [adminPasscode, setAdminPasscode] = useState("");
  const [showAdminPasscode, setShowAdminPasscode] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);

  // Handlers
  const handleClientLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    const res = await login(loginEmail, loginPassword);
    setLoginLoading(false);

    if (!res.success) {
      setLoginError(res.message || "Invalid atelier credentials.");
    }
  };

  const handleClientSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");

    if (signupPassword !== signupConfirmPassword) {
      setSignupError("Passwords do not match.");
      return;
    }

    setSignupLoading(true);
    const res = await signup({
      name: signupName,
      email: signupEmail,
      phone: signupPhone,
      interest: signupInterest,
      password: signupPassword,
    });
    setSignupLoading(false);

    if (!res.success) {
      setSignupError(res.message || "Failed to create atelier account.");
    }
  };

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError("");
    setAdminLoading(true);

    const res = await adminLogin(adminPasscode);
    setAdminLoading(false);

    if (!res.success) {
      setAdminError(res.message || "Invalid Maison Security Passcode.");
    }
  };

  const handleFillClientDemo = () => {
    setLoginEmail("vivienne@aurelle.com");
    setLoginPassword("aurelle2026");
    setLoginError("");
  };

  const handleFillAdminDemo = () => {
    setAdminPasscode("AURELLE-ADMIN-777");
    setAdminError("");
  };

  const filteredEnquiries =
    enquiryFilter === "all" ? enquiries : enquiries.filter((e) => e.status === enquiryFilter);

  // If logged in as ADMIN, display the Maison Atelier Command Dashboard!
  if (user && user.role === "admin") {
    return (
      <main className="min-h-screen bg-[#050505] text-ivory pt-24 pb-20 px-4 sm:px-8 lg:px-16 relative overflow-hidden">
        {/* Subtle gold ambient glow */}
        <div className="absolute top-10 right-1/4 w-[600px] h-[600px] bg-gold/10 blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          {/* Top Back / Director Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gold/20 pb-6 mb-8">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="p-2 border border-gold/30 hover:border-gold rounded-full text-gold transition-colors flex items-center justify-center"
                title="Return to Boutique"
              >
                <ArrowLeft size={16} />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <Crown size={15} className="text-gold" />
                  <span className="font-sans text-[9px] tracking-[0.35em] uppercase text-gold font-semibold">
                    {t.adminDashboard.title}
                  </span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl text-ivory tracking-wider mt-0.5">
                  Directeur de la Maison
                </h1>
                <p className="font-sans text-xs text-white/50">{t.adminDashboard.welcome}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="px-4 py-2 border border-gold/40 hover:bg-gold/10 font-sans text-[8px] tracking-[0.25em] uppercase text-ivory/80 transition-colors"
              >
                VIEW BOUTIQUE
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 bg-rose-950/40 border border-rose-500/40 hover:bg-rose-900/50 text-rose-200 font-sans text-[8px] tracking-[0.25em] uppercase flex items-center gap-1.5 transition-colors"
              >
                <LogOut size={12} />
                <span>{t.adminDashboard.logout}</span>
              </button>
            </div>
          </div>

          {/* KPI Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: t.adminDashboard.totalEnquiries,
                value: enquiries.length.toString(),
                sub: "Active season requests",
              },
              {
                label: t.adminDashboard.activeFittings,
                value: enquiries.filter((e) => e.status === "Fitting Scheduled").length.toString(),
                sub: "Salon appointments booked",
              },
              {
                label: t.adminDashboard.vipWaitlist,
                value: "14",
                sub: "Private couture waitlist",
              },
              {
                label: t.adminDashboard.coutureConversion,
                value: "96%",
                sub: "Inquiry to bespoke order",
              },
            ].map((kpi, idx) => (
              <div
                key={idx}
                className="p-5 border border-gold/20 bg-black/40 rounded-sm relative overflow-hidden"
              >
                <div className="h-0.5 w-8 bg-gold mb-3" />
                <p className="font-sans text-[8px] tracking-[0.25em] uppercase text-white/50 mb-1">
                  {kpi.label}
                </p>
                <p className="font-serif text-3xl sm:text-4xl text-white font-medium mb-1">
                  {kpi.value}
                </p>
                <p className="font-sans text-[8px] text-gold/80 tracking-wide">{kpi.sub}</p>
              </div>
            ))}
          </div>

          {/* Admin Navigation Tabs */}
          <div className="flex border-b border-gold/20 mb-6 gap-2 sm:gap-4 overflow-x-auto">
            {[
              { id: "enquiries", label: t.adminDashboard.tabEnquiries },
              { id: "inventory", label: t.adminDashboard.tabInventory },
              { id: "metrics", label: t.adminDashboard.tabMetrics },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setAdminSubTab(tab.id as any)}
                className={`py-3 px-4 font-sans text-[9px] tracking-[0.3em] uppercase transition-all relative whitespace-nowrap ${
                  adminSubTab === tab.id ? "text-gold font-semibold" : "text-white/40 hover:text-white"
                }`}
              >
                {tab.label}
                {adminSubTab === tab.id && (
                  <motion.div
                    layoutId="admin-tab-line"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
                  />
                )}
              </button>
            ))}
          </div>

          {/* TAB 1: CLIENT ENQUIRIES LEDGER */}
          {adminSubTab === "enquiries" && (
            <div className="space-y-4">
              {/* Filter Pills */}
              <div className="flex items-center gap-2 flex-wrap mb-4">
                <span className="font-sans text-[8px] tracking-[0.25em] uppercase text-white/40 mr-2">
                  STATUS FILTER:
                </span>
                {[
                  { id: "all", label: t.adminDashboard.filterAll },
                  { id: "New", label: t.adminDashboard.filterNew },
                  { id: "Fitting Scheduled", label: t.adminDashboard.filterFitting },
                  { id: "Completed", label: t.adminDashboard.filterCompleted },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setEnquiryFilter(f.id as any)}
                    className={`px-3 py-1 text-[8px] font-sans tracking-[0.2em] uppercase border transition-colors ${
                      enquiryFilter === f.id
                        ? "border-gold bg-gold/15 text-gold"
                        : "border-white/10 text-white/40 hover:text-white"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Table / List View */}
              <div className="border border-gold/20 bg-black/50 overflow-x-auto">
                <table className="w-full text-left font-sans text-xs">
                  <thead className="border-b border-gold/20 text-[8px] tracking-[0.3em] uppercase text-gold bg-white/[0.02]">
                    <tr>
                      <th className="py-3.5 px-4">{t.adminDashboard.colClient}</th>
                      <th className="py-3.5 px-4">{t.adminDashboard.colContact}</th>
                      <th className="py-3.5 px-4">{t.adminDashboard.colGarment}</th>
                      <th className="py-3.5 px-4">{t.adminDashboard.colType}</th>
                      <th className="py-3.5 px-4">{t.adminDashboard.colDetails}</th>
                      <th className="py-3.5 px-4">{t.adminDashboard.colStatus}</th>
                      <th className="py-3.5 px-4 text-right">{t.adminDashboard.colAction}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredEnquiries.map((enq) => (
                      <tr key={enq.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-4 font-serif text-sm text-white font-medium whitespace-nowrap">
                          {enq.name}
                          <span className="block font-sans text-[8px] text-white/40 font-normal tracking-wide">
                            {enq.date}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-white/70 whitespace-nowrap text-xs font-mono">
                          {enq.mobile}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="text-gold font-medium text-[10px] tracking-wider block">
                            {enq.lookTitle}
                          </span>
                          <span className="text-[8px] text-white/40 tracking-wider">
                            {enq.lookSubtitle}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-white/60 text-[10px] tracking-wide whitespace-nowrap">
                          {enq.enquiryType}
                        </td>
                        <td className="py-4 px-4 text-white/70 text-xs max-w-xs leading-relaxed">
                          {enq.detail}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 text-[8px] font-sans tracking-[0.2em] uppercase rounded-full border ${
                              enq.status === "New"
                                ? "border-amber-400/40 bg-amber-500/10 text-amber-300"
                                : enq.status === "Fitting Scheduled"
                                ? "border-sky-400/40 bg-sky-500/10 text-sky-300"
                                : "border-emerald-400/40 bg-emerald-500/10 text-emerald-300"
                            }`}
                          >
                            {enq.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right whitespace-nowrap space-x-2">
                          {enq.status !== "Fitting Scheduled" && (
                            <button
                              onClick={() => updateEnquiryStatus(enq.id, "Fitting Scheduled")}
                              className="px-2.5 py-1 text-[7px] font-sans tracking-[0.2em] uppercase border border-sky-400/40 text-sky-300 hover:bg-sky-400/10"
                            >
                              {t.adminDashboard.markFitting}
                            </button>
                          )}
                          {enq.status !== "Completed" && (
                            <button
                              onClick={() => updateEnquiryStatus(enq.id, "Completed")}
                              className="px-2.5 py-1 text-[7px] font-sans tracking-[0.2em] uppercase border border-emerald-400/40 text-emerald-300 hover:bg-emerald-400/10"
                            >
                              {t.adminDashboard.markComplete}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: COLLECTION OVERSIGHT */}
          {adminSubTab === "inventory" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collection.map((chapter) => (
                <div
                  key={chapter.id}
                  className="border border-gold/25 p-5 bg-black/40 rounded-sm relative flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-sans text-[8px] tracking-[0.3em] uppercase text-gold font-medium">
                        CHAPTER {chapter.index} · {chapter.subtitle}
                      </span>
                      <span className="px-2 py-0.5 border border-emerald-400/40 bg-emerald-500/10 text-emerald-300 text-[7px] tracking-wider uppercase">
                        {t.adminDashboard.stockAvailable}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl text-white tracking-wider mb-1">
                      {chapter.title}
                    </h3>
                    <p className="font-sans text-xs text-white/50 mb-3">{chapter.details.silhouette}</p>
                    <p className="font-sans text-[10px] text-white/70 line-clamp-2 mb-4 leading-relaxed">
                      {chapter.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gold/15 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-gold text-xs">★ {chapter.rating.toFixed(1)}</span>
                      <span className="text-white/40 text-[9px] ml-1">({chapter.reviewCount} Reviews)</span>
                    </div>
                    <span className="font-sans text-[8px] tracking-widest text-white/50 uppercase">
                      {chapter.details.sizing}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: SALON METRICS */}
          {adminSubTab === "metrics" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 border border-gold/20 bg-black/40">
                <h4 className="font-serif text-lg text-white tracking-wider mb-4">
                  Haute Couture Inquiries by Garment
                </h4>
                <div className="space-y-4">
                  {[
                    { name: "The Spotlight (Emerald Gown)", pct: "42%", count: "19 Inquiries" },
                    { name: "The Flapper (Beaded Fringe)", pct: "26%", count: "12 Inquiries" },
                    { name: "The Prelude (Cocktail Midi)", pct: "18%", count: "9 Inquiries" },
                    { name: "The Afterglow (Silver Jumpsuit)", pct: "10%", count: "5 Inquiries" },
                    { name: "Midnight Rebel (Asymmetric Mini)", pct: "4%", count: "3 Inquiries" },
                  ].map((item) => (
                    <div key={item.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-sans">
                        <span className="text-white/80">{item.name}</span>
                        <span className="text-gold font-medium">{item.count}</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gold" style={{ width: item.pct }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 border border-gold/20 bg-black/40 flex flex-col justify-between">
                <div>
                  <h4 className="font-serif text-lg text-white tracking-wider mb-2">
                    Maison Aurelle Atelier Directorship
                  </h4>
                  <p className="font-sans text-xs text-white/60 leading-relaxed mb-6 font-light">
                    Direct oversight of seasonal allocations across Paris, Milan, New York, Zurich, and Dubai private client salons. Inquiries submitted via the boutique interface are synchronized in real time.
                  </p>
                  <div className="p-4 border border-gold/30 bg-gold/5 text-xs text-ivory/80 space-y-1.5 font-sans">
                    <p className="font-medium text-gold uppercase tracking-wider text-[9px]">
                      DIRECTOR SECURITY PROTOCOL
                    </p>
                    <p className="text-[10px] text-white/60">
                      Authorized passcodes: <code className="text-gold">AURELLE-ADMIN-777</code>, <code className="text-gold">maison2026</code>.
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-gold/15 flex justify-between items-center text-[9px] font-sans uppercase tracking-widest text-white/40">
                  <span>Maison Aurelle Paris</span>
                  <span>Encryption: 256-Bit SSL Atelier</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    );
  }

  // If logged in as CLIENT, show their VIP Member Account!
  if (user && user.role === "client") {
    return (
      <main className="min-h-screen bg-[#050505] text-ivory flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 bg-radial-gradient from-gold/10 via-transparent to-transparent pointer-events-none" />

        <div className="w-full max-w-md border border-gold/30 bg-[#0d0d0d] p-8 rounded-sm shadow-[0_25px_70px_rgba(0,0,0,0.85)] relative">
          <div className="flex items-center justify-between border-b border-gold/20 pb-4 mb-6">
            <div className="flex items-center gap-2 text-gold">
              <Sparkles size={14} />
              <span className="font-sans text-[8px] tracking-[0.35em] uppercase font-semibold">
                VIP ATELIER PATRON
              </span>
            </div>
            <button
              onClick={logout}
              className="text-white/40 hover:text-white flex items-center gap-1 font-sans text-[8px] tracking-wider uppercase transition-colors"
            >
              <LogOut size={11} />
              <span>{t.nav.logout}</span>
            </button>
          </div>

          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full border border-gold/60 mx-auto flex items-center justify-center font-serif text-2xl text-gold bg-gold/10 mb-3 shadow-[0_0_20px_rgba(197,160,89,0.2)]">
              {user.name.charAt(0)}
            </div>
            <h2 className="font-serif text-2xl text-white tracking-wider">{user.name}</h2>
            <p className="font-sans text-[9px] text-gold/80 tracking-[0.25em] uppercase mt-1">
              {user.membershipTier || "Haute Couture Circle"}
            </p>
            <p className="font-sans text-xs text-white/40 mt-1">{user.email}</p>
          </div>

          <div className="border border-gold/20 p-4 bg-white/[0.02] mb-6 text-xs space-y-2">
            <div className="flex justify-between text-white/60">
              <span>Member Status</span>
              <span className="text-emerald-400 font-medium">Active VIP Allocations</span>
            </div>
            <div className="flex justify-between text-white/60">
              <span>Private Consultation</span>
              <span className="text-gold font-medium">Complimentary Priority</span>
            </div>
            <div className="flex justify-between text-white/60">
              <span>Collection Preview</span>
              <span className="text-white">Autumn/Winter 2026/27</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/#collection"
              className="w-full py-3.5 bg-gold text-[#050505] font-sans text-[9px] tracking-[0.3em] uppercase font-semibold text-center hover:bg-[#d8b56f] transition-all"
            >
              EXPLORE AFTER DARK COLLECTION
            </Link>
            <Link
              href="/"
              className="w-full py-3 border border-gold/30 text-white/70 font-sans text-[8px] tracking-[0.25em] uppercase text-center hover:text-white hover:border-gold transition-colors"
            >
              RETURN TO HOME
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // GUEST VIEW: 3-in-1 Luxury Auth Portal (Login, Signup, Admin Login)
  return (
    <main className="min-h-screen bg-[#050505] text-ivory flex flex-col justify-between pt-24 pb-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/10 blur-[150px] pointer-events-none" />

      {/* Top Bar with Return Link */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between mb-8 z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-ivory/60 hover:text-gold font-sans text-[9px] tracking-[0.25em] uppercase transition-colors"
        >
          <ArrowLeft size={14} />
          <span>RETURN TO MAISON</span>
        </Link>
        <span className="font-serif text-lg tracking-widest text-gold font-medium">
          AURELLE
        </span>
      </div>

      {/* Center Auth Card */}
      <div className="max-w-lg mx-auto w-full z-10">
        <div className="bg-[#0b0b0b] border border-gold/30 rounded-sm p-6 sm:p-10 shadow-[0_25px_80px_rgba(0,0,0,0.9)] relative">
          
          {/* Decorative Corner Accents */}
          <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-gold pointer-events-none" />
          <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-gold pointer-events-none" />
          <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-gold pointer-events-none" />
          <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-gold pointer-events-none" />

          {/* 3 Tab Switcher */}
          <div className="grid grid-cols-3 border-b border-gold/20 mb-8 pb-1">
            {[
              { id: "login", label: t.auth.tabLogin },
              { id: "signup", label: t.auth.tabSignup },
              { id: "admin", label: t.auth.tabAdmin },
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setLoginError("");
                    setSignupError("");
                    setAdminError("");
                  }}
                  className={`py-3 text-center font-sans text-[8px] sm:text-[9px] tracking-[0.2em] uppercase transition-all relative ${
                    isSelected ? "text-gold font-semibold" : "text-white/40 hover:text-white"
                  }`}
                >
                  {tab.label}
                  {isSelected && (
                    <motion.div
                      layoutId="auth-tab-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* ── TAB 1: CLIENT SIGN IN ── */}
          {activeTab === "login" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-6">
                <h2 className="font-serif text-2xl sm:text-3xl text-white tracking-wider mb-1">
                  {t.auth.loginTitle}
                </h2>
                <p className="font-sans text-xs text-white/50 leading-relaxed max-w-sm mx-auto font-light">
                  {t.auth.loginSubtitle}
                </p>
              </div>

              <form onSubmit={handleClientLogin} className="space-y-5">
                <div>
                  <label className="block font-sans text-[8px] tracking-[0.35em] uppercase text-gold/80 mb-1.5">
                    {t.auth.emailLabel}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder={t.auth.emailPlaceholder}
                      className="w-full bg-black/60 border border-gold/30 rounded-none px-4 py-3 font-sans text-xs text-white placeholder:text-white/20 outline-none focus:border-gold transition-colors"
                    />
                    <Mail size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-sans text-[8px] tracking-[0.35em] uppercase text-gold/80">
                      {t.auth.passwordLabel}
                    </label>
                    <button
                      type="button"
                      className="font-sans text-[8px] tracking-wider text-white/40 hover:text-gold transition-colors"
                    >
                      {t.auth.forgotPassword}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder={t.auth.passwordPlaceholder}
                      className="w-full bg-black/60 border border-gold/30 rounded-none px-4 py-3 font-sans text-xs text-white placeholder:text-white/20 outline-none focus:border-gold transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {loginError && (
                  <p className="font-sans text-[10px] text-rose-400 tracking-wide text-center">
                    {loginError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-4 bg-gold text-[#050505] font-sans text-[9px] tracking-[0.35em] uppercase font-semibold transition-all hover:bg-[#d8b56f] hover:shadow-[0_0_25px_rgba(197,160,89,0.3)] disabled:opacity-50"
                >
                  {loginLoading ? "AUTHENTICATING..." : t.auth.btnSignIn}
                </button>
              </form>

              {/* Demo Helper Button */}
              <div className="mt-6 pt-5 border-t border-white/10 text-center">
                <span className="font-sans text-[8px] tracking-[0.25em] uppercase text-white/40 block mb-2">
                  {t.auth.demoHint}
                </span>
                <button
                  type="button"
                  onClick={handleFillClientDemo}
                  className="px-3.5 py-1.5 border border-gold/30 hover:border-gold font-sans text-[8px] tracking-widest uppercase text-gold bg-gold/5 transition-colors"
                >
                  {t.auth.demoClientBtn}
                </button>
              </div>
            </motion.div>
          )}

          {/* ── TAB 2: CLIENT SIGN UP (ATELIER MEMBERSHIP) ── */}
          {activeTab === "signup" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-6">
                <h2 className="font-serif text-2xl sm:text-3xl text-white tracking-wider mb-1">
                  {t.auth.signupTitle}
                </h2>
                <p className="font-sans text-xs text-white/50 leading-relaxed max-w-sm mx-auto font-light">
                  {t.auth.signupSubtitle}
                </p>
              </div>

              <form onSubmit={handleClientSignup} className="space-y-4">
                <div>
                  <label className="block font-sans text-[8px] tracking-[0.35em] uppercase text-gold/80 mb-1">
                    {t.auth.fullNameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder={t.auth.fullNamePlaceholder}
                    className="w-full bg-black/60 border border-gold/30 px-3.5 py-2.5 font-sans text-xs text-white placeholder:text-white/20 outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block font-sans text-[8px] tracking-[0.35em] uppercase text-gold/80 mb-1">
                    {t.auth.emailLabel}
                  </label>
                  <input
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder={t.auth.emailPlaceholder}
                    className="w-full bg-black/60 border border-gold/30 px-3.5 py-2.5 font-sans text-xs text-white placeholder:text-white/20 outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block font-sans text-[8px] tracking-[0.35em] uppercase text-gold/80 mb-1">
                    {t.auth.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    placeholder={t.auth.phonePlaceholder}
                    className="w-full bg-black/60 border border-gold/30 px-3.5 py-2.5 font-sans text-xs text-white placeholder:text-white/20 outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block font-sans text-[8px] tracking-[0.35em] uppercase text-gold/80 mb-1">
                    {t.auth.interestLabel}
                  </label>
                  <select
                    value={signupInterest}
                    onChange={(e) => setSignupInterest(e.target.value)}
                    className="w-full bg-[#111] border border-gold/30 px-3 py-2.5 font-sans text-xs text-white outline-none cursor-pointer"
                  >
                    <option value="Gala & Red Carpet Eveningwear">{t.auth.interestGala}</option>
                    <option value="Cocktail & Haute Soirées">{t.auth.interestCocktail}</option>
                    <option value="Private Reception & Bridal Glamour">{t.auth.interestBridal}</option>
                    <option value="Bespoke Made-to-Measure Couture">{t.auth.interestCustom}</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-sans text-[8px] tracking-[0.35em] uppercase text-gold/80 mb-1">
                      PASSWORD
                    </label>
                    <input
                      type="password"
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-black/60 border border-gold/30 px-3 py-2 font-sans text-xs text-white outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-[8px] tracking-[0.35em] uppercase text-gold/80 mb-1">
                      {t.auth.confirmPasswordLabel}
                    </label>
                    <input
                      type="password"
                      required
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-black/60 border border-gold/30 px-3 py-2 font-sans text-xs text-white outline-none focus:border-gold"
                    />
                  </div>
                </div>

                {signupError && (
                  <p className="font-sans text-[10px] text-rose-400 tracking-wide text-center">
                    {signupError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={signupLoading}
                  className="w-full py-3.5 bg-gold text-[#050505] font-sans text-[9px] tracking-[0.3em] uppercase font-semibold transition-all hover:bg-[#d8b56f] disabled:opacity-50 mt-2"
                >
                  {signupLoading ? "CREATING MEMBERSHIP..." : t.auth.btnCreateAccount}
                </button>
              </form>
            </motion.div>
          )}

          {/* ── TAB 3: MAISON ADMIN PORTAL ── */}
          {activeTab === "admin" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full border border-gold/40 mx-auto flex items-center justify-center font-serif text-xl text-gold bg-gold/10 mb-3 shadow-[0_0_15px_rgba(197,160,89,0.2)]">
                  <Crown size={20} />
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-white tracking-wider mb-1">
                  {t.auth.adminTitle}
                </h2>
                <p className="font-sans text-xs text-white/50 leading-relaxed max-w-sm mx-auto font-light">
                  {t.auth.adminSubtitle}
                </p>
              </div>

              <form onSubmit={handleAdminSignIn} className="space-y-5">
                <div>
                  <label className="block font-sans text-[8px] tracking-[0.35em] uppercase text-gold/80 mb-1.5">
                    {t.auth.adminKeyLabel}
                  </label>
                  <div className="relative">
                    <input
                      type={showAdminPasscode ? "text" : "password"}
                      required
                      value={adminPasscode}
                      onChange={(e) => setAdminPasscode(e.target.value)}
                      placeholder={t.auth.adminKeyPlaceholder}
                      className="w-full bg-black/60 border border-gold/30 rounded-none px-4 py-3 font-mono text-xs text-white placeholder:text-white/20 outline-none focus:border-gold transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPasscode(!showAdminPasscode)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    >
                      {showAdminPasscode ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {adminError && (
                  <p className="font-sans text-[10px] text-rose-400 tracking-wide text-center">
                    {adminError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={adminLoading}
                  className="w-full py-4 bg-gradient-to-r from-gold via-champagne to-gold text-[#050505] font-sans text-[9px] tracking-[0.35em] uppercase font-semibold transition-all hover:opacity-90 disabled:opacity-50"
                >
                  {adminLoading ? "VERIFYING DIRECTOR ACCESS..." : t.auth.btnAdminSignIn}
                </button>
              </form>

              {/* Demo Helper Button */}
              <div className="mt-6 pt-5 border-t border-white/10 text-center">
                <span className="font-sans text-[8px] tracking-[0.25em] uppercase text-white/40 block mb-2">
                  {t.auth.demoHint}
                </span>
                <button
                  type="button"
                  onClick={handleFillAdminDemo}
                  className="px-3.5 py-1.5 border border-gold/30 hover:border-gold font-sans text-[8px] tracking-widest uppercase text-gold bg-gold/5 transition-colors"
                >
                  {t.auth.demoAdminBtn}
                </button>
              </div>
            </motion.div>
          )}

        </div>
      </div>

      {/* Footer Notice */}
      <div className="text-center font-sans text-[8px] tracking-[0.3em] uppercase text-white/30 mt-8 z-10">
        Maison Aurelle · 256-Bit SSL Atelier Protection · Paris & Milano
      </div>
    </main>
  );
}

