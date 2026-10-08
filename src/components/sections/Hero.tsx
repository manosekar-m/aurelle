"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import Image from "next/image";
import HeroFabric from "./HeroFabric";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  
  // Custom particle effect using basic divs
  const particles = Array.from({ length: 30 });

  return (
    <section 
      ref={containerRef} 
      className="relative h-screen w-full overflow-hidden bg-onyx flex items-center justify-center"
    >
      {/* Background Image with Parallax & WebGL Fabric */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 z-0"
      >
        <HeroFabric />
        {/* Vignette Overlay */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-onyx/50 to-onyx pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-onyx via-transparent to-transparent pointer-events-none" />
      </motion.div>

      {/* Drifting Particles */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-50">
        {particles.map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gold/40"
            style={{
              width: Math.random() * 3 + 1 + "px",
              height: Math.random() * 3 + 1 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
            }}
            animate={{
              y: [0, -100 - Math.random() * 100],
              x: [0, (Math.random() - 0.5) * 50],
              opacity: [0, Math.random() * 0.8, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center mt-20">
        <div className="overflow-hidden mb-2">
          <motion.h1 
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.5, delay: 2, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-6xl md:text-8xl lg:text-[10rem] leading-none tracking-widest text-ivory"
          >
            AURELLE
          </motion.h1>
        </div>
        
        <div className="overflow-hidden mb-8">
          <motion.h2 
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.5, delay: 2.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-3xl md:text-5xl lg:text-7xl tracking-[0.1em] text-ivory/90"
          >
            AFTER DARK
          </motion.h2>
        </div>

        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 2.6, ease: "easeOut" }}
          className="font-sans text-sm md:text-base tracking-[0.3em] uppercase text-gold mb-16"
        >
          Dress the Moment. Own the Night.
        </motion.p>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 2.8, ease: "easeOut" }}
          className="font-sans text-xs tracking-[0.2em] uppercase text-ivory/60 mb-12"
        >
          One Night. Five Personalities.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 3.2, ease: "easeOut" }}
          className="flex flex-col items-center gap-6"
        >
          <a href="#collection" data-cursor="enter" className="group relative inline-flex items-center justify-center">
            <span className="font-sans text-xs tracking-[0.3em] text-onyx bg-gold px-10 py-4 transition-transform duration-500 group-hover:scale-105">
              ENTER THE NIGHT
            </span>
          </a>
          <a href="#about" className="group flex flex-col items-center gap-2">
            <span className="font-sans text-[10px] tracking-[0.2em] text-ivory/50 group-hover:text-ivory transition-colors duration-500">
              EXPLORE THE COLLECTION
            </span>
            <span className="w-[1px] h-10 bg-gradient-to-b from-ivory/50 to-transparent group-hover:h-16 transition-all duration-500" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
