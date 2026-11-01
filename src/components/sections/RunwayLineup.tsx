"use client";

import { useState } from "react";
import { collection, ChapterData } from "@/data/collection";
import Image from "next/image";
import { motion } from "framer-motion";
import LookDetailModal from "./LookDetailModal";

const accentMap: Record<string, string> = {
  prelude:          "rgba(197,160,89,0.6)",
  flapper:          "rgba(242,227,198,0.5)",
  spotlight:        "rgba(2,71,38,0.8)",
  afterglow:        "rgba(253,251,247,0.4)",
  "midnight-rebel": "rgba(91,14,22,0.9)",
};

export default function RunwayLineup() {
  const [activeLook, setActiveLook] = useState<ChapterData | null>(null);

  return (
    <>
      <LookDetailModal look={activeLook} onClose={() => setActiveLook(null)} />

      <section className="py-32 bg-[#050505] px-6 overflow-hidden">
        <div className="container mx-auto max-w-8xl">

          {/* Header */}
          <div className="text-center mb-24">
            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.5em" }}
              whileInView={{ opacity: 1, letterSpacing: "0.4em" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.5 }}
              className="font-sans text-[9px] tracking-[0.5em] text-gold uppercase mb-6"
            >
              The Complete Collection
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-4xl md:text-6xl text-ivory tracking-widest mb-8"
            >
              FROM ARRIVAL TO THE LAST DANCE.
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.8, delay: 0.4, ease: "easeInOut" }}
              className="w-32 h-px bg-gold mx-auto origin-center"
            />
          </div>

          {/* Runway Grid — staggered heights for editorial feel */}
          <div className="flex flex-col md:flex-row items-end justify-center gap-3 md:gap-2">
            {collection.map((look, i) => {
              // Alternate tall / shorter to create runway stagger
              const heightClass = [
                "h-[72vh]",
                "h-[60vh]",
                "h-[78vh]",  // Spotlight — tallest (hero)
                "h-[65vh]",
                "h-[68vh]",
              ][i];

              const accentColor = accentMap[look.id];

              return (
                <motion.div
                  key={look.id}
                  onClick={() => setActiveLook(look)}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 1, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative flex-1 min-w-[140px] max-w-[280px] overflow-hidden cursor-pointer"
                  style={{ height: undefined }}
                >
                  <div className={`relative w-full overflow-hidden ${heightClass}`}>

                    {/* Image */}
                    <Image
                      src={look.imagePrimary}
                      alt={look.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 20vw"
                      className="object-cover object-top grayscale transition-all duration-1000 ease-out group-hover:grayscale-0 group-hover:scale-105"
                    />

                    {/* Default dark overlay */}
                    <div className="absolute inset-0 bg-onyx/40 transition-opacity duration-700 group-hover:opacity-0" />

                    {/* Accent colour bloom on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700"
                      style={{
                        background: `radial-gradient(ellipse at 50% 80%, ${accentColor} 0%, transparent 70%)`,
                        mixBlendMode: "color",
                      }}
                    />

                    {/* Top & bottom cinematic bars */}
                    <div className="absolute inset-0 pointer-events-none"
                      style={{ background: "linear-gradient(to bottom, #050505 0%, transparent 20%, transparent 75%, #050505 100%)" }}
                    />

                    {/* Thin accent border that grows on hover */}
                    <div
                      className="absolute inset-0 border opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ borderColor: accentColor }}
                    />

                    {/* Chapter hover label */}
                    <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20 px-3 text-center">
                      <p className="font-sans text-[8px] tracking-[0.4em] uppercase mb-1.5" style={{ color: accentColor }}>
                        {look.subtitle}
                      </p>
                      <h4 className="font-serif text-lg text-ivory tracking-widest mb-2">
                        {look.title}
                      </h4>

                      {/* Stars & rating pill */}
                      <div className="flex items-center gap-1.5 mb-3">
                        <span className="text-[10px]" style={{ color: accentColor }}>★★★★★</span>
                        <span className="font-sans text-[8px] tracking-wider text-ivory/80 font-medium">
                          {look.rating.toFixed(1)}
                        </span>
                        <span className="font-sans text-[7px] tracking-wider text-ivory/50">
                          ({look.reviews.length})
                        </span>
                      </div>

                      {/* Explore Look pill */}
                      <span
                        className="font-sans text-[7px] tracking-[0.3em] uppercase px-3 py-1.5 border transition-all duration-300 group-hover:bg-white/10"
                        style={{ borderColor: accentColor, color: accentColor }}
                      >
                        EXPLORE LOOK →
                      </span>
                    </div>

                    {/* Default chapter number watermark */}
                    <div
                      className="absolute top-4 left-4 font-serif text-5xl leading-none pointer-events-none z-10 transition-opacity duration-500 group-hover:opacity-0"
                      style={{
                        color: "transparent",
                        WebkitTextStroke: `1px ${accentColor}`,
                        opacity: 0.35,
                      }}
                    >
                      {look.index}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Sequence labels below */}
          <div className="hidden md:flex justify-center gap-2 mt-10">
            {collection.map((look, i) => (
              <div key={look.id} className="flex-1 max-w-[280px] flex items-center justify-center gap-3 min-w-[140px]">
                {i > 0 && <div className="flex-1 h-px bg-gold/20" />}
                <span className="font-sans text-[8px] tracking-[0.3em] text-ivory/30 uppercase whitespace-nowrap">
                  {look.subtitle}
                </span>
                {i < collection.length - 1 && <div className="flex-1 h-px bg-gold/20" />}
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
