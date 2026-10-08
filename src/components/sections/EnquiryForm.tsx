"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lookTitle: string;
  lookSubtitle: string;
  accent: string;
}

const ENQUIRY_TYPES = [
  "Sizing & Fit Consultation",
  "Custom Alteration Request",
  "Rental / Styling Enquiry",
  "Wholesale / Bulk Order",
  "Press & Media",
  "General Question",
];

export default function EnquiryForm({ isOpen, onClose, lookTitle, lookSubtitle, accent }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    enquiryType: "",
    detail: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.mobile.match(/^[0-9]{10}$/)) e.mobile = "Enter a valid 10-digit mobile number";
    if (!form.enquiryType) e.enquiryType = "Please select an enquiry type";
    if (!form.detail.trim() || form.detail.trim().length < 20) e.detail = "Please provide at least 20 characters";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setForm({ name: "", mobile: "", enquiryType: "", detail: "" });
    setErrors({});
    onClose();
  };

  const inputBase =
    "w-full bg-transparent border-b py-3 font-sans text-sm text-white/80 placeholder:text-white/25 tracking-wider outline-none transition-all duration-300 focus:placeholder:text-white/10";
  const labelBase = "block font-sans text-[8px] tracking-[0.4em] uppercase mb-2";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="enquiry-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-8"
          style={{ background: "rgba(5,5,5,0.85)", backdropFilter: "blur(24px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.97 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg bg-[#0a0a0a] border flex flex-col overflow-hidden"
            style={{ borderColor: `${accent}30`, maxHeight: "90vh" }}
          >
            {/* Accent top bar */}
            <div className="h-[2px] w-full shrink-0" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />

            {/* Header */}
            <div className="shrink-0 px-8 pt-8 pb-6 border-b" style={{ borderColor: `${accent}20` }}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-sans text-[8px] tracking-[0.5em] uppercase" style={{ color: accent }}>
                  REQUEST AN ENQUIRY
                </span>
                <button onClick={handleClose} aria-label="Close enquiry form"
                  className="group w-7 h-7 flex items-center justify-center relative">
                  <span className="absolute w-5 h-px bg-white/40 group-hover:bg-white rotate-45 transition-colors" />
                  <span className="absolute w-5 h-px bg-white/40 group-hover:bg-white -rotate-45 transition-colors" />
                </button>
              </div>
              <p className="font-serif text-xl text-white tracking-wider">{lookTitle}</p>
              <p className="font-sans text-[9px] tracking-[0.3em] text-white/30 uppercase mt-0.5">{lookSubtitle}</p>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-8 py-8" style={{ scrollbarWidth: "none" }}>
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-7"
                    noValidate
                  >
                    {/* Name */}
                    <div>
                      <label className={labelBase} style={{ color: `${accent}cc` }}>
                        Full Name <span style={{ color: accent }}>*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Your full name"
                        value={form.name}
                        onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: "" }); }}
                        className={inputBase}
                        style={{ borderColor: errors.name ? "#ef4444" : `${accent}40` }}
                      />
                      {errors.name && (
                        <p className="font-sans text-[9px] text-red-400 tracking-widest mt-1">{errors.name}</p>
                      )}
                    </div>

                    {/* Mobile */}
                    <div>
                      <label className={labelBase} style={{ color: `${accent}cc` }}>
                        Mobile Number <span style={{ color: accent }}>*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={form.mobile}
                        maxLength={10}
                        onChange={(e) => { setForm({ ...form, mobile: e.target.value.replace(/\D/g, "") }); setErrors({ ...errors, mobile: "" }); }}
                        className={inputBase}
                        style={{ borderColor: errors.mobile ? "#ef4444" : `${accent}40` }}
                      />
                      {errors.mobile && (
                        <p className="font-sans text-[9px] text-red-400 tracking-widest mt-1">{errors.mobile}</p>
                      )}
                    </div>

                    {/* Enquiry Type */}
                    <div>
                      <label className={labelBase} style={{ color: `${accent}cc` }}>
                        Type of Enquiry <span style={{ color: accent }}>*</span>
                      </label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {ENQUIRY_TYPES.map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => { setForm({ ...form, enquiryType: type }); setErrors({ ...errors, enquiryType: "" }); }}
                            className="font-sans text-[8px] tracking-[0.2em] uppercase px-3 py-2 border transition-all duration-300"
                            style={{
                              borderColor: form.enquiryType === type ? accent : `${accent}30`,
                              color: form.enquiryType === type ? "#0a0a0a" : `${accent}80`,
                              background: form.enquiryType === type ? accent : "transparent",
                            }}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                      {errors.enquiryType && (
                        <p className="font-sans text-[9px] text-red-400 tracking-widest mt-2">{errors.enquiryType}</p>
                      )}
                    </div>

                    {/* Detail */}
                    <div>
                      <label className={labelBase} style={{ color: `${accent}cc` }}>
                        Tell Us More <span style={{ color: accent }}>*</span>
                      </label>
                      <textarea
                        placeholder="Describe your enquiry in detail — measurements, occasion, timeline, special requests…"
                        rows={5}
                        value={form.detail}
                        onChange={(e) => { setForm({ ...form, detail: e.target.value }); setErrors({ ...errors, detail: "" }); }}
                        className={`${inputBase} resize-none border-b-0 border p-3`}
                        style={{ borderColor: errors.detail ? "#ef4444" : `${accent}25` }}
                      />
                      <div className="flex justify-between items-center mt-1">
                        {errors.detail
                          ? <p className="font-sans text-[9px] text-red-400 tracking-widest">{errors.detail}</p>
                          : <span />
                        }
                        <span className="font-sans text-[8px] tracking-widest" style={{ color: `${accent}50` }}>
                          {form.detail.length} chars
                        </span>
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      className="w-full py-5 font-sans text-[9px] tracking-[0.4em] uppercase text-[#050505] transition-opacity duration-300 hover:opacity-80 mt-2"
                      style={{ background: accent }}
                    >
                      SUBMIT ENQUIRY
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center justify-center text-center py-16 gap-6"
                  >
                    {/* Gold circle checkmark */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                      className="w-16 h-16 rounded-full border-2 flex items-center justify-center"
                      style={{ borderColor: accent }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12l5 5L19 7" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </motion.div>

                    <div>
                      <p className="font-serif text-2xl text-white tracking-widest mb-2">Thank You</p>
                      <p className="font-sans text-xs text-white/40 tracking-[0.2em] leading-relaxed max-w-xs">
                        Your enquiry for <span style={{ color: accent }}>{lookTitle}</span> has been received.
                        Our atelier team will reach out within 24 hours.
                      </p>
                    </div>

                    <button
                      onClick={handleClose}
                      className="font-sans text-[9px] tracking-[0.4em] uppercase px-10 py-4 border transition-colors hover:bg-white/5 mt-4"
                      style={{ borderColor: `${accent}50`, color: accent }}
                    >
                      CLOSE
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
