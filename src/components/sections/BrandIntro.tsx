"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function BrandIntro() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "end 20%"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  const words = ["GLAMOUR.", "CONFIDENCE.", "MOVEMENT.", "INDIVIDUALITY."];

  return (
    <section 
      ref={sectionRef} 
      className="relative min-h-screen bg-onyx flex flex-col items-center justify-center py-32 px-6"
    >
      {/* Scroll Transition Line */}
      <motion.div 
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gold/50 origin-center"
      />

      <motion.div style={{ y, opacity }} className="max-w-4xl mx-auto text-center">
        <h3 className="font-serif text-3xl md:text-5xl lg:text-6xl text-ivory leading-tight mb-16">
          A WARDROBE FOR THE MOMENT THAT DESERVES TO BE <span className="italic text-gold">REMEMBERED.</span>
        </h3>
        
        <p className="font-sans text-sm md:text-base text-ivory/70 tracking-widest leading-loose max-w-2xl mx-auto mb-32">
          AURELLE IS A CONTEMPORARY LUXURY PARTY-WEAR BRAND CELEBRATING GLAMOUR, CONFIDENCE, MOVEMENT AND INDIVIDUALITY.
        </p>

        <div className="flex flex-col gap-12 md:gap-24">
          {words.map((word, i) => (
            <div key={word} className="overflow-hidden">
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-[0.1em] text-transparent bg-clip-text bg-[url('/images/hero-image.jpg')] bg-cover bg-center bg-no-repeat bg-fixed opacity-90"
              >
                {word}
              </motion.div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
