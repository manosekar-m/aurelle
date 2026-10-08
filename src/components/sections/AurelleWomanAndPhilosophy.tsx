"use client";

import { motion } from "framer-motion";
import { brandPhilosophy } from "@/data/collection";

export default function AurelleWomanAndPhilosophy() {
  return (
    <>
      {/* The Aurelle Woman Section */}
      <section id="about" className="py-40 bg-onyx px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
            className="font-sans text-xs tracking-[0.5em] text-gold uppercase mb-16"
          >
            THE AURELLE WOMAN
          </motion.h2>

          <div className="flex flex-col gap-8 mb-24">
            {["CONFIDENT.", "INDEPENDENT.", "MAGNETIC."].map((word, i) => (
              <motion.div
                key={word}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, delay: i * 0.3, ease: "easeOut" }}
                className="font-serif text-5xl md:text-7xl text-ivory tracking-widest"
              >
                {word}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="max-w-2xl mx-auto space-y-8 text-ivory/60 font-sans text-sm md:text-base leading-relaxed tracking-wider uppercase"
          >
            <p>She owns her style, her presence and her night.</p>
            <p>She is not defined by one aesthetic. She changes with the moment.</p>
            <p>She chooses statement over sameness.</p>
            <p>She wears confidence as her strongest accessory.</p>
          </motion.div>
        </div>
      </section>

      {/* Brand Philosophy Section */}
      <section className="py-40 bg-onyx-dark px-6 border-t border-gold/5">
        <div className="container mx-auto max-w-5xl text-center">
          <motion.h3 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="font-serif text-4xl md:text-6xl text-ivory italic leading-tight mb-32"
          >
            “Luxury is not excess. <br className="hidden md:block"/> It is intention.”
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-6">
            {brandPhilosophy.map((principle, i) => (
              <motion.div
                key={principle}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: i * 0.15, ease: "easeOut" }}
                className="flex flex-col items-center"
              >
                <div className="w-px h-12 bg-gold/30 mb-6" />
                <h4 className="font-sans text-[10px] tracking-[0.2em] text-ivory/80 uppercase max-w-[150px] leading-relaxed">
                  {principle}
                </h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
