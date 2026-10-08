"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChapterData } from "@/data/collection";
import EnquiryForm from "./EnquiryForm";

interface Props {
  look: ChapterData | null;
  onClose: () => void;
}

const accentMap: Record<string, string> = {
  prelude: "#C5A059",
  flapper: "#F2E3C6",
  spotlight: "#14a862",
  afterglow: "#FDFBF7",
  "midnight-rebel": "#8B1A24",
};

// ── Per-chapter 360° frame sequences ─────────────────────────────────────────
// Each chapter folder: /360/<id>/frame_0.jpg … frame_270.jpg
// "prelude" uses the already-generated black sequin gown set.
// Other folders get their own images once quota allows; until then they use
// dedicated single-image folders so the viewer still looks chapter-correct.
const CHAPTER_FRAMES: Record<string, string[]> = {
  // 01 · THE PRELUDE — Asymmetric one-shoulder black satin & velvet cocktail midi
  prelude: [
    "/360/prelude/frame_0.jpg",
    "/360/prelude/frame_45.jpg",
    "/360/prelude/frame_90.jpg",
    "/360/prelude/frame_135.jpg",
    "/360/prelude/frame_180.jpg",
    "/360/prelude/frame_270.jpg",
  ],
  // 02 · THE FLAPPER — 1920s Art Deco champagne/gold beaded fringe shift dress
  flapper: [
    "/360/flapper/frame_0.jpg",
    "/360/flapper/frame_45.jpg",
    "/360/flapper/frame_90.jpg",
    "/360/flapper/frame_135.jpg",
    "/360/flapper/frame_180.jpg",
    "/360/flapper/frame_270.jpg",
  ],
  // 03 · THE SPOTLIGHT — Deep emerald green one-shoulder floor gown
  spotlight: [
    "/360/spotlight/frame_0.jpg",
    "/360/spotlight/frame_45.jpg",
    "/360/spotlight/frame_90.jpg",
    "/360/spotlight/frame_135.jpg",
    "/360/spotlight/frame_180.jpg",
    "/360/spotlight/frame_270.jpg",
  ],
  // 04 · THE AFTERGLOW — Metallic silver liquid-lamé jumpsuit
  afterglow: [
    "/360/afterglow/frame_0.jpg",
    "/360/afterglow/frame_45.jpg",
    "/360/afterglow/frame_90.jpg",
    "/360/afterglow/frame_135.jpg",
    "/360/afterglow/frame_180.jpg",
    "/360/afterglow/frame_270.jpg",
  ],
  // 05 · MIDNIGHT REBEL — Asymmetric black + burgundy velvet mini with sheer mesh
  "midnight-rebel": [
    "/360/midnight-rebel/frame_0.jpg",
    "/360/midnight-rebel/frame_45.jpg",
    "/360/midnight-rebel/frame_90.jpg",
    "/360/midnight-rebel/frame_135.jpg",
    "/360/midnight-rebel/frame_180.jpg",
    "/360/midnight-rebel/frame_270.jpg",
  ],
};

// ── 360° Viewer ──────────────────────────────────────────────────────────────
function Viewer360({ look, accent }: { look: ChapterData; accent: string }) {
  // Pick this chapter's frame array (falls back to empty → graceful)
  const frames = CHAPTER_FRAMES[look.id] ?? [];
  const totalFrames = frames.length || 1;

  const viewerRef    = useRef<HTMLDivElement>(null);
  const angleRef     = useRef(0);          // accumulated drag angle (degrees)
  const autoRotate   = useRef(true);
  const lastX        = useRef(0);
  const [frameIdx,   setFrameIdx]   = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [displayAngle, setDisplayAngle] = useState(0);  // for the progress ring

  // Derive frame index from accumulated angle
  const angleToFrame = (angle: number) => {
    const normalised = ((angle % 360) + 360) % 360;
    return Math.round((normalised / 360) * totalFrames) % totalFrames;
  };

  // Preload all frames for this chapter
  useEffect(() => {
    frames.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [look.id]);

  // Reset angle when chapter changes
  useEffect(() => {
    angleRef.current = 0;
    setFrameIdx(0);
    setDisplayAngle(0);
    autoRotate.current = true;
  }, [look.id]);

  // Auto-rotate when idle
  useEffect(() => {
    let raf: number;
    const tick = () => {
      if (autoRotate.current) {
        angleRef.current = (angleRef.current + 0.3) % 360;
        setFrameIdx(angleToFrame(angleRef.current));
        setDisplayAngle(((angleRef.current % 360) + 360) % 360);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [look.id]);

  // Drag handlers
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    autoRotate.current = false;
    setIsDragging(true);
    lastX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastX.current;
    angleRef.current = (angleRef.current + dx * 0.6 + 360) % 360;
    lastX.current = e.clientX;
    setFrameIdx(angleToFrame(angleRef.current));
    setDisplayAngle(angleRef.current);
  }, [isDragging]);

  const onPointerUp = useCallback(() => {
    setIsDragging(false);
    setTimeout(() => { autoRotate.current = true; }, 2500);
  }, []);

  // Light direction sweeps with angle
  const lightAngle = displayAngle * 1.2;

  // Derive subtle tilt from angle so single-image fallbacks still feel interactive
  const tiltY = Math.sin((displayAngle / 360) * Math.PI * 2) * 15; // rotateY
  const shiftX = Math.sin((displayAngle / 360) * Math.PI * 2) * -5; // translateX

  return (
    <div className="relative w-full h-full select-none overflow-hidden" style={{ perspective: "1000px" }}>

      {/* ── Frame stack: all frames stacked, active one fades in ── */}
      <motion.div
        ref={viewerRef}
        className="absolute inset-0"
        style={{ cursor: isDragging ? "grabbing" : "grab", transformStyle: "preserve-3d" }}
        animate={{ rotateY: tiltY, x: `${shiftX}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {frames.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 transition-opacity duration-150"
            style={{ opacity: i === frameIdx ? 1 : 0 }}
          >
            <Image
              src={src}
              alt={`${look.title} — ${i * Math.round(360 / totalFrames)}°`}
              fill
              sizes="55vw"
              className="object-cover object-top"
              draggable={false}
              priority={i === 0}
            />
          </div>
        ))}

        {/* Cinematic letterbox top/bottom */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(to bottom, #050505 0%, transparent 14%, transparent 82%, #050505 100%)",
          }}
        />

        {/* Dynamic light sweep that tracks rotation */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: `linear-gradient(${lightAngle}deg, transparent 30%, ${accent}10 50%, transparent 70%)`,
            transition: "background 0.1s",
          }}
        />

        {/* Accent glow vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: `radial-gradient(ellipse at 40% 50%, ${accent}20 0%, transparent 60%)`,
          }}
        />

        {/* Drag hint */}
        <AnimatePresence>
          {!isDragging && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-2"
              style={{ transform: "translateZ(30px)" }}
            >
              {/* Animated drag arrows */}
              <div className="flex items-center gap-3">
                <motion.span
                  animate={{ x: [-4, 0, -4] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                  className="text-white/30 text-xs"
                >
                  ←
                </motion.span>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-px" style={{ background: accent }} />
                  <span className="font-sans text-[8px] tracking-[0.35em] text-white/40 uppercase">
                    Drag to rotate
                  </span>
                  <div className="w-5 h-px" style={{ background: accent }} />
                </div>
                <motion.span
                  animate={{ x: [4, 0, 4] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                  className="text-white/30 text-xs"
                >
                  →
                </motion.span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Rotation progress ring ── */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 pointer-events-none">
        {/* Circular SVG ring */}
        <svg width="56" height="56" viewBox="0 0 56 56" className="opacity-70">
          <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
          <circle
            cx="28" cy="28" r="22"
            fill="none"
            stroke={accent}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 22}`}
            strokeDashoffset={`${2 * Math.PI * 22 * (1 - displayAngle / 360)}`}
            transform="rotate(-90 28 28)"
            style={{ filter: `drop-shadow(0 0 4px ${accent})`, transition: "stroke-dashoffset 0.1s" }}
          />
          <text
            x="28" y="32"
            textAnchor="middle"
            fill="rgba(255,255,255,0.5)"
            fontSize="8"
            fontFamily="inherit"
            letterSpacing="0.05em"
          >
            {Math.round(displayAngle)}°
          </text>
        </svg>
        <span className="font-sans text-[7px] tracking-[0.4em] text-white/25 uppercase">360° View</span>
      </div>
    </div>
  );
}

// ── Main Modal ────────────────────────────────────────────────────────────────
export default function LookDetailModal({ look, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<"design" | "details" | "care">("design");
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = look ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [look]);

  const accent = look ? (accentMap[look.id] ?? "#C5A059") : "#C5A059";

  return (
    <AnimatePresence>
      {look && (
        <motion.div
          key="look-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] bg-[#050505]/60 backdrop-blur-3xl flex flex-col md:flex-row overflow-hidden"
        >
          {/* ── LEFT: 360° Viewer ─────────────────── */}
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full md:w-[55%] h-[50vh] md:h-full cursor-grab active:cursor-grabbing"
            style={{ borderRight: `1px solid ${accent}22` }}
          >
            <Viewer360 look={look} accent={accent} />

            {/* Chapter watermark */}
            <div
              className="absolute top-8 left-8 font-serif leading-none pointer-events-none select-none z-10"
              style={{
                fontSize: "clamp(4rem,8vw,7rem)",
                color: "transparent",
                WebkitTextStroke: `1px ${accent}55`,
              }}
            >
              {look.index}
            </div>

            {/* 360 badge */}
            <div
              className="absolute top-8 right-8 z-10 flex items-center justify-center w-14 h-14 rounded-full border"
              style={{ borderColor: `${accent}60`, background: `${accent}15` }}
            >
              <span className="font-sans text-[8px] tracking-widest text-center leading-tight"
                style={{ color: accent }}>
                360°<br />VIEW
              </span>
            </div>
          </motion.div>

          {/* ── RIGHT: Detail Panel ───────────────── */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
            className="relative w-full md:w-[45%] h-[50vh] md:h-full flex flex-col overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-30 flex items-center gap-2 group"
              aria-label="Close"
            >
              <span className="font-sans text-[8px] tracking-[0.3em] text-white/40 group-hover:text-white/80 transition-colors">
                CLOSE
              </span>
              <div className="relative w-7 h-7 flex items-center justify-center">
                <span className="absolute w-5 h-px bg-white/40 group-hover:bg-white rotate-45 transition-colors" />
                <span className="absolute w-5 h-px bg-white/40 group-hover:bg-white -rotate-45 transition-colors" />
              </div>
            </button>

            {/* Header */}
            <div className="shrink-0 px-8 md:px-12 pt-8 pb-6 border-b"
              style={{ borderColor: `${accent}25` }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="font-sans text-[8px] tracking-[0.5em]" style={{ color: accent }}>
                  {look.index}
                </span>
                <div className="w-8 h-px" style={{ background: `${accent}80` }} />
                <span className="font-sans text-[8px] tracking-[0.4em] text-white/40 uppercase">
                  {look.subtitle}
                </span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl text-white tracking-wider mb-2">
                {look.title}
              </h2>
              <p className="font-sans text-[10px] tracking-[0.25em] text-white/40 uppercase">
                {look.personality}
              </p>
            </div>

            {/* Tab bar */}
            <div className="shrink-0 flex border-b" style={{ borderColor: `${accent}25` }}>
              {(["design", "details", "care"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="flex-1 py-4 font-sans text-[8px] tracking-[0.35em] uppercase transition-all duration-300 relative"
                  style={{
                    color: activeTab === tab ? accent : "rgba(255,255,255,0.35)",
                  }}
                >
                  {tab === "design" ? "DESIGN" : tab === "details" ? "DETAILS" : "CARE"}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="tab-underline"
                      className="absolute bottom-0 left-0 right-0 h-px"
                      style={{ background: accent }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-8 md:px-12 py-8 scrollbar-thin"
              style={{ scrollbarColor: `${accent}30 transparent` }}>

              <AnimatePresence mode="wait">
                {/* ── DESIGN TAB ── */}
                {activeTab === "design" && (
                  <motion.div
                    key="design"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                  >
                    <p className="font-sans text-sm text-white/60 leading-relaxed mb-10 max-w-sm">
                      {look.description}
                    </p>

                    <h4 className="font-sans text-[8px] tracking-[0.4em] uppercase mb-5"
                      style={{ color: accent }}>
                      DESIGN ELEMENTS
                    </h4>
                    <div className="flex flex-col gap-3 mb-10">
                      {look.designElements.map((el, i) => (
                        <motion.div
                          key={el}
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: i * 0.07 }}
                          className="flex items-start gap-4"
                        >
                          <div className="mt-[6px] w-4 h-px shrink-0"
                            style={{ background: accent }} />
                          <span className="font-sans text-sm text-white/75 leading-snug">
                            {el}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    <h4 className="font-sans text-[8px] tracking-[0.4em] uppercase mb-5"
                      style={{ color: accent }}>
                      SIGNATURE FEATURES
                    </h4>
                    <div className="flex flex-col gap-3 mb-10">
                      {look.details.features.map((f, i) => (
                        <motion.div
                          key={f}
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.3 + i * 0.07 }}
                          className="flex items-start gap-4 pl-4 border-l"
                          style={{ borderColor: `${accent}40` }}
                        >
                          <span className="font-sans text-sm text-white/60 leading-snug">{f}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Materials chips */}
                    <h4 className="font-sans text-[8px] tracking-[0.4em] uppercase mb-5"
                      style={{ color: accent }}>
                      MATERIALS
                    </h4>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {look.materials.map((m) => (
                        <span
                          key={m}
                          className="font-sans text-[8px] tracking-[0.25em] uppercase px-3 py-2 border"
                          style={{ borderColor: `${accent}50`, color: accent }}
                        >
                          {m}
                        </span>
                      ))}
                    </div>

                    {/* Fabric composition */}
                    <div className="p-4 border" style={{ borderColor: `${accent}25` }}>
                      <p className="font-sans text-[8px] tracking-[0.3em] uppercase mb-2"
                        style={{ color: accent }}>
                        FABRIC COMPOSITION
                      </p>
                      <p className="font-sans text-xs text-white/50 leading-relaxed">
                        {look.details.fabricComposition}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* ── DETAILS TAB ── */}
                {activeTab === "details" && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                  >
                    {[
                      { label: "SILHOUETTE", value: look.details.silhouette },
                      { label: "LENGTH", value: look.details.length },
                      { label: "NECKLINE", value: look.details.neckline },
                      { label: "CLOSURE", value: look.details.closure },
                      { label: "FIT", value: look.details.fit },
                      { label: "OCCASION", value: look.details.occasion },
                      { label: "SIZING", value: look.details.sizing },
                    ].map(({ label, value }, i) => (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.06 }}
                        className="flex flex-col gap-1.5 py-5 border-b"
                        style={{ borderColor: `${accent}18` }}
                      >
                        <span className="font-sans text-[7px] tracking-[0.45em] uppercase"
                          style={{ color: `${accent}90` }}>
                          {label}
                        </span>
                        <span className="font-sans text-sm text-white/75 leading-relaxed">
                          {value}
                        </span>
                      </motion.div>
                    ))}

                    {/* Color palette swatches */}
                    <div className="mt-8">
                      <p className="font-sans text-[8px] tracking-[0.4em] uppercase mb-5"
                        style={{ color: accent }}>
                        COLOUR PALETTE
                      </p>
                      <div className="flex gap-3 flex-wrap">
                        {look.colors.map((c) => (
                          <span
                            key={c}
                            className="font-sans text-[8px] tracking-[0.2em] uppercase px-4 py-2 border text-white/60"
                            style={{ borderColor: `${accent}35` }}
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── CARE TAB ── */}
                {activeTab === "care" && (
                  <motion.div
                    key="care"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                  >
                    <p className="font-sans text-xs text-white/40 tracking-widest uppercase mb-10">
                      AURELLE garments are crafted with exceptional care. Treat them accordingly.
                    </p>
                    {look.details.care.map((instruction, i) => (
                      <motion.div
                        key={instruction}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.08 }}
                        className="flex items-start gap-5 py-5 border-b"
                        style={{ borderColor: `${accent}18` }}
                      >
                        <span
                          className="font-serif text-xl shrink-0 leading-none mt-0.5"
                          style={{ color: accent }}
                        >
                          {i + 1}.
                        </span>
                        <span className="font-sans text-sm text-white/70 leading-relaxed">
                          {instruction}
                        </span>
                      </motion.div>
                    ))}

                    <div
                      className="mt-10 p-6 border"
                      style={{ borderColor: `${accent}30`, background: `${accent}08` }}
                    >
                      <p className="font-sans text-[8px] tracking-[0.4em] uppercase mb-3"
                        style={{ color: accent }}>
                        AURELLE PROMISE
                      </p>
                      <p className="font-sans text-xs text-white/50 leading-relaxed">
                        Every garment is hand-finished and quality-checked before leaving our atelier.
                        Should any issue arise, our team will restore your piece to its original condition.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer CTA */}
            <div className="shrink-0 px-8 md:px-12 py-6 border-t flex gap-4"
              style={{ borderColor: `${accent}25` }}>
              <button
                className="flex-1 py-4 font-sans text-[9px] tracking-[0.3em] uppercase text-[#050505] transition-opacity hover:opacity-80"
                style={{ background: accent }}
                data-cursor="enter"
              >
                ADD TO WISHLIST
              </button>
              <button
                onClick={() => setEnquiryOpen(true)}
                className="flex-1 py-4 font-sans text-[9px] tracking-[0.3em] uppercase border transition-colors hover:bg-white/5"
                style={{ borderColor: `${accent}60`, color: accent }}
                data-cursor="enter"
              >
                REQUEST ENQUIRY
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Enquiry Form — rendered outside the look panel so it overlays everything */}
      <EnquiryForm
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        lookTitle={look?.title ?? ""}
        lookSubtitle={look?.subtitle ?? ""}
        accent={accent}
      />
    </AnimatePresence>
  );
}
