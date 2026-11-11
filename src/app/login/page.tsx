"use client";

import { useState, useEffect, useRef } from "react";
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
  Globe,
  ChevronDown,
  MessageSquare,
  Send,
  Package,
  CheckCircle2,
  Inbox,
  AlertCircle,
  HelpCircle,
  Truck,
  RotateCcw,
  TrendingUp,
  BarChart3,
  ArrowUpRight,
  Activity,
  DollarSign,
  Layers,
  Bookmark,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { collection } from "@/data/collection";
import OrderModal from "@/components/sections/OrderModal";
import { getGarmentPrice } from "@/components/sections/OrderModal";

interface RevenuePoint {
  month: string;
  short: string;
  revenue: number;
  ordersCount: number;
  topGarment: string;
  change: string;
}

const REVENUE_HISTORY: RevenuePoint[] = [
  { month: "January", short: "Jan", revenue: 8400, ordersCount: 2, topGarment: "THE PRELUDE", change: "+12%" },
  { month: "February", short: "Feb", revenue: 11200, ordersCount: 3, topGarment: "THE SPOTLIGHT", change: "+18%" },
  { month: "March", short: "Mar", revenue: 14600, ordersCount: 4, topGarment: "THE FLAPPER", change: "+24%" },
  { month: "April", short: "Apr", revenue: 9800, ordersCount: 3, topGarment: "THE PRELUDE", change: "-8%" },
  { month: "May", short: "May", revenue: 16500, ordersCount: 5, topGarment: "THE SPOTLIGHT", change: "+32%" },
  { month: "June", short: "Jun", revenue: 19200, ordersCount: 6, topGarment: "THE AFTERGLOW", change: "+16%" },
  { month: "July", short: "Jul", revenue: 15400, ordersCount: 4, topGarment: "THE FLAPPER", change: "+8%" },
  { month: "August", short: "Aug", revenue: 12100, ordersCount: 3, topGarment: "THE PRELUDE", change: "+10%" },
  { month: "September", short: "Sep", revenue: 22800, ordersCount: 7, topGarment: "THE SPOTLIGHT", change: "+45%" },
  { month: "October", short: "Oct", revenue: 28600, ordersCount: 8, topGarment: "THE SPOTLIGHT", change: "+26%" },
  { month: "November", short: "Nov", revenue: 42800, ordersCount: 11, topGarment: "THE SPOTLIGHT", change: "+50%" },
];

export default function LoginPage() {
  const router = useRouter();
  const {
    user,
    login,
    signup,
    adminLogin,
    logout,
    enquiries,
    updateEnquiryStatus,
    queries,
    addQuery,
    replyToQuery,
    orders,
    orderHistory,
    updateOrderStatus,
    watchlist,
    removeFromWatchlist,
  } = useAuth();
  const { t, language, setLanguage, languages } = useLanguage();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<"login" | "signup" | "admin">("login");
  const [adminSubTab, setAdminSubTab] = useState<"revenue" | "orders" | "enquiries" | "queries" | "inventory" | "metrics">("revenue");
  const [enquiryFilter, setEnquiryFilter] = useState<"all" | "New" | "Fitting Scheduled" | "Completed">("all");
  const [adminOrderFilter, setAdminOrderFilter] = useState<"all" | "Processing" | "Dispatched" | "Delivered" | "Cancelled">("all");
  const [adminQueryFilter, setAdminQueryFilter] = useState<"all" | "Open" | "Replied">("all");

  const [hoveredMonthIndex, setHoveredMonthIndex] = useState<number>(REVENUE_HISTORY.length - 1);
  const [revenueTimeframe, setRevenueTimeframe] = useState<"full" | "h2">("full");

  const [orderNotification, setOrderNotification] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Client Profile state
  const [clientProfileTab, setClientProfileTab] = useState<"profile" | "orders" | "queries" | "make_query" | "watchlist">("profile");
  const [clientQuerySubject, setClientQuerySubject] = useState(t.profile.subjectOptions[0] || "International Shipping Enquiry");
  const [clientQueryMessage, setClientQueryMessage] = useState("");
  const [clientQuerySubmitted, setClientQuerySubmitted] = useState(false);
  const [clientQueryLoading, setClientQueryLoading] = useState(false);

  // Watchlist ordering
  const [watchlistOrderLook, setWatchlistOrderLook] = useState<{ id: string; title: string; subtitle: string; price?: string; imagePrimary?: string } | null>(null);
  const [watchlistOrderModalOpen, setWatchlistOrderModalOpen] = useState(false);

  // Read ?tab= from URL to deep-link
  const searchParamsRef = useRef<URLSearchParams | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      searchParamsRef.current = sp;
      const tabParam = sp.get("tab");
      if (tabParam === "orders") setClientProfileTab("orders");
      else if (tabParam === "watchlist") setClientProfileTab("watchlist");
      else if (tabParam === "queries") setClientProfileTab("queries");
    }
  }, []);

  // Admin reply drafts
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [replySendingId, setReplySendingId] = useState<string | null>(null);
  const [replySuccessId, setReplySuccessId] = useState<string | null>(null);

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
      setAdminError(res.message || "Invalid Admin Security Passcode.");
    }
  };

  const handleClientSubmitQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientQueryMessage.trim()) return;

    setClientQueryLoading(true);
    setTimeout(() => {
      addQuery(clientQuerySubject, clientQueryMessage.trim());
      setClientQueryLoading(false);
      setClientQuerySubmitted(true);
      setClientQueryMessage("");
    }, 350);
  };

  const handleAdminSendReply = (queryId: string) => {
    const draft = replyDrafts[queryId]?.trim();
    if (!draft) return;

    setReplySendingId(queryId);
    setTimeout(() => {
      replyToQuery(queryId, draft);
      setReplySendingId(null);
      setReplySuccessId(queryId);
      setReplyDrafts((prev) => ({ ...prev, [queryId]: "" }));
      setTimeout(() => setReplySuccessId(null), 3500);
    }, 350);
  };

  const handleUpdateOrderStatus = (orderId: string, status: "Processing" | "Dispatched" | "Delivered" | "Cancelled") => {
    setUpdatingOrderId(orderId);
    setTimeout(() => {
      updateOrderStatus(orderId, status);
      setUpdatingOrderId(null);
      setOrderNotification(`Order #${orderId} updated to: ${status}`);
      setTimeout(() => setOrderNotification(null), 4000);
    }, 250);
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

  const filteredAdminOrders =
    adminOrderFilter === "all" ? orders : orders.filter((o) => o.status === adminOrderFilter);

  const filteredAdminQueries =
    adminQueryFilter === "all" ? queries : queries.filter((q) => q.status === adminQueryFilter);

  const userQueries = user
    ? queries.filter(
        (q) =>
          q.customerId === user.id ||
          q.customerEmail.toLowerCase() === user.email.toLowerCase() ||
          user.role === "client"
      )
    : [];

  const activeRevenueData = revenueTimeframe === "h2" ? REVENUE_HISTORY.slice(5) : REVENUE_HISTORY;
  const currentMonthData = activeRevenueData[hoveredMonthIndex] || activeRevenueData[activeRevenueData.length - 1];
  const totalGrossRevenue = activeRevenueData.reduce((acc, curr) => acc + curr.revenue, 0);

  const renderLanguageSelector = () => (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gold/40 hover:border-gold bg-black/60 text-ivory/90 hover:text-gold transition-colors font-sans text-[9px] tracking-widest uppercase cursor-pointer"
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
            className="absolute right-0 mt-2 w-48 bg-[#0a0a0a]/95 backdrop-blur-2xl border border-gold/30 rounded-sm shadow-[0_15px_40px_rgba(0,0,0,0.8)] py-1.5 z-50 overflow-hidden"
          >
            <div className="px-3 py-1.5 border-b border-gold/15 text-[7px] font-sans tracking-[0.3em] uppercase text-gold/70">
              LANGUAGE · IDIOMA
            </div>
            {languages.map((lang) => {
              const isCurrent = language === lang.code;
              return (
                <button
                  type="button"
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
  );

  // ==========================================
  // VIEW 1: ADMIN ATELIER COMMAND DASHBOARD
  // ==========================================
  if (user && user.role === "admin") {
    // Calculate SVG curve coordinates for revenue chart
    const chartWidth = 780;
    const chartHeight = 220;
    const paddingX = 40;
    const maxRev = 48000;
    const points = activeRevenueData.map((d, i) => {
      const x = paddingX + (i / (activeRevenueData.length - 1)) * (chartWidth - paddingX * 2);
      const y = chartHeight - (d.revenue / maxRev) * (chartHeight - 40) - 20;
      return { x, y, ...d };
    });

    // Create smooth SVG cubic bezier path
    let pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const mx = (p0.x + p1.x) / 2;
      pathD += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    const areaPathD = `${pathD} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;

    return (
      <main className="min-h-screen bg-[#040404] text-ivory pt-20 sm:pt-24 pb-16 sm:pb-20 px-3 sm:px-8 lg:px-16 relative overflow-hidden overflow-x-clip">
        {/* Dynamic ambient gold background aura */}
        <div className="absolute top-10 right-1/4 w-[750px] max-w-full h-[750px] bg-gold/10 blur-[180px] pointer-events-none" />
        <div className="absolute top-2/3 left-1/4 w-[500px] max-w-full h-[500px] bg-champagne/5 blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Executive Telemetry & Global Store Strip */}
          <div className="mb-6 p-2.5 sm:p-3 bg-black/70 border border-gold/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5 text-[7.5px] sm:text-[8px] font-sans tracking-widest uppercase rounded-sm">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIVE STORE NODE · ONLINE
              </span>
              <span className="text-white/20 hidden sm:inline">|</span>
              <span className="text-white/50 text-[7px] sm:text-[8px] leading-relaxed">
                PARIS · MILAN · DUBAI · NYC · ZURICH
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 text-gold/80 flex-wrap text-[7px] sm:text-[8px]">
              <span className="text-white/40">LOCAL STORE TIME:</span>
              <span className="text-white/80">PARIS <strong className="text-white">10:45 CET</strong></span>
              <span className="text-white/80">DUBAI <strong className="text-white">13:45 GST</strong></span>
              <span className="text-white/80">NYC <strong className="text-white">04:45 EST</strong></span>
            </div>
          </div>

          {/* Top Director Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gold/20 pb-5 sm:pb-6 mb-6 sm:mb-8">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                href="/"
                className="p-2.5 border border-gold/40 hover:border-gold hover:bg-gold/10 rounded-full text-gold transition-colors flex items-center justify-center shadow-[0_0_15px_rgba(197,160,89,0.2)] shrink-0"
                title="Return to Store"
              >
                <ArrowLeft size={16} />
              </Link>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Crown size={15} className="text-gold shrink-0" />
                  <span className="font-sans text-[8px] sm:text-[9px] tracking-[0.3em] sm:tracking-[0.35em] uppercase text-gold font-semibold">
                    {t.adminDashboard.title}
                  </span>
                </div>
                <h1 className="font-serif text-2xl sm:text-4xl text-ivory tracking-wider mt-0.5">
                  {t.adminDashboard.directorTitle}
                </h1>
                <p className="font-sans text-[11px] sm:text-xs text-white/50 font-light mt-0.5">
                  {t.adminDashboard.welcome}
                </p>
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
              {renderLanguageSelector()}
              <Link
                href="/"
                className="px-3 sm:px-4 py-2 border border-gold/40 hover:bg-gold/10 font-sans text-[7.5px] sm:text-[8px] tracking-[0.2em] sm:tracking-[0.25em] uppercase text-ivory/80 transition-colors whitespace-nowrap text-center flex-1 sm:flex-initial"
              >
                {t.adminDashboard.viewBoutique}
              </Link>
              <button
                onClick={logout}
                className="px-3 sm:px-4 py-2 bg-rose-950/40 border border-rose-500/40 hover:bg-rose-900/50 text-rose-200 font-sans text-[7.5px] sm:text-[8px] tracking-[0.2em] sm:tracking-[0.25em] uppercase flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap flex-1 sm:flex-initial"
              >
                <LogOut size={12} />
                <span>{t.adminDashboard.logout}</span>
              </button>
            </div>
          </div>

          {/* Luxury Executive KPI Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 mb-6 sm:mb-8">
            {[
              {
                label: "TOTAL GROSS REVENUE",
                value: `€${totalGrossRevenue.toLocaleString()}`,
                sub: "+28.4% YoY Season Growth",
                trend: true,
                icon: DollarSign,
              },
              {
                label: t.adminDashboard.tabOrders,
                value: `${orders.length} Active Orders`,
                sub: "96% Scheduled Delivery",
                trend: true,
                icon: Package,
              },
              {
                label: t.adminDashboard.tabClientQueries,
                value: `${queries.length} Inquiries`,
                sub: `${queries.filter((q) => q.status === "Open").length} Awaiting Director Reply`,
                trend: false,
                icon: MessageSquare,
              },
              {
                label: t.adminDashboard.coutureConversion,
                value: "96.4%",
                sub: "Consultation to Confirmed Order",
                trend: true,
                icon: TrendingUp,
              },
            ].map((kpi, idx) => {
              const Icon = kpi.icon;
              return (
                <div
                  key={idx}
                  className="p-3.5 sm:p-5 border border-gold/25 bg-[#0a0a0a]/90 backdrop-blur-md rounded-sm relative overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.6)] group hover:border-gold/50 transition-colors"
                >
                  <div className="absolute top-0 right-0 p-2 sm:p-3 opacity-20 text-gold group-hover:opacity-40 transition-opacity">
                    <Icon size={24} className="sm:w-7 sm:h-7" />
                  </div>
                  <div className="h-0.5 w-8 sm:w-10 bg-gradient-to-r from-gold to-champagne mb-2 sm:mb-3" />
                  <p className="font-sans text-[7.5px] sm:text-[8px] tracking-[0.2em] sm:tracking-[0.25em] uppercase text-white/50 mb-1 truncate">
                    {kpi.label}
                  </p>
                  <p className="font-serif text-xl sm:text-3xl text-white font-medium mb-1 tracking-wide leading-tight">
                    {kpi.value}
                  </p>
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    {kpi.trend && (
                      <span className="inline-flex items-center text-emerald-400 text-[8px] font-sans font-semibold shrink-0">
                        <ArrowUpRight size={10} />
                      </span>
                    )}
                    <span className="font-sans text-[7.5px] sm:text-[8px] text-gold/90 tracking-wide line-clamp-1">{kpi.sub}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Admin Navigation Tabs */}
          <div className="flex border-b border-gold/20 mb-6 sm:mb-8 gap-1.5 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth touch-pan-x [&::-webkit-scrollbar]:hidden">
            {[
              { id: "revenue", label: t.adminDashboard.tabRevenue || "REVENUE & FINANCIALS", icon: BarChart3 },
              { id: "orders", label: `${t.adminDashboard.tabOrders} (${orders.length})`, icon: Package },
              { id: "enquiries", label: `${t.adminDashboard.tabEnquiries} (${enquiries.length})`, icon: Calendar },
              { id: "queries", label: `${t.adminDashboard.tabClientQueries} (${queries.length})`, icon: MessageSquare },
              { id: "inventory", label: t.adminDashboard.tabInventory, icon: Layers },
              { id: "metrics", label: t.adminDashboard.tabMetrics, icon: Activity },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = adminSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setAdminSubTab(tab.id as any)}
                  className={`py-3 sm:py-3.5 px-3 sm:px-4 font-sans text-[8px] sm:text-[9px] tracking-[0.2em] sm:tracking-[0.25em] uppercase transition-all relative flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 ${
                    isActive ? "text-gold font-semibold" : "text-white/40 hover:text-white"
                  }`}
                >
                  <Icon size={12} className={isActive ? "text-gold" : "text-white/30"} />
                  <span>{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="admin-tab-line"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold via-champagne to-gold"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* ======================================================== */}
          {/* TAB 1: REVENUE HISTORY GRAPH & FINANCIAL INTELLIGENCE    */}
          {/* ======================================================== */}
          {adminSubTab === "revenue" && (
            <div className="space-y-8">
              {/* Main Revenue Chart Card */}
              <div className="border border-gold/30 bg-[#0a0a0a]/95 backdrop-blur-xl p-4 sm:p-8 rounded-sm shadow-[0_25px_70px_rgba(0,0,0,0.85)] relative">
                {/* Header controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5 sm:pb-6 mb-5 sm:mb-6">
                  <div>
                    <div className="flex items-center gap-2 text-gold mb-1">
                      <TrendingUp size={15} className="sm:w-4 sm:h-4" />
                      <span className="font-sans text-[7.5px] sm:text-[8px] tracking-[0.3em] sm:tracking-[0.35em] uppercase font-semibold">
                        EXECUTIVE FINANCIAL INTELLIGENCE
                      </span>
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl text-white tracking-wide">
                      Aurelle Revenue Trajectory
                    </h2>
                    <p className="font-sans text-[11px] sm:text-xs text-white/50 mt-1">
                      Aggregated store sales, custom orders, and VIP client purchase velocity.
                    </p>
                  </div>

                  {/* Timeframe switchers */}
                  <div className="grid grid-cols-2 sm:flex items-center gap-1 sm:gap-2 w-full sm:w-auto border border-gold/25 p-1 bg-black/60">
                    <button
                      onClick={() => {
                        setRevenueTimeframe("full");
                        setHoveredMonthIndex(REVENUE_HISTORY.length - 1);
                      }}
                      className={`px-2.5 sm:px-3 py-1.5 font-sans text-[7.5px] sm:text-[8px] tracking-[0.15em] sm:tracking-[0.2em] uppercase transition-colors text-center ${
                        revenueTimeframe === "full"
                          ? "bg-gold text-[#050505] font-semibold"
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      Fiscal Year 2026 (YTD)
                    </button>
                    <button
                      onClick={() => {
                        setRevenueTimeframe("h2");
                        setHoveredMonthIndex(REVENUE_HISTORY.slice(5).length - 1);
                      }}
                      className={`px-2.5 sm:px-3 py-1.5 font-sans text-[7.5px] sm:text-[8px] tracking-[0.15em] sm:tracking-[0.2em] uppercase transition-colors text-center ${
                        revenueTimeframe === "h2"
                          ? "bg-gold text-[#050505] font-semibold"
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      Autumn / Winter Season
                    </button>
                  </div>
                </div>

                {/* Interactive Tooltip Card for Active Month */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 p-3 sm:p-4 bg-white/[0.02] border border-gold/20 mb-6">
                  <div>
                    <span className="font-sans text-[7px] sm:text-[7.5px] uppercase tracking-[0.25em] text-white/40 block mb-1">
                      ACTIVE CYCLE
                    </span>
                    <span className="font-serif text-base sm:text-lg text-white font-medium block">
                      {currentMonthData.month} 2026
                    </span>
                  </div>
                  <div>
                    <span className="font-sans text-[7px] sm:text-[7.5px] uppercase tracking-[0.25em] text-white/40 block mb-1">
                      MONTHLY GROSS REVENUE
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-serif text-base sm:text-lg text-gold font-semibold">
                        €{currentMonthData.revenue.toLocaleString()}
                      </span>
                      <span className="text-[8px] sm:text-[9px] text-emerald-400 font-sans">
                        {currentMonthData.change}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="font-sans text-[7px] sm:text-[7.5px] uppercase tracking-[0.25em] text-white/40 block mb-1">
                      COMMISSIONED LOOKS
                    </span>
                    <span className="font-serif text-base sm:text-lg text-white font-medium block">
                      {currentMonthData.ordersCount} Custom Orders
                    </span>
                  </div>
                  <div>
                    <span className="font-sans text-[7px] sm:text-[7.5px] uppercase tracking-[0.25em] text-white/40 block mb-1">
                      COLLECTION LEADER
                    </span>
                    <span className="font-sans text-[11px] sm:text-xs text-gold/90 tracking-wider font-semibold block truncate">
                      {currentMonthData.topGarment}
                    </span>
                  </div>
                </div>

                {/* Mobile horizontal swipe hint */}
                <div className="sm:hidden flex items-center justify-between text-[7px] uppercase tracking-widest text-gold/70 mb-2 px-1">
                  <span>← Swipe horizontally to explore months →</span>
                  <span>Tap month to inspect</span>
                </div>

                {/* SVG Revenue Graph Canvas */}
                <div className="w-full overflow-x-auto pb-4 touch-pan-x [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-thumb]:bg-gold/30">
                  <div className="min-w-[620px] sm:min-w-[680px]">
                    <svg
                      viewBox={`0 0 ${chartWidth} ${chartHeight + 40}`}
                      className="w-full h-64 sm:h-72 overflow-visible"
                    >
                      <defs>
                        <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#C5A059" stopOpacity="0.45" />
                          <stop offset="60%" stopColor="#C5A059" stopOpacity="0.12" />
                          <stop offset="100%" stopColor="#C5A059" stopOpacity="0" />
                        </linearGradient>
                        <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#C5A059" floodOpacity="0.7" />
                        </filter>
                      </defs>

                      {/* Horizontal Gridlines */}
                      {[10000, 20000, 30000, 40000].map((level) => {
                        const y = chartHeight - (level / maxRev) * (chartHeight - 40) - 20;
                        return (
                          <g key={level}>
                            <line
                              x1={paddingX}
                              y1={y}
                              x2={chartWidth - paddingX}
                              y2={y}
                              stroke="rgba(197, 160, 89, 0.15)"
                              strokeDasharray="4 4"
                            />
                            <text
                              x={paddingX - 10}
                              y={y + 3}
                              fill="rgba(255, 255, 255, 0.3)"
                              fontSize="8"
                              fontFamily="monospace"
                              textAnchor="end"
                            >
                              €{(level / 1000).toFixed(0)}k
                            </text>
                          </g>
                        );
                      })}

                      {/* Area Fill */}
                      <path d={areaPathD} fill="url(#goldGradient)" />

                      {/* Bar columns under each point */}
                      {points.map((p, idx) => {
                        const isHovered = hoveredMonthIndex === idx;
                        const barWidth = 14;
                        return (
                          <rect
                            key={`bar-${idx}`}
                            x={p.x - barWidth / 2}
                            y={p.y}
                            width={barWidth}
                            height={chartHeight - p.y}
                            fill={isHovered ? "rgba(197, 160, 89, 0.4)" : "rgba(197, 160, 89, 0.08)"}
                            className="transition-all duration-200 cursor-pointer"
                            onClick={() => setHoveredMonthIndex(idx)}
                            onMouseEnter={() => setHoveredMonthIndex(idx)}
                          />
                        );
                      })}

                      {/* Smooth Trend Spline */}
                      <path
                        d={pathD}
                        fill="none"
                        stroke="#C5A059"
                        strokeWidth="2.5"
                        filter="url(#goldGlow)"
                      />

                      {/* Data Point Dots & Labels */}
                      {points.map((p, idx) => {
                        const isHovered = hoveredMonthIndex === idx;
                        return (
                          <g
                            key={idx}
                            className="cursor-pointer"
                            onClick={() => setHoveredMonthIndex(idx)}
                            onMouseEnter={() => setHoveredMonthIndex(idx)}
                          >
                            {/* Hover guideline */}
                            {isHovered && (
                              <line
                                x1={p.x}
                                y1={20}
                                x2={p.x}
                                y2={chartHeight}
                                stroke="rgba(197, 160, 89, 0.5)"
                                strokeDasharray="3 3"
                              />
                            )}

                            {/* Circle point */}
                            <circle
                              cx={p.x}
                              cy={p.y}
                              r={isHovered ? 6 : 4}
                              fill={isHovered ? "#FFFFFF" : "#C5A059"}
                              stroke="#050505"
                              strokeWidth="2"
                              className="transition-all duration-200"
                            />

                            {/* Month Label */}
                            <text
                              x={p.x}
                              y={chartHeight + 18}
                              fill={isHovered ? "#C5A059" : "rgba(255, 255, 255, 0.5)"}
                              fontSize="9"
                              fontFamily="sans-serif"
                              fontWeight={isHovered ? "bold" : "normal"}
                              textAnchor="middle"
                              letterSpacing="0.1em"
                            >
                              {p.short.toUpperCase()}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 text-[7.5px] sm:text-[8px] font-sans tracking-widest uppercase text-white/40 pt-4 border-t border-white/5">
                  <span>Hover or tap any month marker to inspect sales analytics</span>
                  <span className="text-gold font-medium">Audited Store Books · Fiscal 2026</span>
                </div>
              </div>

              {/* Three Strategic Breakdown Panels */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {/* 1. Global Store Distribution */}
                <div className="border border-gold/25 bg-[#0a0a0a] p-4 sm:p-6 rounded-sm">
                  <div className="flex items-center justify-between border-b border-gold/15 pb-3 mb-4 sm:mb-5">
                    <span className="font-sans text-[7.5px] sm:text-[8px] tracking-[0.3em] uppercase text-gold font-semibold">
                      STORE REVENUE BY CITY
                    </span>
                    <Globe size={12} className="text-gold" />
                  </div>

                  <div className="space-y-3.5 sm:space-y-4">
                    {[
                      { city: "Paris (Flagship Store)", share: "38%", amount: "€76,532" },
                      { city: "Milan (Fashion Suite)", share: "24%", amount: "€48,336" },
                      { city: "Dubai (Emirates Store)", share: "20%", amount: "€40,280" },
                      { city: "New York (Private Client)", share: "12%", amount: "€24,168" },
                      { city: "Zurich (Luxury Store)", share: "6%", amount: "€12,084" },
                    ].map((salon) => (
                      <div key={salon.city} className="space-y-1">
                        <div className="flex justify-between text-xs font-sans">
                          <span className="text-white/80">{salon.city}</span>
                          <span className="text-gold font-mono">{salon.amount}</span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-gold to-champagne" style={{ width: salon.share }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Collection Dress Share */}
                <div className="border border-gold/25 bg-[#0a0a0a] p-4 sm:p-6 rounded-sm">
                  <div className="flex items-center justify-between border-b border-gold/15 pb-3 mb-4 sm:mb-5">
                    <span className="font-sans text-[7.5px] sm:text-[8px] tracking-[0.3em] uppercase text-gold font-semibold">
                      REVENUE BY DRESS COLLECTION
                    </span>
                    <Sparkles size={12} className="text-gold" />
                  </div>

                  <div className="space-y-3.5 sm:space-y-4">
                    {[
                      { name: "THE SPOTLIGHT (Emerald Gown)", pct: "42%", total: "€84,588" },
                      { name: "THE FLAPPER (Beaded Fringe)", pct: "26%", total: "€52,364" },
                      { name: "THE PRELUDE (Velvet Cocktail Dress)", pct: "18%", total: "€36,252" },
                      { name: "THE AFTERGLOW (Silver Metallic Jumpsuit)", pct: "10%", total: "€20,140" },
                      { name: "MIDNIGHT REBEL (Asymmetric)", pct: "4%", total: "€8,056" },
                    ].map((dress) => (
                      <div key={dress.name} className="space-y-1">
                        <div className="flex justify-between text-xs font-sans">
                          <span className="text-white/80">{dress.name}</span>
                          <span className="text-gold font-mono">{dress.total}</span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gold" style={{ width: dress.pct }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Executive Financial Metrics */}
                <div className="border border-gold/25 bg-[#0a0a0a] p-4 sm:p-6 rounded-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-gold/15 pb-3 mb-4 sm:mb-5">
                      <span className="font-sans text-[7.5px] sm:text-[8px] tracking-[0.3em] uppercase text-gold font-semibold">
                        EXECUTIVE FINANCIAL BENCHMARKS
                      </span>
                      <Crown size={12} className="text-gold" />
                    </div>

                    <div className="space-y-3 sm:space-y-4 font-sans text-xs">
                      <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="text-white/50 uppercase text-[8px] tracking-wider">Average Order Value (AOV)</span>
                        <span className="text-white font-mono font-medium">€3,420</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="text-white/50 uppercase text-[8px] tracking-wider">Peak Single Order</span>
                        <span className="text-gold font-mono font-medium">€6,850</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="text-white/50 uppercase text-[8px] tracking-wider">VIP Patron Retention</span>
                        <span className="text-emerald-400 font-mono font-medium">92.4%</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-white/50 uppercase text-[8px] tracking-wider">Gross Profit Margin</span>
                        <span className="text-white font-mono font-medium">88.5%</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gold/15">
                    <button
                      onClick={() => setAdminSubTab("orders")}
                      className="w-full py-3 bg-gradient-to-r from-gold via-champagne to-gold text-[#050505] font-sans text-[8px] tracking-[0.25em] sm:tracking-[0.3em] uppercase font-semibold hover:opacity-90 transition-opacity"
                    >
                      MANAGE CLIENT ORDERS ({orders.length})
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: CLIENT ORDERS PAGE & STATUS UPDATES               */}
          {/* ======================================================== */}
          {adminSubTab === "orders" && (
            <div className="space-y-6">
              {/* Filter Pills */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className="font-sans text-[7.5px] sm:text-[8px] tracking-[0.25em] uppercase text-white/40 mr-1">
                    {t.adminDashboard.statusFilter}
                  </span>
                  {[
                    { id: "all", label: `${t.adminDashboard.orderFilterAll} (${orders.length})` },
                    {
                      id: "Processing",
                      label: `${t.adminDashboard.orderFilterProcessing} (${orders.filter((o) => o.status === "Processing").length})`,
                    },
                    {
                      id: "Dispatched",
                      label: `${t.adminDashboard.orderFilterDispatched} (${orders.filter((o) => o.status === "Dispatched").length})`,
                    },
                    {
                      id: "Delivered",
                      label: `${t.adminDashboard.orderFilterDelivered} (${orders.filter((o) => o.status === "Delivered").length})`,
                    },
                    {
                      id: "Cancelled",
                      label: `${t.adminDashboard.orderFilterCancelled} (${orders.filter((o) => o.status === "Cancelled").length})`,
                    },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setAdminOrderFilter(filter.id as any)}
                      className={`px-2.5 sm:px-3 py-1.5 sm:py-1 text-[7.5px] sm:text-[8px] font-sans tracking-[0.15em] sm:tracking-[0.2em] uppercase border transition-colors ${
                        adminOrderFilter === filter.id
                          ? "border-gold bg-gold/15 text-gold font-semibold"
                          : "border-white/10 text-white/40 hover:text-white"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                <span className="font-sans text-[8px] sm:text-[9px] text-white/40 uppercase tracking-widest self-end sm:self-auto">
                  {t.adminDashboard.orderSectionTitle}
                </span>
              </div>

              {/* Status Update Notification Toast */}
              <AnimatePresence>
                {orderNotification && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="p-3 bg-emerald-500/10 border border-emerald-400/40 text-emerald-300 text-xs font-sans flex items-center gap-2 rounded-sm"
                  >
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                    <span>{orderNotification}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {filteredAdminOrders.length === 0 ? (
                <div className="text-center py-16 border border-gold/15 bg-black/40">
                  <Package className="w-10 h-10 text-gold/40 mx-auto mb-3" />
                  <p className="font-serif text-lg text-white/70">{t.adminDashboard.orderNoItems}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAdminOrders.map((order) => {
                    const isProcessing = order.status === "Processing";
                    const isDispatched = order.status === "Dispatched";
                    const isDelivered = order.status === "Delivered";
                    const isCancelled = order.status === "Cancelled";

                    return (
                      <div
                        key={order.id}
                        className="border border-gold/25 bg-[#0a0a0a] p-4 sm:p-6 rounded-sm shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all"
                      >
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3.5 sm:pb-4 mb-4">
                          <div className="flex items-start sm:items-center gap-3">
                            <div className="w-10 h-10 bg-gold/10 border border-gold/30 rounded-sm flex items-center justify-center shrink-0">
                              <Package size={18} className="text-gold" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono text-xs font-semibold text-gold tracking-wider">
                                  #{order.id}
                                </span>
                                <span className="text-white/20">•</span>
                                <span className="font-sans text-[8px] text-white/40 uppercase tracking-widest">
                                  {order.date}
                                </span>
                              </div>
                              <h4 className="font-serif text-base sm:text-lg text-white tracking-wide mt-0.5">
                                {order.item}
                              </h4>
                              <p className="font-sans text-xs text-white/50">{order.subtitle}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                            <span className="font-serif text-lg text-gold font-medium">
                              {order.price}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-[8px] font-sans tracking-[0.2em] uppercase border font-semibold inline-flex items-center gap-1.5 ${
                                isDelivered
                                  ? "border-emerald-400/50 bg-emerald-500/10 text-emerald-300"
                                  : isDispatched
                                  ? "border-sky-400/50 bg-sky-500/10 text-sky-300"
                                  : isProcessing
                                  ? "border-amber-400/50 bg-amber-500/10 text-amber-300"
                                  : "border-rose-400/50 bg-rose-500/10 text-rose-300"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isProcessing
                                    ? "bg-amber-400 animate-pulse"
                                    : isDispatched
                                    ? "bg-sky-400 animate-pulse"
                                    : isDelivered
                                    ? "bg-emerald-400"
                                    : "bg-rose-400"
                                }`}
                              />
                              {order.status}
                            </span>
                          </div>
                        </div>

                        {/* Customer & Delivery Information */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 bg-white/[0.015] p-3 sm:p-3.5 border border-white/5 text-xs font-sans">
                          <div>
                            <span className="font-sans text-[7.5px] uppercase tracking-[0.25em] text-gold/80 block mb-1">
                              CLIENT CREDENTIALS
                            </span>
                            <p className="text-white font-medium">{order.customerName}</p>
                            <p className="text-white/60 font-mono text-[11px]">{order.customerEmail}</p>
                            {order.customerPhone && (
                              <p className="text-white/40 text-[10px] mt-0.5">{order.customerPhone}</p>
                            )}
                          </div>

                          <div>
                            <span className="font-sans text-[7.5px] uppercase tracking-[0.25em] text-gold/80 block mb-1">
                              SHIPPING DESTINATION & TRACKING
                            </span>
                            <p className="text-white/80 line-clamp-2">
                              {order.shippingAddress || "Private Courier Allocation"}
                            </p>
                            {order.trackingNumber && (
                              <div className="flex items-center gap-1.5 mt-1.5 text-sky-300 font-mono text-[10px]">
                                <Truck size={12} className="shrink-0" />
                                <span>Tracking: {order.trackingNumber}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Admin Status Update Actions */}
                        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-t border-white/5">
                          <span className="font-sans text-[7.5px] sm:text-[8px] uppercase tracking-[0.25em] text-white/40">
                            {t.adminDashboard.orderColAction}:
                          </span>

                          <div className="grid grid-cols-2 sm:flex sm:items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
                            <button
                              type="button"
                              disabled={isProcessing || updatingOrderId === order.id}
                              onClick={() => handleUpdateOrderStatus(order.id, "Processing")}
                              className={`py-2 px-2.5 sm:py-1.5 sm:px-3 font-sans text-[7.5px] sm:text-[8px] tracking-wider uppercase border transition-all text-center justify-center flex items-center ${
                                isProcessing
                                  ? "border-amber-400/30 bg-amber-500/10 text-amber-300/40 cursor-not-allowed"
                                  : "border-amber-400/50 text-amber-300 hover:bg-amber-400/15 cursor-pointer"
                              }`}
                            >
                              {t.adminDashboard.orderActionProcessing}
                            </button>

                            <button
                              type="button"
                              disabled={isDispatched || updatingOrderId === order.id}
                              onClick={() => handleUpdateOrderStatus(order.id, "Dispatched")}
                              className={`py-2 px-2.5 sm:py-1.5 sm:px-3 font-sans text-[7.5px] sm:text-[8px] tracking-wider uppercase border transition-all text-center justify-center flex items-center ${
                                isDispatched
                                  ? "border-sky-400/30 bg-sky-500/10 text-sky-300/40 cursor-not-allowed"
                                  : "border-sky-400/50 text-sky-300 hover:bg-sky-400/15 cursor-pointer"
                              }`}
                            >
                              {t.adminDashboard.orderActionDispatched}
                            </button>

                            <button
                              type="button"
                              disabled={isDelivered || updatingOrderId === order.id}
                              onClick={() => handleUpdateOrderStatus(order.id, "Delivered")}
                              className={`py-2 px-2.5 sm:py-1.5 sm:px-3 font-sans text-[7.5px] sm:text-[8px] tracking-wider uppercase border transition-all text-center justify-center flex items-center ${
                                isDelivered
                                  ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300/40 cursor-not-allowed"
                                  : "border-emerald-400/50 text-emerald-300 hover:bg-emerald-400/15 cursor-pointer"
                              }`}
                            >
                              {t.adminDashboard.orderActionDelivered}
                            </button>

                            <button
                              type="button"
                              disabled={isCancelled || updatingOrderId === order.id}
                              onClick={() => handleUpdateOrderStatus(order.id, "Cancelled")}
                              className={`py-2 px-2.5 sm:py-1.5 sm:px-3 font-sans text-[7.5px] sm:text-[8px] tracking-wider uppercase border transition-all text-center justify-center flex items-center ${
                                isCancelled
                                  ? "border-rose-400/30 bg-rose-500/10 text-rose-300/40 cursor-not-allowed"
                                  : "border-rose-400/50 text-rose-300 hover:bg-rose-400/15 cursor-pointer"
                              }`}
                            >
                              {t.adminDashboard.orderActionCancel}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: CLIENT ENQUIRIES LEDGER                           */}
          {/* ======================================================== */}
          {adminSubTab === "enquiries" && (
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-4">
                <span className="font-sans text-[7.5px] sm:text-[8px] tracking-[0.25em] uppercase text-white/40 mr-1 sm:mr-2">
                  {t.adminDashboard.statusFilter}
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
                    className={`px-2.5 sm:px-3 py-1.5 sm:py-1 text-[7.5px] sm:text-[8px] font-sans tracking-[0.15em] sm:tracking-[0.2em] uppercase border transition-colors ${
                      enquiryFilter === f.id
                        ? "border-gold bg-gold/15 text-gold font-semibold"
                        : "border-white/10 text-white/40 hover:text-white"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Mobile swipe hint */}
              <div className="sm:hidden text-[7px] uppercase tracking-widest text-gold/70 mb-2 px-1">
                ← Swipe table horizontally to view ledger →
              </div>

              <div className="border border-gold/20 bg-black/50 overflow-x-auto touch-pan-x [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-gold/30">
                <table className="w-full text-left font-sans text-xs min-w-[680px]">
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

          {/* ======================================================== */}
          {/* TAB 4: CLIENT DIRECT QUERIES & ADMIN REPLY SYSTEM       */}
          {/* ======================================================== */}
          {adminSubTab === "queries" && (
            <div className="space-y-6">
              {/* Filter Pills */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className="font-sans text-[7.5px] sm:text-[8px] tracking-[0.25em] uppercase text-white/40 mr-1">
                    {t.adminDashboard.statusFilter}
                  </span>
                  {[
                    { id: "all", label: `${t.adminDashboard.queryFilterAll} (${queries.length})` },
                    {
                      id: "Open",
                      label: `${t.adminDashboard.queryFilterOpen} (${queries.filter((q) => q.status === "Open").length})`,
                    },
                    {
                      id: "Replied",
                      label: `${t.adminDashboard.queryFilterReplied} (${queries.filter((q) => q.status === "Replied").length})`,
                    },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setAdminQueryFilter(filter.id as any)}
                      className={`px-2.5 sm:px-3 py-1.5 sm:py-1 text-[7.5px] sm:text-[8px] font-sans tracking-[0.15em] sm:tracking-[0.2em] uppercase border transition-colors ${
                        adminQueryFilter === filter.id
                          ? "border-gold bg-gold/15 text-gold font-semibold"
                          : "border-white/10 text-white/40 hover:text-white"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                <span className="font-sans text-[8px] sm:text-[9px] text-white/40 uppercase tracking-widest self-end sm:self-auto">
                  {t.adminDashboard.querySectionTitle}
                </span>
              </div>

              {filteredAdminQueries.length === 0 ? (
                <div className="text-center py-16 border border-gold/15 bg-black/40">
                  <Inbox className="w-10 h-10 text-gold/40 mx-auto mb-3" />
                  <p className="font-serif text-lg text-white/70">{t.adminDashboard.queryNoItems}</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {filteredAdminQueries.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gold/25 bg-[#0a0a0a] p-4 sm:p-6 rounded-sm shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all"
                    >
                      {/* Query Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3.5 sm:pb-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-serif text-base sm:text-lg text-white font-medium">
                              {item.customerName}
                            </span>
                            <span className="font-mono text-[10px] text-white/40">({item.customerEmail})</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="font-sans text-[8.5px] sm:text-[9px] uppercase tracking-wider text-gold font-semibold">
                              {item.subject}
                            </span>
                            <span className="text-white/20">•</span>
                            <span className="font-sans text-[8px] text-white/40 uppercase tracking-widest">
                              {item.date}
                            </span>
                          </div>
                        </div>

                        <div className="self-start sm:self-auto">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[8px] font-sans tracking-[0.2em] sm:tracking-[0.25em] uppercase border font-semibold ${
                              item.status === "Open"
                                ? "border-amber-400/50 bg-amber-500/10 text-amber-300"
                                : "border-emerald-400/50 bg-emerald-500/10 text-emerald-300"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                item.status === "Open" ? "bg-amber-400 animate-pulse" : "bg-emerald-400"
                              }`}
                            />
                            {item.status === "Open" ? t.adminDashboard.queryStatusOpen : t.adminDashboard.queryStatusReplied}
                          </span>
                        </div>
                      </div>

                      {/* Customer Question / Message */}
                      <div className="mb-4 sm:mb-5 bg-white/[0.02] border-l-2 border-gold/40 p-3.5 sm:p-4">
                        <p className="font-sans text-xs text-white/80 leading-relaxed">
                          "{item.message}"
                        </p>
                      </div>

                      {/* Admin Reply Display (if replied) */}
                      {item.adminReply && (
                        <div className="mb-4 bg-gold/5 border border-gold/30 p-3.5 sm:p-4 rounded-sm">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5 text-gold text-[8.5px] sm:text-[9px] font-sans font-semibold uppercase tracking-wider">
                              <Crown size={12} />
                              <span>{t.adminDashboard.queryReplyLabel}</span>
                            </div>
                            {item.adminReplyDate && (
                              <span className="font-sans text-[8px] text-white/40 uppercase tracking-widest">
                                {t.adminDashboard.queryRepliedOn} {item.adminReplyDate}
                              </span>
                            )}
                          </div>
                          <p className="font-sans text-xs text-white/90 leading-relaxed italic">
                            {item.adminReply}
                          </p>
                        </div>
                      )}

                      {/* Reply Input Box */}
                      <div className="pt-2">
                        <label className="block font-sans text-[7.5px] sm:text-[8px] tracking-[0.25em] uppercase text-white/40 mb-2">
                          {item.adminReply ? "Update / Send Follow-up Response" : t.adminDashboard.queryColAction}
                        </label>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <textarea
                            rows={2}
                            value={replyDrafts[item.id] || ""}
                            onChange={(e) =>
                              setReplyDrafts((prev) => ({ ...prev, [item.id]: e.target.value }))
                            }
                            placeholder={t.adminDashboard.queryReplyPlaceholder}
                            className="w-full sm:flex-1 bg-black/60 border border-gold/25 focus:border-gold px-3 py-2 text-xs text-white placeholder:text-white/20 outline-none transition-colors rounded-none"
                          />
                          <button
                            type="button"
                            disabled={!replyDrafts[item.id]?.trim() || replySendingId === item.id}
                            onClick={() => handleAdminSendReply(item.id)}
                            className="w-full sm:w-44 py-3 px-4 bg-gradient-to-r from-gold via-champagne to-gold text-[#050505] font-sans text-[8px] tracking-[0.2em] sm:tracking-[0.25em] uppercase font-semibold hover:opacity-90 disabled:opacity-40 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap self-stretch sm:self-auto"
                          >
                            {replySendingId === item.id ? (
                              <span>Sending...</span>
                            ) : replySuccessId === item.id ? (
                              <>
                                <Check size={12} />
                                <span>Sent!</span>
                              </>
                            ) : (
                              <>
                                <Send size={11} />
                                <span>{t.adminDashboard.queryReplySend}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: COLLECTION OVERSIGHT                              */}
          {/* ======================================================== */}
          {adminSubTab === "inventory" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {collection.map((chapter) => (
                <div
                  key={chapter.id}
                  className="border border-gold/25 p-4 sm:p-5 bg-black/40 rounded-sm relative flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-sans text-[7.5px] sm:text-[8px] tracking-[0.3em] uppercase text-gold font-medium">
                        {t.adminDashboard.chapterLabel} {chapter.index} · {chapter.subtitle}
                      </span>
                      <span className="px-2 py-0.5 border border-emerald-400/40 bg-emerald-500/10 text-emerald-300 text-[7px] tracking-wider uppercase">
                        {t.adminDashboard.stockAvailable}
                      </span>
                    </div>
                    <h3 className="font-serif text-lg sm:text-xl text-white tracking-wider mb-1">
                      {chapter.title}
                    </h3>
                    <p className="font-sans text-xs text-white/50 mb-3">{chapter.details.silhouette}</p>
                    <p className="font-sans text-[10px] text-white/70 line-clamp-2 mb-4 leading-relaxed">
                      {chapter.description}
                    </p>
                  </div>

                  <div className="pt-3.5 sm:pt-4 border-t border-gold/15 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-gold text-xs">★ {chapter.rating.toFixed(1)}</span>
                      <span className="text-white/40 text-[9px] ml-1">({chapter.reviewCount} Reviews)</span>
                    </div>
                    <span className="font-sans text-[7.5px] sm:text-[8px] tracking-widest text-white/50 uppercase">
                      {chapter.details.sizing}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 6: SALON METRICS                                    */}
          {/* ======================================================== */}
          {adminSubTab === "metrics" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="p-4 sm:p-6 border border-gold/20 bg-black/40">
                <h4 className="font-serif text-lg text-white tracking-wider mb-4">
                  {t.adminDashboard.metricsTitle}
                </h4>
                <div className="space-y-3.5 sm:space-y-4">
                  {[
                    { name: "The Spotlight (Emerald Gown)", pct: "42%", count: `19 ${t.adminDashboard.inquiriesCount}` },
                    { name: "The Flapper (Beaded Fringe)", pct: "26%", count: `12 ${t.adminDashboard.inquiriesCount}` },
                    { name: "The Prelude (Cocktail Midi)", pct: "18%", count: `9 ${t.adminDashboard.inquiriesCount}` },
                    { name: "The Afterglow (Silver Jumpsuit)", pct: "10%", count: `5 ${t.adminDashboard.inquiriesCount}` },
                    { name: "Midnight Rebel (Asymmetric Mini)", pct: "4%", count: `3 ${t.adminDashboard.inquiriesCount}` },
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

              <div className="p-4 sm:p-6 border border-gold/20 bg-black/40 flex flex-col justify-between">
                <div>
                  <h4 className="font-serif text-lg text-white tracking-wider mb-2">
                    {t.adminDashboard.directorshipTitle}
                  </h4>
                  <p className="font-sans text-xs text-white/60 leading-relaxed mb-6 font-light">
                    {t.adminDashboard.directorshipDesc}
                  </p>
                  <div className="p-4 border border-gold/30 bg-gold/5 text-xs text-ivory/80 space-y-1.5 font-sans">
                    <p className="font-medium text-gold uppercase tracking-wider text-[9px]">
                      {t.adminDashboard.securityProtocol}
                    </p>
                    <p className="text-[10px] text-white/60">
                      {t.adminDashboard.authorizedPasscodes} <code className="text-gold">AURELLE-ADMIN-777</code>, <code className="text-gold">maison2026</code>.
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-gold/15 flex justify-between items-center text-[9px] font-sans uppercase tracking-widest text-white/40">
                  <span>House of Aurelle</span>
                  <span>{t.adminDashboard.sslNotice}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    );
  }

  // ========================================================
  // VIEW 2: CLIENT VIP PROFILE DASHBOARD (FULL MULTI-TAB)
  // ========================================================
  if (user && user.role === "client") {
    const isVip =
      user.membershipTier?.toLowerCase().includes("vip") ||
      user.membershipTier?.toLowerCase().includes("circle") ||
      user.membershipTier?.toLowerCase().includes("couture") ||
      true; // All registered patrons enjoy VIP Maison status

    return (
      <main className="min-h-screen bg-[#050505] text-ivory pt-20 sm:pt-24 pb-16 sm:pb-20 px-3 sm:px-8 lg:px-16 relative overflow-hidden overflow-x-clip">
        {/* Ambient gold glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] max-w-full h-[700px] bg-gold/10 blur-[180px] pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Top Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gold/20 pb-5 sm:pb-6 mb-6 sm:mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-ivory/60 hover:text-gold font-sans text-[8.5px] sm:text-[9px] tracking-[0.25em] uppercase transition-colors"
            >
              <ArrowLeft size={14} />
              <span>{t.auth.returnToBoutique}</span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {renderLanguageSelector()}
              <button
                onClick={logout}
                className="px-3 sm:px-4 py-2 border border-gold/30 hover:border-gold hover:bg-gold/10 text-white/70 hover:text-white flex items-center gap-1.5 font-sans text-[7.5px] sm:text-[8px] tracking-[0.2em] sm:tracking-[0.25em] uppercase transition-colors"
              >
                <LogOut size={12} />
                <span>{t.nav.logout}</span>
              </button>
            </div>
          </div>

          {/* Member Banner Card */}
          <div className="border border-gold/30 bg-[#0a0a0a]/90 backdrop-blur-xl p-4 sm:p-8 rounded-sm shadow-[0_20px_60px_rgba(0,0,0,0.8)] mb-6 sm:mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 blur-2xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full border-2 border-gold/60 flex items-center justify-center font-serif text-2xl sm:text-3xl text-gold bg-gradient-to-br from-gold/20 to-black shrink-0 shadow-[0_0_25px_rgba(197,160,89,0.3)]">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h1 className="font-serif text-xl sm:text-3xl text-white tracking-wide">
                      {user.name}
                    </h1>
                    {isVip ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[7.5px] sm:text-[8px] font-sans tracking-[0.2em] sm:tracking-[0.25em] uppercase bg-gradient-to-r from-gold/20 via-gold/30 to-gold/20 border border-gold/60 text-gold font-semibold shadow-[0_0_12px_rgba(197,160,89,0.3)]">
                        <Crown size={10} />
                        {t.profile.vipMember}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[7.5px] sm:text-[8px] font-sans tracking-[0.2em] sm:tracking-[0.25em] uppercase border border-white/20 text-white/60">
                        {t.profile.standardMember}
                      </span>
                    )}
                  </div>
                  <p className="font-sans text-[9px] sm:text-[10px] text-gold/80 tracking-[0.2em] sm:tracking-[0.25em] uppercase">
                    {user.membershipTier || t.auth.defaultTier}
                  </p>
                  <p className="font-sans text-[11px] sm:text-xs text-white/50 mt-1">{user.email}</p>
                </div>
              </div>

              {/* Quick stats pills */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full md:w-auto text-center border-t md:border-t-0 md:border-l border-white/10 pt-3.5 md:pt-0 md:pl-6">
                <div className="p-2 sm:p-2.5 bg-white/[0.02] border border-gold/15">
                  <span className="font-sans text-[7px] tracking-[0.2em] sm:tracking-[0.25em] uppercase text-white/40 block mb-1">
                    STATUS
                  </span>
                  <span className="font-sans text-[11px] sm:text-xs text-emerald-400 font-medium">VIP Active</span>
                </div>
                <div className="p-2 sm:p-2.5 bg-white/[0.02] border border-gold/15">
                  <span className="font-sans text-[7px] tracking-[0.2em] sm:tracking-[0.25em] uppercase text-white/40 block mb-1">
                    ORDERS
                  </span>
                  <span className="font-serif text-xs sm:text-sm text-gold font-medium">{orderHistory.length}</span>
                </div>
                <div className="p-2 sm:p-2.5 bg-white/[0.02] border border-gold/15">
                  <span className="font-sans text-[7px] tracking-[0.2em] sm:tracking-[0.25em] uppercase text-white/40 block mb-1">
                    WATCHLIST
                  </span>
                  <span className="font-serif text-xs sm:text-sm text-gold font-medium">{watchlist.length}</span>
                </div>
                <div className="p-2 sm:p-2.5 bg-white/[0.02] border border-gold/15">
                  <span className="font-sans text-[7px] tracking-[0.2em] sm:tracking-[0.25em] uppercase text-white/40 block mb-1">
                    QUERIES
                  </span>
                  <span className="font-serif text-xs sm:text-sm text-white font-medium">{userQueries.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* PROFILE NAVIGATION TABS */}
          <div className="flex border-b border-gold/25 mb-6 sm:mb-8 gap-1.5 sm:gap-6 overflow-x-auto no-scrollbar touch-pan-x [&::-webkit-scrollbar]:hidden">
            {[
              { id: "profile", label: t.profile.tabProfile, icon: Crown },
              { id: "orders", label: `${t.profile.tabOrders} (${orderHistory.length})`, icon: Package },
              { id: "watchlist", label: `MY WATCHLIST (${watchlist.length})`, icon: Bookmark },
              { id: "queries", label: `${t.profile.tabQueries} (${userQueries.length})`, icon: MessageSquare },
              { id: "make_query", label: t.profile.tabMakeQuery, icon: Send },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = clientProfileTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setClientProfileTab(tab.id as any);
                    if (tab.id === "make_query") setClientQuerySubmitted(false);
                  }}
                  className={`py-3 sm:py-3.5 px-2.5 sm:px-4 font-sans text-[8.5px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.25em] uppercase transition-all relative flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 ${
                    isActive ? "text-gold font-semibold" : "text-white/40 hover:text-white"
                  }`}
                >
                  <Icon size={13} className={isActive ? "text-gold" : "text-white/30"} />
                  <span>{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="client-tab-line"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold via-champagne to-gold"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* TAB 1: PROFILE DETAILS & VIP PRIVILEGES */}
          {clientProfileTab === "profile" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Patron Credentials */}
              <div className="border border-gold/25 bg-[#0a0a0a] p-4 sm:p-6 rounded-sm">
                <div className="flex items-center gap-2 border-b border-gold/15 pb-3 mb-4 sm:mb-5 text-gold">
                  <Sparkles size={14} />
                  <h3 className="font-sans text-[8.5px] sm:text-[9px] tracking-[0.3em] uppercase font-semibold">
                    PATRON CREDENTIALS
                  </h3>
                </div>

                <div className="space-y-3.5 sm:space-y-4 font-sans text-xs">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-white/50 uppercase text-[8.5px] sm:text-[9px] tracking-wider">Full Name</span>
                    <span className="text-white font-medium">{user.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-white/50 uppercase text-[8.5px] sm:text-[9px] tracking-wider">{t.profile.email}</span>
                    <span className="text-white font-mono text-[11px] truncate max-w-[180px] sm:max-w-none">{user.email}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-white/50 uppercase text-[8.5px] sm:text-[9px] tracking-wider">{t.profile.phone}</span>
                    <span className="text-white">{user.phone || t.profile.noPhone}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-white/50 uppercase text-[8.5px] sm:text-[9px] tracking-wider">
                      {t.profile.memberSince}
                    </span>
                    <span className="text-gold font-medium">{user.joinDate || "2026 Season"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-white/50 uppercase text-[8.5px] sm:text-[9px] tracking-wider">VIP Tier</span>
                    <span className="text-gold font-semibold tracking-wide">
                      {user.membershipTier || t.auth.defaultTier}
                    </span>
                  </div>
                </div>
              </div>

              {/* VIP Allocations & Privileges */}
              <div className="border border-gold/25 bg-[#0a0a0a] p-4 sm:p-6 rounded-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 border-b border-gold/15 pb-3 mb-4 sm:mb-5 text-gold">
                    <Crown size={14} />
                    <h3 className="font-sans text-[8.5px] sm:text-[9px] tracking-[0.3em] uppercase font-semibold">
                      HAUTE COUTURE PRIVILEGES
                    </h3>
                  </div>

                  <div className="space-y-2.5 sm:space-y-3 font-sans text-xs mb-5 sm:mb-6">
                    <div className="flex justify-between items-center p-3 bg-white/[0.02] border border-white/5">
                      <span className="text-white/70">{t.auth.memberStatus}</span>
                      <span className="text-emerald-400 font-medium text-[9px] sm:text-[10px] tracking-wider uppercase">
                        {t.auth.activeAllocations}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/[0.02] border border-white/5">
                      <span className="text-white/70">{t.auth.privateConsultation}</span>
                      <span className="text-gold font-medium text-[9px] sm:text-[10px] tracking-wider uppercase">
                        {t.auth.complimentaryPriority}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/[0.02] border border-white/5">
                      <span className="text-white/70">{t.auth.collectionPreview}</span>
                      <span className="text-white text-[9px] sm:text-[10px] tracking-wider uppercase">
                        {t.auth.previewSeason}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-4 border-t border-gold/15">
                  <Link
                    href="/#collection"
                    className="flex-1 py-3 bg-gold text-[#050505] font-sans text-[8.5px] sm:text-[9px] tracking-[0.25em] uppercase font-semibold text-center hover:bg-[#d8b56f] transition-all"
                  >
                    {t.auth.exploreCollectionBtn}
                  </Link>
                  <button
                    onClick={() => setClientProfileTab("make_query")}
                    className="flex-1 py-3 border border-gold/40 text-gold font-sans text-[8.5px] sm:text-[9px] tracking-[0.25em] uppercase text-center hover:bg-gold/10 transition-colors"
                  >
                    {t.profile.tabMakeQuery}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDER HISTORY */}
          {clientProfileTab === "orders" && (
            <div className="border border-gold/25 bg-[#0a0a0a] rounded-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gold/15 pb-4 mb-4 sm:mb-6">
                <div>
                  <h3 className="font-serif text-lg sm:text-xl text-white tracking-wide">
                    {t.profile.tabOrders}
                  </h3>
                  <p className="font-sans text-[9px] sm:text-[10px] text-white/40 uppercase tracking-widest mt-0.5">
                    Maison Aurelle Haute Couture Acquisitions
                  </p>
                </div>
                <span className="font-sans text-[8px] sm:text-[9px] text-gold tracking-widest uppercase self-start sm:self-auto">
                  {orderHistory.length} Recorded Orders
                </span>
              </div>

              {orderHistory.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-10 h-10 text-gold/30 mx-auto mb-3" />
                  <p className="font-sans text-xs text-white/50">{t.profile.ordersEmpty}</p>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {orderHistory.map((order) => {
                    const isProcessing = order.status === "Processing";
                    const isDispatched = order.status === "Dispatched";
                    const isDelivered = order.status === "Delivered";

                    return (
                      <div
                        key={order.id}
                        className="py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 hover:bg-white/[0.015] px-1 sm:px-2 transition-colors"
                      >
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold/10 border border-gold/30 rounded-sm flex items-center justify-center shrink-0">
                            <Package size={18} className="text-gold sm:w-5 sm:h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-serif text-base text-white tracking-wide">
                                {order.item}
                              </h4>
                              <span className="font-mono text-[9px] text-white/40">#{order.id}</span>
                            </div>
                            <p className="font-sans text-xs text-white/60">{order.subtitle}</p>
                            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                              <span className="font-sans text-[8px] sm:text-[9px] text-white/40 uppercase tracking-wider">
                                {order.date}
                              </span>
                              {order.trackingNumber && (
                                <span className="text-sky-300 font-mono text-[10px] flex items-center gap-1">
                                  <Truck size={11} className="shrink-0" /> {order.trackingNumber}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                          <span className="font-serif text-base text-gold font-medium">
                            {order.price}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-[8px] font-sans tracking-[0.2em] uppercase border font-semibold flex items-center gap-1.5 ${
                              isDelivered
                                ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-300"
                                : isDispatched
                                ? "border-sky-400/40 bg-sky-500/10 text-sky-300"
                                : isProcessing
                                ? "border-amber-400/40 bg-amber-500/10 text-amber-300"
                                : "border-rose-400/40 bg-rose-500/10 text-rose-300"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isProcessing
                                  ? "bg-amber-400 animate-pulse"
                                  : isDispatched
                                  ? "bg-sky-400 animate-pulse"
                                  : isDelivered
                                  ? "bg-emerald-400"
                                  : "bg-rose-400"
                              }`}
                            />
                            {order.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MY QUERIES (QUESTIONS & ADMIN REPLIES) */}
          {clientProfileTab === "queries" && (
            <div className="space-y-5 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gold/20 pb-4">
                <div>
                  <h3 className="font-serif text-lg sm:text-xl text-white tracking-wide">
                    {t.profile.tabQueries}
                  </h3>
                  <p className="font-sans text-[9px] sm:text-[10px] text-white/40 uppercase tracking-widest mt-0.5">
                    Direct communications with the Maison Atelier Directorate
                  </p>
                </div>
                <button
                  onClick={() => setClientProfileTab("make_query")}
                  className="px-4 py-2 bg-gradient-to-r from-gold via-champagne to-gold text-[#050505] font-sans text-[7.5px] sm:text-[8px] tracking-[0.25em] uppercase font-semibold hover:opacity-90 transition-opacity self-stretch sm:self-auto text-center"
                >
                  + {t.profile.tabMakeQuery}
                </button>
              </div>

              {userQueries.length === 0 ? (
                <div className="text-center py-16 border border-gold/20 bg-[#0a0a0a] rounded-sm">
                  <MessageSquare className="w-12 h-12 text-gold/30 mx-auto mb-3" />
                  <p className="font-serif text-lg text-white/70 mb-2">{t.profile.myQueriesEmpty}</p>
                  <p className="font-sans text-xs text-white/40 max-w-md mx-auto mb-6">
                    Have a question regarding custom measurements, private styling, or order dispatch?
                  </p>
                  <button
                    onClick={() => setClientProfileTab("make_query")}
                    className="px-6 py-3 border border-gold text-gold font-sans text-[8px] tracking-[0.3em] uppercase hover:bg-gold hover:text-black transition-all"
                  >
                    {t.profile.tabMakeQuery}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userQueries.map((query) => (
                    <div
                      key={query.id}
                      className="border border-gold/25 bg-[#0a0a0a] p-4 sm:p-6 rounded-sm shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
                    >
                      {/* Query Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3 mb-3.5 sm:mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-serif text-base sm:text-lg text-white font-medium">
                              {query.subject}
                            </h4>
                          </div>
                          <span className="font-sans text-[8px] text-white/40 uppercase tracking-widest">
                            {t.profile.queryDate}: {query.date}
                          </span>
                        </div>

                        <div className="self-start sm:self-auto">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[8px] font-sans tracking-[0.2em] uppercase border font-semibold ${
                              query.status === "Replied"
                                ? "border-emerald-400/50 bg-emerald-500/10 text-emerald-300"
                                : "border-amber-400/50 bg-amber-500/10 text-amber-300"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                query.status === "Replied" ? "bg-emerald-400" : "bg-amber-400 animate-pulse"
                              }`}
                            />
                            {query.status === "Replied" ? t.profile.queryStatusReplied : t.profile.queryStatusOpen}
                          </span>
                        </div>
                      </div>

                      {/* Client's Message */}
                      <div className="mb-4 bg-white/[0.02] p-3.5 sm:p-4 rounded-sm border-l-2 border-white/20">
                        <p className="font-sans text-xs text-white/80 leading-relaxed">
                          {query.message}
                        </p>
                      </div>

                      {/* Admin Atelier Reply (if present) */}
                      {query.adminReply ? (
                        <div className="mt-4 bg-gradient-to-r from-gold/15 via-gold/10 to-transparent border border-gold/40 p-3.5 sm:p-4 rounded-sm relative">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5 sm:gap-2 text-gold">
                              <Crown size={13} className="shrink-0" />
                              <span className="font-sans text-[8.5px] sm:text-[9px] tracking-[0.2em] sm:tracking-[0.25em] uppercase font-semibold">
                                {t.profile.adminReply} · Store Director
                              </span>
                            </div>
                            {query.adminReplyDate && (
                              <span className="font-sans text-[7.5px] sm:text-[8px] text-white/40 uppercase tracking-widest">
                                {query.adminReplyDate}
                              </span>
                            )}
                          </div>
                          <p className="font-sans text-xs text-white leading-relaxed italic">
                            "{query.adminReply}"
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-amber-300/80 font-sans text-[8.5px] sm:text-[9px] uppercase tracking-wider pt-2">
                          <Clock size={12} className="animate-pulse shrink-0" />
                          <span>Awaiting response from Store Director (Typically within 24 hours)</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB WATCHLIST: SAVED LOOKS */}
          {clientProfileTab === "watchlist" && (
            <div className="border border-gold/25 bg-[#0a0a0a] rounded-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gold/15 pb-4 mb-6">
                <div>
                  <h3 className="font-serif text-lg sm:text-xl text-white tracking-wide flex items-center gap-2">
                    <Bookmark size={18} className="text-gold" />
                    My Atelier Watchlist
                  </h3>
                  <p className="font-sans text-[9px] sm:text-[10px] text-white/40 uppercase tracking-widest mt-1">
                    Saved garments from the Maison Aurelle collection
                  </p>
                </div>
                {watchlist.length > 0 && (
                  <span className="font-sans text-[8px] tracking-[0.2em] uppercase text-gold border border-gold/30 px-3 py-1">
                    {watchlist.length} {watchlist.length === 1 ? "PIECE" : "PIECES"} SAVED
                  </span>
                )}
              </div>

              {watchlist.length === 0 ? (
                <div className="text-center py-16 space-y-5">
                  <div className="w-16 h-16 rounded-full bg-gold/5 border border-gold/20 mx-auto flex items-center justify-center">
                    <Bookmark size={28} className="text-gold/40" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg text-white/60 tracking-wide mb-2">Your watchlist is empty</h4>
                    <p className="font-sans text-[10px] text-white/35 uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
                      Browse the collection and save pieces that inspire you. They will appear here for easy ordering.
                    </p>
                  </div>
                  <Link
                    href="/#collection"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-gold/40 text-gold font-sans text-[8.5px] tracking-[0.3em] uppercase hover:bg-gold/10 transition-colors"
                  >
                    EXPLORE COLLECTION
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {watchlist.map((item) => (
                    <div
                      key={item.lookId}
                      className="border border-gold/15 bg-black/40 overflow-hidden group hover:border-gold/35 transition-colors"
                    >
                      {/* Image */}
                      <div className="relative h-52 overflow-hidden bg-black/60">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Bookmark size={32} className="text-gold/20" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3">
                          <p className="font-serif text-sm text-white tracking-widest leading-tight">{item.title}</p>
                          <p className="font-sans text-[8px] text-white/60 uppercase tracking-widest mt-0.5">{item.subtitle}</p>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="p-3.5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-serif text-sm text-gold">{item.price || getGarmentPrice(item.title)}</span>
                          <span className="font-sans text-[7.5px] text-white/35 uppercase tracking-widest">
                            Saved {new Date(item.addedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setWatchlistOrderLook({
                                id: item.lookId,
                                title: item.title,
                                subtitle: item.subtitle,
                                price: item.price || getGarmentPrice(item.title),
                                imagePrimary: item.image,
                              });
                              setWatchlistOrderModalOpen(true);
                            }}
                            className="flex-1 py-2.5 bg-gradient-to-r from-gold via-champagne to-gold text-[#050505] font-sans text-[7.5px] tracking-[0.25em] uppercase font-semibold hover:opacity-90 transition-opacity"
                          >
                            ORDER NOW
                          </button>
                          <button
                            onClick={() => removeFromWatchlist(item.lookId)}
                            className="p-2.5 border border-white/15 text-white/40 hover:border-rose-400/50 hover:text-rose-400 transition-colors"
                            title="Remove from watchlist"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ORDER MODAL for watchlist items */}
          <OrderModal
            isOpen={watchlistOrderModalOpen}
            onClose={() => { setWatchlistOrderModalOpen(false); setWatchlistOrderLook(null); }}
            look={watchlistOrderLook}
          />

          {/* TAB 4: MAKE A QUERY FORM */}
          {clientProfileTab === "make_query" && (
            <div className="max-w-2xl mx-auto border border-gold/30 bg-[#0a0a0a] p-5 sm:p-8 rounded-sm shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
              <div className="border-b border-gold/20 pb-4 mb-5 sm:mb-6">
                <div className="flex items-center gap-2 text-gold mb-1">
                  <MessageSquare size={16} />
                  <span className="font-sans text-[8.5px] sm:text-[9px] tracking-[0.3em] sm:tracking-[0.35em] uppercase font-semibold">
                    DIRECT CLIENT CONCIERGE
                  </span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl text-white tracking-wide">
                  {t.profile.tabMakeQuery}
                </h3>
                <p className="font-sans text-[11px] sm:text-xs text-white/50 mt-1">
                  Submit inquiries directly to our Paris atelier stylists and executive directorship.
                </p>
              </div>

              {clientQuerySubmitted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-400/40 text-emerald-300 mx-auto flex items-center justify-center">
                    <CheckCircle2 size={28} />
                  </div>
                  <h4 className="font-serif text-xl text-white tracking-wide">Inquiry Dispatched</h4>
                  <p className="font-sans text-xs text-white/70 max-w-md mx-auto leading-relaxed">
                    {t.profile.querySuccess}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    <button
                      onClick={() => setClientProfileTab("queries")}
                      className="px-6 py-3 bg-gold text-[#050505] font-sans text-[8px] tracking-[0.3em] uppercase font-semibold hover:bg-[#d8b56f] transition-colors"
                    >
                      VIEW IN MY QUERIES
                    </button>
                    <button
                      onClick={() => setClientQuerySubmitted(false)}
                      className="px-6 py-3 border border-gold/30 text-white/70 font-sans text-[8px] tracking-[0.25em] uppercase hover:text-white hover:border-gold transition-colors"
                    >
                      {t.profile.querySuccessReset}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleClientSubmitQuery} className="space-y-4 sm:space-y-5">
                  <div>
                    <label className="block font-sans text-[7.5px] sm:text-[8px] tracking-[0.25em] uppercase text-white/50 mb-2">
                      {t.profile.querySubject}
                    </label>
                    <select
                      value={clientQuerySubject}
                      onChange={(e) => setClientQuerySubject(e.target.value)}
                      className="w-full bg-black/60 border border-gold/30 px-3.5 sm:px-4 py-2.5 sm:py-3 font-sans text-xs text-white outline-none focus:border-gold transition-colors"
                    >
                      {t.profile.subjectOptions.map((opt) => (
                        <option key={opt} value={opt} className="bg-black text-white">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-sans text-[7.5px] sm:text-[8px] tracking-[0.25em] uppercase text-white/50 mb-2">
                      {t.profile.queryMessage}
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={clientQueryMessage}
                      onChange={(e) => setClientQueryMessage(e.target.value)}
                      placeholder={t.profile.queryMessagePlaceholder}
                      className="w-full bg-black/60 border border-gold/30 px-3.5 sm:px-4 py-2.5 sm:py-3 font-sans text-xs text-white placeholder:text-white/20 outline-none focus:border-gold transition-colors leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={clientQueryLoading || !clientQueryMessage.trim()}
                    className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-gold via-champagne to-gold text-[#050505] font-sans text-[8.5px] sm:text-[9px] tracking-[0.3em] sm:tracking-[0.35em] uppercase font-semibold hover:opacity-90 disabled:opacity-40 transition-all flex items-center justify-center gap-2"
                  >
                    {clientQueryLoading ? (
                      <span>{t.profile.querySubmitting}</span>
                    ) : (
                      <>
                        <Send size={13} />
                        <span>{t.profile.querySubmit}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </main>
    );
  }

  // ========================================================
  // VIEW 3: GUEST 3-IN-1 LUXURY PORTAL (LOGIN, SIGNUP, ADMIN)
  // ========================================================
  return (
    <main className="min-h-screen bg-[#050505] text-ivory flex flex-col justify-between pt-20 sm:pt-24 pb-8 sm:pb-12 px-3 sm:px-6 relative overflow-hidden overflow-x-clip">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] max-w-full h-[600px] rounded-full bg-gold/10 blur-[150px] pointer-events-none" />

      {/* Top Bar with Return Link */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between mb-6 sm:mb-8 z-10 gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-ivory/60 hover:text-gold font-sans text-[8.5px] sm:text-[9px] tracking-[0.2em] sm:tracking-[0.25em] uppercase transition-colors"
        >
          <ArrowLeft size={14} />
          <span>{t.auth.returnToBoutique}</span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-4">
          {renderLanguageSelector()}
          <span className="font-serif text-base sm:text-lg tracking-widest text-gold font-medium">
            AURELLE
          </span>
        </div>
      </div>

      {/* Center Auth Card */}
      <div className="max-w-lg mx-auto w-full z-10">
        <div className="border border-gold/30 bg-[#0a0a0a]/90 backdrop-blur-xl p-5 sm:p-10 rounded-sm shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <span className="font-sans text-[8px] sm:text-[9px] tracking-[0.3em] sm:tracking-[0.35em] uppercase text-gold/80 font-medium block mb-1.5 sm:mb-2">
              MAISON AURELLE · PRIVATE ATELIER
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl text-white tracking-wider">
              {t.auth.loginTitle}
            </h1>
            <p className="font-sans text-[11px] sm:text-xs text-white/50 mt-1.5 sm:mt-2 font-light">
              {t.auth.loginSubtitle}
            </p>
          </div>

          {/* 3 Portal Selection Tabs */}
          <div className="grid grid-cols-3 border border-gold/30 p-1 mb-6 sm:mb-8 bg-black/40">
            <button
              type="button"
              onClick={() => setActiveTab("login")}
              className={`py-2 sm:py-2.5 font-sans text-[7.5px] sm:text-[9px] tracking-[0.15em] sm:tracking-[0.25em] uppercase transition-all ${
                activeTab === "login"
                  ? "bg-gold text-[#050505] font-semibold shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {t.auth.tabLogin}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("signup")}
              className={`py-2 sm:py-2.5 font-sans text-[7.5px] sm:text-[9px] tracking-[0.15em] sm:tracking-[0.25em] uppercase transition-all ${
                activeTab === "signup"
                  ? "bg-gold text-[#050505] font-semibold shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {t.auth.tabSignup}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("admin")}
              className={`py-2 sm:py-2.5 font-sans text-[7.5px] sm:text-[9px] tracking-[0.15em] sm:tracking-[0.25em] uppercase transition-all ${
                activeTab === "admin"
                  ? "bg-gold text-[#050505] font-semibold shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {t.auth.tabAdmin}
            </button>
          </div>

          {/* TAB 1: CLIENT LOGIN */}
          {activeTab === "login" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleClientLogin} className="space-y-4 sm:space-y-5">
                <div>
                  <label className="block font-sans text-[7.5px] sm:text-[8px] tracking-[0.25em] uppercase text-white/60 mb-1.5 sm:mb-2">
                    {t.auth.emailLabel}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder={t.auth.emailPlaceholder}
                      className="w-full bg-black/60 border border-gold/30 rounded-none px-3.5 sm:px-4 py-2.5 sm:py-3 font-sans text-xs text-white placeholder:text-white/20 outline-none focus:border-gold transition-colors"
                    />
                    <Mail size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                  </div>
                </div>

                <div>
                  <label className="block font-sans text-[7.5px] sm:text-[8px] tracking-[0.25em] uppercase text-white/60 mb-1.5 sm:mb-2">
                    {t.auth.passwordLabel}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder={t.auth.passwordPlaceholder}
                      className="w-full bg-black/60 border border-gold/30 rounded-none px-3.5 sm:px-4 py-2.5 sm:py-3 font-sans text-xs text-white placeholder:text-white/20 outline-none focus:border-gold transition-colors"
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
                  className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-gold via-champagne to-gold text-[#050505] font-sans text-[8.5px] sm:text-[9px] tracking-[0.3em] sm:tracking-[0.35em] uppercase font-semibold transition-all hover:opacity-90 disabled:opacity-50"
                >
                  {loginLoading ? t.auth.authenticating : t.auth.btnSignIn}
                </button>
              </form>

              {/* Demo Helper Button */}
              <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-white/10 text-center">
                <span className="font-sans text-[7.5px] sm:text-[8px] tracking-[0.2em] sm:tracking-[0.25em] uppercase text-white/40 block mb-2">
                  {t.auth.demoHint}
                </span>
                <button
                  type="button"
                  onClick={handleFillClientDemo}
                  className="px-3.5 py-1.5 border border-gold/30 hover:border-gold font-sans text-[7.5px] sm:text-[8px] tracking-widest uppercase text-gold bg-gold/5 transition-colors"
                >
                  {t.auth.demoClientBtn}
                </button>
              </div>
            </motion.div>
          )}

          {/* TAB 2: CLIENT SIGNUP */}
          {activeTab === "signup" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleClientSignup} className="space-y-3.5 sm:space-y-4">
                <div>
                  <label className="block font-sans text-[7.5px] sm:text-[8px] tracking-[0.25em] uppercase text-white/60 mb-1.5">
                    {t.auth.fullNameLabel}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder={t.auth.fullNamePlaceholder}
                      className="w-full bg-black/60 border border-gold/30 rounded-none px-3.5 sm:px-4 py-2.5 font-sans text-xs text-white placeholder:text-white/20 outline-none focus:border-gold transition-colors"
                    />
                    <UserIcon size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                  </div>
                </div>

                <div>
                  <label className="block font-sans text-[7.5px] sm:text-[8px] tracking-[0.25em] uppercase text-white/60 mb-1.5">
                    {t.auth.emailLabel}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder={t.auth.emailPlaceholder}
                      className="w-full bg-black/60 border border-gold/30 rounded-none px-3.5 sm:px-4 py-2.5 font-sans text-xs text-white placeholder:text-white/20 outline-none focus:border-gold transition-colors"
                    />
                    <Mail size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                  </div>
                </div>

                <div>
                  <label className="block font-sans text-[7.5px] sm:text-[8px] tracking-[0.25em] uppercase text-white/60 mb-1.5">
                    {t.auth.phoneLabel}
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      placeholder={t.auth.phonePlaceholder}
                      className="w-full bg-black/60 border border-gold/30 rounded-none px-3.5 sm:px-4 py-2.5 font-sans text-xs text-white placeholder:text-white/20 outline-none focus:border-gold transition-colors"
                    />
                    <Phone size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                  </div>
                </div>

                <div>
                  <label className="block font-sans text-[7.5px] sm:text-[8px] tracking-[0.25em] uppercase text-white/60 mb-1.5">
                    {t.auth.interestLabel}
                  </label>
                  <select
                    value={signupInterest}
                    onChange={(e) => setSignupInterest(e.target.value)}
                    className="w-full bg-black/60 border border-gold/30 rounded-none px-3.5 sm:px-4 py-2.5 font-sans text-xs text-white outline-none focus:border-gold transition-colors"
                  >
                    <option value="Haute Couture Circle" className="bg-black text-white">
                      {t.auth.interestGala}
                    </option>
                    <option value="Grand Gala & Red Carpet" className="bg-black text-white">
                      {t.auth.interestCocktail}
                    </option>
                    <option value="Private Salon Viewing" className="bg-black text-white">
                      {t.auth.interestBridal}
                    </option>
                    <option value="Bespoke Bridal & Soirée" className="bg-black text-white">
                      {t.auth.interestCustom}
                    </option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-sans text-[7.5px] sm:text-[8px] tracking-[0.25em] uppercase text-white/60 mb-1.5">
                      {t.auth.passwordLabel}
                    </label>
                    <input
                      type="password"
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-black/60 border border-gold/30 rounded-none px-3 py-2.5 font-sans text-xs text-white placeholder:text-white/20 outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-[7.5px] sm:text-[8px] tracking-[0.25em] uppercase text-white/60 mb-1.5">
                      {t.auth.confirmPasswordLabel}
                    </label>
                    <input
                      type="password"
                      required
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-black/60 border border-gold/30 rounded-none px-3 py-2.5 font-sans text-xs text-white placeholder:text-white/20 outline-none focus:border-gold transition-colors"
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
                  className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-gold via-champagne to-gold text-[#050505] font-sans text-[8.5px] sm:text-[9px] tracking-[0.3em] sm:tracking-[0.35em] uppercase font-semibold transition-all hover:opacity-90 disabled:opacity-50 mt-2"
                >
                  {signupLoading ? t.auth.creatingAccount : t.auth.btnCreateAccount}
                </button>
              </form>
            </motion.div>
          )}

          {/* TAB 3: ADMIN LOGIN */}
          {activeTab === "admin" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-5 sm:mb-6 p-3 bg-gold/10 border border-gold/30 text-center">
                <div className="flex items-center justify-center gap-1.5 text-gold mb-1">
                  <ShieldCheck size={14} />
                  <span className="font-sans text-[7.5px] sm:text-[8px] tracking-[0.3em] uppercase font-semibold">
                    {t.auth.adminTitle}
                  </span>
                </div>
                <p className="font-sans text-[9px] sm:text-[10px] text-white/60 font-light">
                  {t.auth.adminSubtitle}
                </p>
              </div>

              <form onSubmit={handleAdminSignIn} className="space-y-4 sm:space-y-5">
                <div>
                  <label className="block font-sans text-[7.5px] sm:text-[8px] tracking-[0.25em] uppercase text-white/60 mb-1.5 sm:mb-2">
                    {t.auth.adminKeyLabel}
                  </label>
                  <div className="relative">
                    <input
                      type={showAdminPasscode ? "text" : "password"}
                      required
                      value={adminPasscode}
                      onChange={(e) => setAdminPasscode(e.target.value)}
                      placeholder={t.auth.adminKeyPlaceholder}
                      className="w-full bg-black/60 border border-gold/30 rounded-none px-3.5 sm:px-4 py-2.5 sm:py-3 font-mono text-xs text-white placeholder:text-white/20 outline-none focus:border-gold transition-colors"
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
                  className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-gold via-champagne to-gold text-[#050505] font-sans text-[8.5px] sm:text-[9px] tracking-[0.3em] sm:tracking-[0.35em] uppercase font-semibold transition-all hover:opacity-90 disabled:opacity-50"
                >
                  {adminLoading ? t.auth.verifyingAccess : t.auth.btnAdminSignIn}
                </button>
              </form>

              {/* Demo Helper Button */}
              <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-white/10 text-center">
                <span className="font-sans text-[7.5px] sm:text-[8px] tracking-[0.2em] sm:tracking-[0.25em] uppercase text-white/40 block mb-2">
                  {t.auth.demoHint}
                </span>
                <button
                  type="button"
                  onClick={handleFillAdminDemo}
                  className="px-3.5 py-1.5 border border-gold/30 hover:border-gold font-sans text-[7.5px] sm:text-[8px] tracking-widest uppercase text-gold bg-gold/5 transition-colors"
                >
                  {t.auth.demoAdminBtn}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer Notice */}
      <div className="text-center font-sans text-[7.5px] sm:text-[8px] tracking-[0.25em] sm:tracking-[0.3em] uppercase text-white/30 mt-6 sm:mt-8 z-10 px-2">
        {t.auth.footerNotice}
      </div>
    </main>
  );
}
