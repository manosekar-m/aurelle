"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, Truck, Sparkles, X, Crown, ArrowRight } from "lucide-react";
import { useAuth, OrderItem } from "@/context/AuthContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  look: {
    id: string;
    title: string;
    subtitle: string;
    price?: string;
    imagePrimary?: string;
  } | null;
  accent?: string;
}

const SIZES = [
  { code: "XS", label: "XS · FR 34 / US 2" },
  { code: "S", label: "S · FR 36 / US 4" },
  { code: "M", label: "M · FR 38 / US 6" },
  { code: "L", label: "L · FR 40 / US 8" },
  { code: "XL", label: "XL · FR 42 / US 10" },
  { code: "CUSTOM", label: "Custom Made-to-Measure" },
];

export const getGarmentPrice = (titleOrId: string = ""): string => {
  const norm = titleOrId.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (norm.includes("spotlight")) return "€4,850";
  if (norm.includes("prelude")) return "€2,750";
  if (norm.includes("flapper")) return "€3,200";
  if (norm.includes("afterglow")) return "€3,600";
  if (norm.includes("midnight") || norm.includes("rebel")) return "€2,450";
  return "€3,500";
};

export default function OrderModal({ isOpen, onClose, look, accent = "#C5A059" }: Props) {
  const { user, placeOrder } = useAuth();

  const [selectedSize, setSelectedSize] = useState("S");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<OrderItem | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const garmentPrice = look?.price || getGarmentPrice(look?.title || look?.id || "");

  // Pre-fill user data when modal opens or user changes
  useEffect(() => {
    if (user) {
      setCustomerName(user.name || "");
      setCustomerEmail(user.email || "");
      setCustomerPhone(user.phone || "");
    }
  }, [user, isOpen]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!customerName.trim()) errs.name = "Full name is required for atelier records";
    if (!customerEmail.trim() || !customerEmail.includes("@")) {
      errs.email = "Please provide a valid client email";
    }
    if (!shippingAddress.trim() || shippingAddress.trim().length < 8) {
      errs.address = "Please provide complete delivery destination & street address";
    }
    return errs;
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!look) return;

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newOrder = placeOrder({
        item: look.title,
        subtitle: look.subtitle,
        price: garmentPrice,
        size: selectedSize,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        shippingAddress: shippingAddress.trim(),
        specialNotes: specialNotes.trim() || undefined,
      });

      setPlacedOrder(newOrder);
      setIsSubmitting(false);
    }, 600);
  };

  const handleModalClose = () => {
    setPlacedOrder(null);
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen || !look) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[350] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleModalClose}
          className="fixed inset-0 bg-[#020202]/90 backdrop-blur-2xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl bg-[#090909] border border-gold/40 shadow-[0_25px_80px_rgba(0,0,0,0.95)] z-10 my-auto rounded-sm overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Top Gold Gradient Bar */}
          <div className="h-1 w-full bg-gradient-to-r from-gold/30 via-gold to-champagne/40 shrink-0" />

          {/* Modal Header */}
          <div className="p-4 sm:p-6 border-b border-gold/20 flex items-center justify-between shrink-0 bg-[#0c0c0c]">
            <div className="flex items-center gap-2.5">
              <Crown size={16} className="text-gold" />
              <div>
                <span className="font-sans text-[7.5px] sm:text-[8px] tracking-[0.35em] uppercase text-gold font-semibold block">
                  HAUTE COUTURE COMMISSION · ATELIER DIRECT
                </span>
                <h3 className="font-serif text-lg sm:text-2xl text-white tracking-wide">
                  Order {look.title}
                </h3>
              </div>
            </div>

            <button
              onClick={handleModalClose}
              className="p-2 border border-white/10 hover:border-gold hover:text-gold text-white/50 transition-colors rounded-full"
              aria-label="Close Order Window"
            >
              <X size={15} />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
            {placedOrder ? (
              /* Success Screen */
              <div className="py-8 text-center space-y-5">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 220, delay: 0.1 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-emerald-400 bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(52,211,153,0.3)]"
                >
                  <CheckCircle2 size={36} />
                </motion.div>

                <div>
                  <span className="font-sans text-[8px] sm:text-[9px] tracking-[0.35em] uppercase text-gold font-semibold block mb-1">
                    OFFICIALLY REGISTERED WITH MAISON AURELLE
                  </span>
                  <h4 className="font-serif text-2xl sm:text-3xl text-white tracking-wide">
                    Atelier Commission Confirmed
                  </h4>
                  <p className="font-sans text-xs text-white/60 max-w-md mx-auto mt-2 leading-relaxed">
                    Your bespoke order has been allocated to our master tailors. An executive confirmation has been dispatched to{" "}
                    <strong className="text-white">{placedOrder.customerEmail}</strong>.
                  </p>
                </div>

                {/* Order Summary Receipt Box */}
                <div className="max-w-md mx-auto bg-white/[0.02] border border-gold/30 p-4 rounded-sm text-left font-sans text-xs space-y-2.5">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-white/40 uppercase text-[8px] tracking-widest">ORDER REFERENCE</span>
                    <span className="font-mono text-gold font-semibold text-sm">#{placedOrder.id}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-white/40 uppercase text-[8px] tracking-widest">GARMENT</span>
                    <span className="text-white font-medium">{placedOrder.item}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-white/40 uppercase text-[8px] tracking-widest">SPECIFICATION</span>
                    <span className="text-white/80">{placedOrder.subtitle}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-white/40 uppercase text-[8px] tracking-widest">AMOUNT</span>
                    <span className="font-serif text-base text-gold font-semibold">{placedOrder.price}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-white/40 uppercase text-[8px] tracking-widest">STATUS</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[8px] font-sans tracking-widest uppercase bg-amber-500/10 border border-amber-400/40 text-amber-300 font-semibold inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      {placedOrder.status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                  <Link
                    href="/login?tab=orders"
                    onClick={handleModalClose}
                    className="px-6 py-3.5 bg-gradient-to-r from-gold via-champagne to-gold text-[#050505] font-sans text-[8.5px] sm:text-[9px] tracking-[0.25em] uppercase font-semibold text-center hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    <span>VIEW IN ORDER HISTORY</span>
                    <ArrowRight size={12} />
                  </Link>
                  <button
                    onClick={handleModalClose}
                    className="px-6 py-3.5 border border-gold/40 text-white/80 font-sans text-[8.5px] sm:text-[9px] tracking-[0.25em] uppercase hover:text-white hover:border-gold transition-colors"
                  >
                    CONTINUE EXPLORING
                  </button>
                </div>
              </div>
            ) : (
              /* Order Form */
              <form onSubmit={handleConfirmOrder} className="space-y-6">
                {/* Garment Preview Card */}
                <div className="p-3.5 sm:p-4 bg-white/[0.02] border border-gold/25 rounded-sm flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    {look.imagePrimary && (
                      <div className="w-14 h-16 sm:w-16 sm:h-20 relative rounded-sm overflow-hidden shrink-0 border border-gold/30">
                        <Image
                          src={look.imagePrimary}
                          alt={look.title}
                          fill
                          className="object-cover object-top"
                        />
                      </div>
                    )}
                    <div>
                      <span className="font-sans text-[7.5px] sm:text-[8px] tracking-[0.3em] uppercase text-gold font-semibold block">
                        AFTER DARK ARCHIVE
                      </span>
                      <h4 className="font-serif text-lg sm:text-xl text-white tracking-wide">
                        {look.title}
                      </h4>
                      <p className="font-sans text-[11px] text-white/50">{look.subtitle}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-sans text-[7.5px] uppercase tracking-widest text-white/40 block">
                      ATELIER PRICE
                    </span>
                    <span className="font-serif text-lg sm:text-2xl text-gold font-semibold">
                      {garmentPrice}
                    </span>
                  </div>
                </div>

                {/* Step 1: Select Size */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-sans text-[8px] tracking-[0.3em] uppercase text-gold font-semibold">
                      SELECT SILHOUETTE FIT & SIZE <span className="text-gold">*</span>
                    </label>
                    <span className="font-sans text-[8px] text-white/40 uppercase tracking-widest">
                      True to Paris Atelier Sizing
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {SIZES.map((size) => (
                      <button
                        key={size.code}
                        type="button"
                        onClick={() => setSelectedSize(size.code)}
                        className={`py-2.5 px-3 border font-sans text-xs text-left transition-all rounded-sm flex items-center justify-between ${
                          selectedSize === size.code
                            ? "border-gold bg-gold/15 text-gold font-medium shadow-[0_0_15px_rgba(197,160,89,0.2)]"
                            : "border-white/10 text-white/60 hover:border-white/30 hover:text-white bg-black/40"
                        }`}
                      >
                        <span className="text-[11px]">{size.label}</span>
                        {selectedSize === size.code && <Sparkles size={11} className="text-gold" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Client Credentials */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-[7.5px] sm:text-[8px] tracking-[0.25em] uppercase text-white/60 mb-1.5">
                      PATRON FULL NAME <span className="text-gold">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        setErrors((prev) => ({ ...prev, name: "" }));
                      }}
                      placeholder="e.g. Lady Vivienne Laurent"
                      className="w-full bg-black/60 border border-gold/30 px-3.5 py-2.5 font-sans text-xs text-white placeholder:text-white/20 outline-none focus:border-gold transition-colors"
                    />
                    {errors.name && (
                      <p className="font-sans text-[9px] text-rose-400 mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-sans text-[7.5px] sm:text-[8px] tracking-[0.25em] uppercase text-white/60 mb-1.5">
                      CONTACT EMAIL <span className="text-gold">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => {
                        setCustomerEmail(e.target.value);
                        setErrors((prev) => ({ ...prev, email: "" }));
                      }}
                      placeholder="e.g. client@domain.com"
                      className="w-full bg-black/60 border border-gold/30 px-3.5 py-2.5 font-sans text-xs text-white placeholder:text-white/20 outline-none focus:border-gold transition-colors font-mono"
                    />
                    {errors.email && (
                      <p className="font-sans text-[9px] text-rose-400 mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-[7.5px] sm:text-[8px] tracking-[0.25em] uppercase text-white/60 mb-1.5">
                      MOBILE / WHATSAPP NUMBER
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. +33 6 12 34 56 78"
                      className="w-full bg-black/60 border border-gold/30 px-3.5 py-2.5 font-sans text-xs text-white placeholder:text-white/20 outline-none focus:border-gold transition-colors font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-sans text-[7.5px] sm:text-[8px] tracking-[0.25em] uppercase text-white/60 mb-1.5">
                      DELIVERY ADDRESS & CITY <span className="text-gold">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress}
                      onChange={(e) => {
                        setShippingAddress(e.target.value);
                        setErrors((prev) => ({ ...prev, address: "" }));
                      }}
                      placeholder="e.g. 14 Rue du Faubourg Saint-Honoré, Paris"
                      className="w-full bg-black/60 border border-gold/30 px-3.5 py-2.5 font-sans text-xs text-white placeholder:text-white/20 outline-none focus:border-gold transition-colors"
                    />
                    {errors.address && (
                      <p className="font-sans text-[9px] text-rose-400 mt-1">{errors.address}</p>
                    )}
                  </div>
                </div>

                {/* Optional Alterations / Notes */}
                <div>
                  <label className="block font-sans text-[7.5px] sm:text-[8px] tracking-[0.25em] uppercase text-white/60 mb-1.5">
                    SPECIAL ATELIER REQUESTS OR ALTERATIONS (OPTIONAL)
                  </label>
                  <textarea
                    rows={2}
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="e.g. Custom hem length, specific gala delivery date, private silk garment bag…"
                    className="w-full bg-black/60 border border-gold/30 px-3.5 py-2 font-sans text-xs text-white placeholder:text-white/20 outline-none focus:border-gold transition-colors leading-relaxed"
                  />
                </div>

                {/* Couture Guarantees */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-white/5 font-sans text-[9px] text-white/60">
                  <div className="flex items-center gap-1.5">
                    <Truck size={12} className="text-gold shrink-0" />
                    <span>Insured White-Glove Courier</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={12} className="text-emerald-400 shrink-0" />
                    <span>Hand-Inspected Master Quality</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Sparkles size={12} className="text-gold shrink-0" />
                    <span>Complimentary Tailoring Fit</span>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-gold via-champagne to-gold text-[#050505] font-sans text-[9px] sm:text-[10px] tracking-[0.3em] uppercase font-semibold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(197,160,89,0.3)]"
                  >
                    {isSubmitting ? (
                      <span>RESERVING ATELIER COMMISSION...</span>
                    ) : (
                      <>
                        <Crown size={14} />
                        <span>CONFIRM & PLACE ORDER ({garmentPrice})</span>
                      </>
                    )}
                  </button>
                  <p className="font-sans text-[7.5px] text-center text-white/30 uppercase tracking-widest mt-2">
                    Orders are processed directly by our Parisian atelier directors with full tracking allocated upon dispatch.
                  </p>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

