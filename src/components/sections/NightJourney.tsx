"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { collection, ChapterData } from "@/data/collection";
import Image from "next/image";
import LookDetailModal from "@/components/sections/LookDetailModal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Per-chapter accent colours mapped as Tailwind-safe inline styles
const accentMap: Record<string, { glow: string; border: string }> = {
  prelude:         { glow: "rgba(197,160,89,0.18)",  border: "rgba(197,160,89,0.45)" },
  flapper:         { glow: "rgba(242,227,198,0.15)", border: "rgba(242,227,198,0.35)" },
  spotlight:       { glow: "rgba(2,71,38,0.30)",     border: "rgba(2,71,38,0.60)"   },
  afterglow:       { glow: "rgba(253,251,247,0.12)", border: "rgba(253,251,247,0.30)" },
  "midnight-rebel":{ glow: "rgba(91,14,22,0.35)",    border: "rgba(91,14,22,0.65)"  },
};

export default function NightJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeLook, setActiveLook] = useState<ChapterData | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const sections = gsap.utils.toArray<HTMLElement>(".chapter-section");
    const container = containerRef.current;
    const totalSections = sections.length; // 5

    /* ── Lenis compatibility: expose ScrollTrigger's update to Lenis ── */
    const lenisHandler = (e: Event) => ScrollTrigger.update();
    window.addEventListener("lenis-scroll", lenisHandler);

    /* ── Horizontal pin ── */
    // We need to travel (totalSections - 1) full viewport widths
    const scrollDistance = () => container.offsetWidth * (totalSections - 1);

    const scrollTween = gsap.to(sections, {
      xPercent: -100 * (totalSections - 1),
      ease: "none",
      scrollTrigger: {
        trigger: container,
        pin: true,
        anticipatePin: 1,
        scrub: 1.2,
        snap: {
          snapTo: 1 / (totalSections - 1),
          duration: { min: 0.5, max: 1 },
          ease: "power2.inOut",
          delay: 0.05,
        },
        start: "top top",
        end: () => `+=${scrollDistance()}`,
        invalidateOnRefresh: true,
      },
    });

    /* ── Per-chapter animations ── */
    sections.forEach((section) => {
      const img        = section.querySelector<HTMLElement>(".chapter-img-wrap");
      const textBlock  = section.querySelector<HTMLElement>(".chapter-text");
      const lightBeam  = section.querySelector<HTMLElement>(".chapter-beam");
      const indexLabel = section.querySelector<HTMLElement>(".chapter-index");

      // Image scale on entry
      if (img) {
        gsap.fromTo(img,
          { scale: 1.15, filter: "brightness(0.5)" },
          {
            scale: 1,
            filter: "brightness(1)",
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              containerAnimation: scrollTween,
              start: "left 80%",
              end: "left 10%",
              scrub: 1.5,
            },
          }
        );
      }

      // Light beam sweep
      if (lightBeam) {
        gsap.fromTo(lightBeam,
          { x: "-120%", opacity: 0 },
          {
            x: "120%",
            opacity: 0.5,
            ease: "sine.inOut",
            scrollTrigger: {
              trigger: section,
              containerAnimation: scrollTween,
              start: "left 60%",
              end: "right 40%",
              scrub: 2,
            },
          }
        );
      }

      // Text rise
      if (textBlock) {
        gsap.fromTo(textBlock,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              containerAnimation: scrollTween,
              start: "left 65%",
              end: "left 20%",
              scrub: 1,
            },
          }
        );
      }

      // Index number flicker-in
      if (indexLabel) {
        gsap.fromTo(indexLabel,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            ease: "expo.out",
            scrollTrigger: {
              trigger: section,
              containerAnimation: scrollTween,
              start: "left 75%",
              end: "left 35%",
              scrub: 1,
            },
          }
        );
      }
    });

    return () => {
      window.removeEventListener("lenis-scroll", lenisHandler);
      scrollTween.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <>
      <LookDetailModal look={activeLook} onClose={() => setActiveLook(null)} />

      <section id="the-night" className="bg-onyx relative z-10 pointer-events-auto">

      {/* ── Teaser copy ── */}
      <div className="h-screen flex flex-col items-center justify-center text-center px-6 pointer-events-none">
        {["ONE NIGHT.", "FIVE PERSONALITIES.", "FIVE CHAPTERS.", "ONE HOUSE LANGUAGE."].map((line, i) => (
          <motion.h2
            key={line}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.2, delay: i * 0.18, ease: [0.16, 1, 0.3, 1] }}
            className={`font-serif text-4xl md:text-6xl lg:text-7xl leading-tight tracking-widest ${i % 2 === 0 ? "text-ivory" : "text-gold"}`}
          >
            {line}
          </motion.h2>
        ))}
      </div>

      {/* ── Horizontal Chapters ── */}
      <div id="collection" ref={containerRef} className="h-screen overflow-hidden bg-[#050505]">
        <div className="flex h-full w-[500vw]">

          {collection.map((chapter) => {
            const accent = accentMap[chapter.id] ?? accentMap["prelude"];
            return (
              <div
                key={chapter.id}
                className="chapter-section relative h-full w-screen flex overflow-hidden"
              >
                {/* ── Full-bleed image (left 60 %) ── */}
                <div className="relative w-[58%] h-full overflow-hidden shrink-0">

                  {/* Scrim: top & bottom cinematic letterbox */}
                  <div className="absolute inset-0 z-10 pointer-events-none"
                    style={{
                      background: "linear-gradient(to bottom, #050505 0%, transparent 14%, transparent 82%, #050505 100%)"
                    }}
                  />

                  {/* Scrim: right-edge fade into text panel */}
                  <div className="absolute inset-0 z-10 pointer-events-none"
                    style={{
                      background: "linear-gradient(to right, transparent 55%, #050505 100%)"
                    }}
                  />

                  {/* Accent glow vignette */}
                  <div className="absolute inset-0 z-10 pointer-events-none rounded-none"
                    style={{
                      background: `radial-gradient(ellipse at 30% 50%, ${accent.glow} 0%, transparent 65%)`
                    }}
                  />

                  {/* Animated light beam sweep */}
                  <div
                    className="chapter-beam absolute inset-y-0 w-[35%] z-20 pointer-events-none"
                    style={{
                      background: "linear-gradient(to right, transparent, rgba(253,251,247,0.06), transparent)",
                      top: 0,
                    }}
                  />

                  {/* The image itself */}
                  <div className="chapter-img-wrap absolute inset-0">
                    <Image
                      src={chapter.imagePrimary}
                      alt={chapter.title}
                      fill
                      sizes="60vw"
                      className="object-cover object-top"
                      priority={chapter.index === "01"}
                    />
                  </div>

                  {/* Thin gold border along the right edge */}
                  <div
                    className="absolute right-0 top-[8%] bottom-[8%] w-px z-20"
                    style={{ background: `linear-gradient(to bottom, transparent, ${accent.border}, transparent)` }}
                  />

                  {/* Giant chapter index — watermark style */}
                  <div
                    className="chapter-index absolute bottom-10 left-8 z-20 font-serif leading-none select-none pointer-events-none"
                    style={{
                      fontSize: "clamp(5rem,10vw,10rem)",
                      color: "transparent",
                      WebkitTextStroke: `1px ${accent.border}`,
                      opacity: 0.6,
                    }}
                  >
                    {chapter.index}
                  </div>
                </div>

                {/* ── Text panel (right 42 %) ── */}
                <div className="chapter-text relative w-[42%] h-full flex flex-col justify-center pl-10 pr-12 xl:pl-16 xl:pr-20 shrink-0 z-30 pointer-events-auto">

                  {/* Subtle vertical rule */}
                  <div
                    className="absolute left-0 top-[12%] bottom-[12%] w-px"
                    style={{ background: `linear-gradient(to bottom, transparent, ${accent.border}, transparent)` }}
                  />

                  {/* Chapter label */}
                  <div className="flex items-center gap-4 mb-8">
                    <span
                      className="font-sans text-[9px] tracking-[0.5em] uppercase"
                      style={{ color: accent.border }}
                    >
                      {chapter.index}
                    </span>
                    <span className="w-10 h-px" style={{ background: accent.border }} />
                    <span className="font-sans text-[9px] tracking-[0.35em] uppercase text-ivory/50">
                      {chapter.subtitle}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-4xl md:text-5xl xl:text-6xl text-ivory leading-none tracking-tight mb-5">
                    {chapter.title}
                  </h3>

                  {/* Sub-headline */}
                  {chapter.subHeadline && (
                    <h4
                      className="font-serif text-xl md:text-2xl italic mb-5"
                      style={{ color: accent.border }}
                    >
                      {chapter.subHeadline}
                    </h4>
                  )}

                  {/* Main headline */}
                  <h4 className="font-serif text-xl md:text-2xl text-ivory/80 mb-6">
                    {chapter.headline}
                  </h4>

                  {/* Personality tag */}
                  <p className="font-sans text-[10px] tracking-[0.25em] text-ivory/40 uppercase mb-8 leading-loose">
                    {chapter.personality}
                  </p>

                  {/* Description */}
                  <p className="font-sans text-sm text-ivory/60 max-w-xs leading-relaxed mb-12 border-l-2 pl-4"
                    style={{ borderColor: accent.border }}>
                    {chapter.description}
                  </p>

                  {/* Materials */}
                  <div className="flex flex-wrap gap-2 mb-12">
                    {chapter.materials.map((mat) => (
                      <span
                        key={mat}
                        className="font-sans text-[8px] tracking-[0.3em] uppercase px-3 py-1 border"
                        style={{ borderColor: accent.border, color: accent.border }}
                      >
                        {mat}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => setActiveLook(chapter)}
                    data-cursor="explore"
                    className="group flex items-center gap-4 w-fit"
                  >
                    <span
                      className="font-sans text-[9px] tracking-[0.3em] uppercase transition-colors duration-500"
                      style={{ color: accent.border }}
                    >
                      EXPLORE LOOK
                    </span>
                    <span
                      className="h-px w-8 transition-all duration-500 group-hover:w-16"
                      style={{ background: accent.border }}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
    </>
  );
}
