"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "client" | "admin";
  title?: string;
  phone?: string;
  membershipTier?: string;
  joinDate?: string;
}

export interface AtelierEnquiry {
  id: string;
  name: string;
  mobile: string;
  enquiryType: string;
  detail: string;
  lookTitle: string;
  lookSubtitle: string;
  date: string;
  status: "New" | "Fitting Scheduled" | "Completed";
}

export interface Query {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  message: string;
  date: string;
  status: "Open" | "Replied" | "Closed";
  adminReply?: string;
  adminReplyDate?: string;
}

export interface OrderItem {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress?: string;
  item: string;
  subtitle: string;
  date: string;
  status: "Processing" | "Dispatched" | "Delivered" | "Cancelled";
  price: string;
  trackingNumber?: string;
  updatedAt?: string;
}

const DEFAULT_ENQUIRIES: AtelierEnquiry[] = [
  {
    id: "enq-01",
    name: "Lady Vivienne Laurent",
    mobile: "9876543210",
    enquiryType: "Sizing & Fit Consultation",
    detail: "Attending the Paris Opera Garnier gala on Nov 28. Requesting private atelier fitting for The Spotlight gown with custom waist taper.",
    lookTitle: "THE SPOTLIGHT",
    lookSubtitle: "THE MOMENT",
    date: "Nov 3, 2026",
    status: "Fitting Scheduled",
  },
  {
    id: "enq-02",
    name: "Contessa Beatrice Moretti",
    mobile: "9812345678",
    enquiryType: "Custom Alteration Request",
    detail: "Would like The Prelude cocktail midi with an extended 10cm velvet hemline for formal dinner in Milan.",
    lookTitle: "THE PRELUDE",
    lookSubtitle: "ARRIVAL",
    date: "Nov 2, 2026",
    status: "New",
  },
  {
    id: "enq-03",
    name: "Zara Al-Mansoor",
    mobile: "9715012345",
    enquiryType: "Rental / Styling Enquiry",
    detail: "Requesting VIP private viewing of The Flapper for private Dubai charity gala. Need courier to Emirates Hills.",
    lookTitle: "THE FLAPPER",
    lookSubtitle: "CELEBRATION",
    date: "Nov 1, 2026",
    status: "Completed",
  },
  {
    id: "enq-04",
    name: "Dr. Aris Thorne",
    mobile: "9845123456",
    enquiryType: "Sizing & Fit Consultation",
    detail: "Inquiring regarding The Afterglow metallic jumpsuit in size M for Art Basel Miami vernissage.",
    lookTitle: "THE AFTERGLOW",
    lookSubtitle: "THE ENERGY",
    date: "Oct 30, 2026",
    status: "New",
  },
];

const DEFAULT_QUERIES: Query[] = [
  {
    id: "qry-seed-01",
    customerId: "usr-demo",
    customerName: "Isabelle Fontaine",
    customerEmail: "isabelle@example.com",
    subject: "International Shipping to Monaco",
    message: "I am based in Monaco and would like to understand your international shipping policy for the After Dark collection pieces. Do you offer insured delivery?",
    date: "Nov 2, 2026",
    status: "Replied",
    adminReply: "Dear Isabelle, we offer fully insured DHL Express delivery to Monaco with signature confirmation. Delivery takes 3–5 business days after dispatch. Our atelier team will reach out to coordinate.",
    adminReplyDate: "Nov 3, 2026",
  },
  {
    id: "qry-seed-02",
    customerId: "usr-demo2",
    customerName: "Zara Al-Mansoor",
    customerEmail: "zara@example.com",
    subject: "Bespoke Embroidery on The Spotlight",
    message: "I would like to inquire about adding a monogram embroidery in champagne thread to The Spotlight gown. Is this possible for private orders?",
    date: "Nov 1, 2026",
    status: "Open",
  },
  {
    id: "qry-seed-03",
    customerId: "usr-demo3",
    customerName: "Priya Nair",
    customerEmail: "priya@example.com",
    subject: "VIP Membership Benefits",
    message: "Could you elaborate on the exclusive benefits included with the Haute Couture Circle membership tier? I am interested in private showroom access.",
    date: "Oct 29, 2026",
    status: "Replied",
    adminReply: "Dear Priya, the Haute Couture Circle grants you: priority access to seasonal previews, a dedicated stylist, complimentary alteration sessions, and invitation-only showroom events in Paris and Dubai.",
    adminReplyDate: "Oct 30, 2026",
  },
];

const DEFAULT_ORDERS: OrderItem[] = [
  {
    id: "ORD-7821",
    customerId: "usr-client-01",
    customerName: "Lady Vivienne Laurent",
    customerEmail: "vivienne@aurelle.com",
    customerPhone: "+33 6 12 34 56 78",
    shippingAddress: "14 Rue du Faubourg Saint-Honoré, 75008 Paris, France",
    item: "THE SPOTLIGHT",
    subtitle: "Emerald Column Gown · Size 36 FR · Custom Taper",
    date: "Nov 3, 2026",
    status: "Processing",
    price: "€4,850",
    trackingNumber: "AUR-FR-98234-PAR",
    updatedAt: "Nov 3, 2026",
  },
  {
    id: "ORD-7820",
    customerId: "usr-client-02",
    customerName: "Contessa Beatrice Moretti",
    customerEmail: "beatrice@moretti.it",
    customerPhone: "+39 02 8765 4321",
    shippingAddress: "Via Montenapoleone 8, 20121 Milano, Italy",
    item: "THE PRELUDE",
    subtitle: "Velvet Cocktail Midi · Size 38 FR · Extended Hem",
    date: "Nov 2, 2026",
    status: "Dispatched",
    price: "€2,750",
    trackingNumber: "DHL-EX-492019-MIL",
    updatedAt: "Nov 2, 2026",
  },
  {
    id: "ORD-7819",
    customerId: "usr-client-03",
    customerName: "Zara Al-Mansoor",
    customerEmail: "zara@almansoor.ae",
    customerPhone: "+971 50 123 4567",
    shippingAddress: "Villa 42, Emirates Hills Sector E, Dubai, UAE",
    item: "THE FLAPPER",
    subtitle: "Beaded Fringe Cocktail · Size S · Gold Silk Thread",
    date: "Oct 28, 2026",
    status: "Delivered",
    price: "€3,200",
    trackingNumber: "FDX-INT-88329-DXB",
    updatedAt: "Nov 1, 2026",
  },
  {
    id: "ORD-7818",
    customerId: "usr-client-04",
    customerName: "Dr. Aris Thorne",
    customerEmail: "aris.thorne@artbasel.com",
    customerPhone: "+1 (305) 555-0199",
    shippingAddress: "Star Island Dr, Miami Beach, FL 33139, USA",
    item: "THE AFTERGLOW",
    subtitle: "Silver Lamé Jumpsuit · Size M",
    date: "Oct 25, 2026",
    status: "Delivered",
    price: "€3,600",
    trackingNumber: "UPS-SV-10294-MIA",
    updatedAt: "Oct 29, 2026",
  },
  {
    id: "ORD-7817",
    customerId: "usr-client-05",
    customerName: "Evelyn Vance",
    customerEmail: "evelyn@vance.co.uk",
    customerPhone: "+44 20 7946 0912",
    shippingAddress: "Kensington Palace Gardens, London W8 4QQ, UK",
    item: "MIDNIGHT REBEL",
    subtitle: "Asymmetric Satin Mini · Size 34 FR",
    date: "Oct 20, 2026",
    status: "Cancelled",
    price: "€2,450",
    updatedAt: "Oct 21, 2026",
  },
];

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    interest?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  adminLogin: (passcode: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  enquiries: AtelierEnquiry[];
  addEnquiry: (enquiry: Omit<AtelierEnquiry, "id" | "date" | "status">) => void;
  updateEnquiryStatus: (id: string, status: AtelierEnquiry["status"]) => void;
  queries: Query[];
  addQuery: (subject: string, message: string) => void;
  replyToQuery: (id: string, replyText: string) => void;
  orders: OrderItem[];
  orderHistory: OrderItem[];
  updateOrderStatus: (id: string, status: OrderItem["status"]) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => ({ success: false }),
  signup: async () => ({ success: false }),
  adminLogin: async () => ({ success: false }),
  logout: () => {},
  enquiries: DEFAULT_ENQUIRIES,
  addEnquiry: () => {},
  updateEnquiryStatus: () => {},
  queries: DEFAULT_QUERIES,
  addQuery: () => {},
  replyToQuery: () => {},
  orders: DEFAULT_ORDERS,
  orderHistory: DEFAULT_ORDERS,
  updateOrderStatus: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [enquiries, setEnquiries] = useState<AtelierEnquiry[]>(DEFAULT_ENQUIRIES);
  const [queries, setQueries] = useState<Query[]>(DEFAULT_QUERIES);
  const [orders, setOrders] = useState<OrderItem[]>(DEFAULT_ORDERS);

  // Restore stored session and data
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("aurelle_auth_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      const storedEnq = localStorage.getItem("aurelle_enquiries");
      if (storedEnq) {
        setEnquiries(JSON.parse(storedEnq));
      }
      const storedQueries = localStorage.getItem("aurelle_queries");
      if (storedQueries) {
        setQueries(JSON.parse(storedQueries));
      }
      const storedOrders = localStorage.getItem("aurelle_orders");
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      }
    } catch {
      // localStorage may fail in some environments
    }
  }, []);

  const saveUserSession = (userData: User | null) => {
    setUser(userData);
    try {
      if (userData) {
        localStorage.setItem("aurelle_auth_user", JSON.stringify(userData));
      } else {
        localStorage.removeItem("aurelle_auth_user");
      }
    } catch {
      // ignore
    }
  };

  const login = async (email: string, password: string) => {
    // Simulated luxury authentication
    const trimmedEmail = email.trim().toLowerCase();

    // Check if admin credentials entered in client login
    if (trimmedEmail === "admin@aurelle.com" || password === "aurelle-admin" || password === "maison2026") {
      const adminUser: User = {
        id: "usr-admin-01",
        name: "Maison Director",
        email: "admin@aurelle.com",
        role: "admin",
        title: "Atelier Executive Director",
        joinDate: "Founding Member",
      };
      saveUserSession(adminUser);
      return { success: true };
    }

    if (!trimmedEmail || !password) {
      return { success: false, message: "Please enter your email and confidential password." };
    }

    const clientUser: User = {
      id: `usr-${Date.now()}`,
      name: trimmedEmail.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      email: trimmedEmail,
      role: "client",
      title: "VIP Atelier Member",
      membershipTier: "Haute Couture Circle",
      joinDate: "2026",
    };

    saveUserSession(clientUser);
    return { success: true };
  };

  const signup = async (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    interest?: string;
  }) => {
    if (!data.name.trim() || !data.email.trim() || !data.password) {
      return { success: false, message: "Please provide all required atelier membership details." };
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      role: "client",
      title: "Atelier Patron",
      phone: data.phone?.trim(),
      membershipTier: data.interest || "Haute Couture Circle",
      joinDate: "New Member 2026",
    };

    saveUserSession(newUser);
    return { success: true };
  };

  const adminLogin = async (passcode: string) => {
    const code = passcode.trim();
    // Accept valid director codes: AURELLE-ADMIN-777, maison2026, admin, aurelle2026
    const validCodes = ["AURELLE-ADMIN-777", "maison2026", "admin", "aurelle2026", "777"];
    if (validCodes.includes(code) || code.toLowerCase().includes("admin")) {
      const adminUser: User = {
        id: "usr-admin-director",
        name: "Directeur de la Maison",
        email: "direction@aurelle.com",
        role: "admin",
        title: "Executive Haute Couture Director",
        membershipTier: "Maison Sovereign Council",
        joinDate: "Founding Directorate",
      };
      saveUserSession(adminUser);
      return { success: true };
    }
    return { success: false, message: "Invalid Maison Security Passcode. Access restricted." };
  };

  const logout = () => {
    saveUserSession(null);
  };

  const addEnquiry = (enquiryData: Omit<AtelierEnquiry, "id" | "date" | "status">) => {
    const newEnq: AtelierEnquiry = {
      id: `enq-${Date.now()}`,
      ...enquiryData,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "New",
    };
    const updated = [newEnq, ...enquiries];
    setEnquiries(updated);
    try {
      localStorage.setItem("aurelle_enquiries", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const updateEnquiryStatus = (id: string, status: AtelierEnquiry["status"]) => {
    const updated = enquiries.map((item) => (item.id === id ? { ...item, status } : item));
    setEnquiries(updated);
    try {
      localStorage.setItem("aurelle_enquiries", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const addQuery = (subject: string, message: string) => {
    if (!user) return;
    const newQuery: Query = {
      id: `qry-${Date.now()}`,
      customerId: user.id,
      customerName: user.name,
      customerEmail: user.email,
      subject,
      message,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "Open",
    };
    const updated = [newQuery, ...queries];
    setQueries(updated);
    try {
      localStorage.setItem("aurelle_queries", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const replyToQuery = (id: string, replyText: string) => {
    const updated = queries.map((q) =>
      q.id === id
        ? {
            ...q,
            status: "Replied" as Query["status"],
            adminReply: replyText,
            adminReplyDate: new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
          }
        : q
    );
    setQueries(updated);
    try {
      localStorage.setItem("aurelle_queries", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const updateOrderStatus = (id: string, status: OrderItem["status"]) => {
    const updated = orders.map((o) =>
      o.id === id
        ? {
            ...o,
            status,
            updatedAt: new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
          }
        : o
    );
    setOrders(updated);
    try {
      localStorage.setItem("aurelle_orders", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Client's order history: user's specific orders, or curated atelier allocations
  const userOrderHistory = user
    ? orders.filter(
        (o) =>
          o.customerId === user.id ||
          o.customerEmail.toLowerCase() === user.email.toLowerCase()
      )
    : [];

  const effectiveOrderHistory =
    userOrderHistory.length > 0 ? userOrderHistory : orders.slice(0, 3);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        adminLogin,
        logout,
        enquiries,
        addEnquiry,
        updateEnquiryStatus,
        queries,
        addQuery,
        replyToQuery,
        orders,
        orderHistory: effectiveOrderHistory,
        updateOrderStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
