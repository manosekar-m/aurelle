"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Sparkles, ArrowRight, Star, ShieldCheck, Eye } from "lucide-react";
import { collection, ChapterData } from "@/data/collection";
import { useLanguage } from "@/context/LanguageContext";
import LookDetailModal from "./LookDetailModal";

const FEATURED_LOOKS = [
  {
    id: "hero",
    label: "HERO EDITORIAL",
    title: "AFTER DARK",
    subtitle: "THE EDITORIAL ARCHIVE",
    silhouette: "Haute Couture Eveningwear",
    image: "/images/hero-image.jpg",
    accent: "#C5A059",
    chapterData: collection[0], // Prelude fallback
  },
  {
    id: "spotlight",
    label: "03 · SPOTLIGHT",
    title: "THE SPOTLIGHT",
    subtitle: "THE CLIMAX",
    silhouette: "Duchess Satin Column Gown with 1.2m Train",
    image: "/images/look-03.jpg",
    accent: "#14a862",
    chapterData: collection[2],
  },
  {
    id: "prelude",
    label: "01 · PRELUDE",
    title: "THE PRELUDE",
    subtitle: "THE ARRIVAL",
    silhouette: "Asymmetric Silk Satin & Velvet Midi",
    image: "/images/look-01.jpg",
    accent: "#C5A059",
    chapterData: collection[0],
  },
  {
    id: "flapper",
    label: "02 · FLAPPER",
    title: "THE FLAPPER",
    subtitle: "THE CELEBRATION",
    silhouette: "Art Deco Glass-Beaded Silk Fringe Shift",
    image: "/images/look-02.jpg",
    accent: "#F2E3C6",
    chapterData: collection[1],
  },
];

export default function Hero() {
  const [activeTab, setActiveTab] = useState(0);
  const [modalLook, setModalLook] = useState<ChapterData | null>(null);
  const { t } = useLanguage();

  const featuredLooks = [
    {
      id: "hero",
      label: t.hero.lookHero,
      title: t.hero.subTitle,
      subtitle: "THE EDITORIAL ARCHIVE",
      silhouette: "Haute Couture Eveningwear",
      image: "/images/hero-image.jpg",
      accent: "#C5A059",
      chapterData: collection[0],
    },
    {
      id: "spotlight",
      label: t.hero.lookSpotlight,
      title: "THE SPOTLIGHT",
      subtitle: "THE CLIMAX",
      silhouette: "Duchess Satin Column Gown with 1.2m Train",
      image: "/images/look-03.jpg",
      accent: "#14a862",
      chapterData: collection[2],
    },
    {
      id: "prelude",
      label: t.hero.lookPrelude,
      title: "THE PRELUDE",
      subtitle: "THE ARRIVAL",
      silhouette: "Asymmetric Silk Satin & Velvet Midi",
      image: "/images/look-01.jpg",
      accent: "#C5A059",
      chapterData: collection[0],
    },
    {
      id: "flapper",
      label: t.hero.lookFlapper,
      title: "THE FLAPPER",
      subtitle: "THE CELEBRATION",
      silhouette: "Art Deco Glass-Beaded Silk Fringe Shift",
      image: "/images/look-02.jpg",
      accent: "#F2E3C6",
      chapterData: collection[1],
    },
  ];

  const currentFeature = featuredLooks[activeTab] || featuredLooks[0];

  return (
    <>
      {/* Look Detail Modal when customer clicks explore */}
      <LookDetailModal look={modalLook} onClose={() => setModalLook(null)} />

      <section className="relative min-h-screen w-full bg-[#050505] overflow-hidden flex items-center pt-28 pb-16 md:py-32 px-6 md:px-12 lg:px-16 xl:px-24">
        {/* Subtle luxury ambient glow (static, solid, zero shaking) */}
        <div
          className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none opacity-20 blur-[140px] transition-colors duration-1000"
          style={{ background: currentFeature.accent }}
        />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full pointer-events-none opacity-10 blur-[120px] bg-gold" />

        {/* Delicate architectural vertical guides */}
        <div className="absolute inset-y-0 left-8 md:left-16 w-px bg-white/[0.04] pointer-events-none hidden sm:block" />
        <div className="absolute inset-y-0 right-8 md:right-16 w-px bg-white/[0.04] pointer-events-none hidden sm:block" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 xl:gap-14 items-center relative z-10">
          
          {/* ── LEFT COLUMN: BRAND STORY & CONVERSION ── */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-start text-left">
            
            {/* Atelier Heritage Tag */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-gold/30 bg-gold/5 backdrop-blur-md mb-6"
            >
              <Sparkles size={11} className="text-gold" />
              <span className="font-sans text-[8px] tracking-[0.35em] uppercase text-gold font-medium">
                {t.hero.heritageTag}
              </span>
            </motion.div>

            {/* Main Brand Title */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-6xl sm:text-7xl md:text-8xl xl:text-9xl leading-[0.9] tracking-[0.08em] text-ivory mb-2"
            >
              {t.hero.title}
            </motion.h1>

            {/* Sub-Brand Title */}
            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-[0.2em] uppercase text-gold/90 mb-6 font-light"
            >
              {t.hero.subTitle}
            </motion.h2>

            {/* Poetic Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="font-serif italic text-lg sm:text-xl text-ivory/90 mb-4 tracking-wide"
            >
              &ldquo;{t.hero.tagline}&rdquo;
            </motion.p>

            {/* Editorial Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              className="font-sans text-xs sm:text-sm text-ivory/60 leading-relaxed max-w-lg mb-8 font-light"
            >
              {t.hero.description}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto"
            >
              <a
                href="#collection"
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-gold text-[#050505] font-sans text-xs tracking-[0.3em] uppercase font-semibold transition-all duration-300 hover:bg-[#d8b56f] hover:shadow-[0_0_30px_rgba(197,160,89,0.4)]"
              >
                <span>{t.hero.ctaPrimary}</span>
                <ArrowRight size={14} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </a>

              <a
                href="#the-night"
                className="inline-flex items-center justify-center px-7 py-4 border border-gold/40 text-ivory/80 hover:text-white hover:border-gold font-sans text-xs tracking-[0.25em] uppercase transition-colors duration-300 bg-white/[0.02]"
              >
                {t.hero.ctaSecondary}
              </a>
            </motion.div>

            {/* Trust & Accolades Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="pt-6 border-t border-white/10 w-full grid grid-cols-3 gap-4"
            >
              <div>
                <p className="font-serif text-xl sm:text-2xl text-gold leading-none font-semibold mb-1">05</p>
                <p className="font-sans text-[8px] sm:text-[9px] tracking-[0.2em] uppercase text-ivory/50">
                  {t.hero.metricChapters}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Star size={13} className="fill-gold text-gold" />
                  <span className="font-serif text-lg sm:text-xl text-white font-semibold leading-none">4.9</span>
                </div>
                <p className="font-sans text-[8px] sm:text-[9px] tracking-[0.2em] uppercase text-ivory/50">
                  {t.hero.metricCritiques}
                </p>
              </div>

              <div>
                <p className="font-serif text-xl sm:text-2xl text-gold leading-none font-semibold mb-1">100%</p>
                <p className="font-sans text-[8px] sm:text-[9px] tracking-[0.2em] uppercase text-ivory/50">
                  {t.hero.metricFabrics}
                </p>
              </div>
            </motion.div>

          </div>

          {/* ── RIGHT COLUMN: SOLID, EYE-CATCHING EDITORIAL SHOWCASE (NOT A BACKGROUND!) ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 xl:col-span-6 flex flex-col items-center"
          >
            {/* The Solid Archival Showcase Card */}
            <div className="relative w-full max-w-[480px] p-2.5 sm:p-3 bg-[#0d0d0d] border border-gold/30 rounded-sm shadow-[0_25px_70px_rgba(0,0,0,0.9)] group">
              
              {/* Gold Corner Accents */}
              <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-gold pointer-events-none" />
              <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-gold pointer-events-none" />
              <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-gold pointer-events-none" />
              <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-gold pointer-events-none" />

              {/* Main Image Frame (Solid, Sharp, Absolutely No Shaking) */}
              <div className="relative w-full h-[460px] sm:h-[540px] xl:h-[580px] overflow-hidden bg-black/80 rounded-sm">
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentFeature.id}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={currentFeature.image}
                      alt={currentFeature.title}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 500px"
                      className="object-cover object-top transition-transform duration-1000 ease-out group-hover:scale-105"
                    />

                    {/* Subtle cinematic edge gradient for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60 pointer-events-none" />
                  </motion.div>
                </AnimatePresence>

                {/* Top Badge: Atelier Collection Tag */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-black/75 backdrop-blur-md border border-gold/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                  <span className="font-sans text-[8px] tracking-[0.25em] uppercase text-ivory/90 font-medium">
                    {currentFeature.subtitle}
                  </span>
                </div>

                {/* Bottom Overlay Card: Garment Info & Action */}
                <div className="absolute bottom-4 inset-x-4 z-20 p-4 bg-[#0a0a0a]/90 backdrop-blur-xl border border-gold/30 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-sans text-[8px] tracking-[0.3em] uppercase text-gold">
                      {currentFeature.label}
                    </p>
                    <h4 className="font-serif text-lg sm:text-xl text-ivory tracking-wide truncate">
                      {currentFeature.title}
                    </h4>
                    <p className="font-sans text-[9px] text-ivory/60 truncate font-light">
                      {currentFeature.silhouette}
                    </p>
                  </div>

                  <button
                    onClick={() => setModalLook(currentFeature.chapterData)}
                    className="px-4 py-2.5 bg-gold text-[#050505] font-sans text-[8px] tracking-[0.25em] uppercase font-semibold shrink-0 transition-all hover:bg-white hover:scale-105 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye size={12} />
                    <span>{t.hero.exploreLook}</span>
                  </button>
                </div>

              </div>

              {/* Look Switcher Pills: Instant interactive look previews */}
              <div className="mt-3 grid grid-cols-4 gap-1.5">
                {featuredLooks.map((item, idx) => {
                  const isActive = activeTab === idx;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(idx)}
                      className="py-2 px-1 text-center font-sans text-[7px] sm:text-[8px] tracking-[0.15em] uppercase transition-all duration-300 border truncate"
                      style={{
                        borderColor: isActive ? "var(--color-gold, #C5A059)" : "rgba(255,255,255,0.08)",
                        background: isActive ? "rgba(197, 160, 89, 0.15)" : "rgba(255,255,255,0.02)",
                        color: isActive ? "#FDFBF7" : "rgba(255,255,255,0.45)",
                        fontWeight: isActive ? 600 : 400,
                      }}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>

            </div>

          </motion.div>

        </div>
      </section>
    </>
  );
}
