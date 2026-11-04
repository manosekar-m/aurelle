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
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [enquiries, setEnquiries] = useState<AtelierEnquiry[]>(DEFAULT_ENQUIRIES);

  // Restore stored session and enquiries
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

