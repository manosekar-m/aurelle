"use client";

import { motion } from "framer-motion";

export default function FinalCTA() {
  return (
    <section className="relative h-screen bg-onyx flex flex-col items-center justify-center overflow-hidden">
      {/* Absolute black background that fades in on scroll */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ margin: "0px", amount: 0.8 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-black z-0"
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="font-serif text-3xl md:text-5xl lg:text-7xl tracking-widest text-ivory/50">
            THE NIGHT <span className="text-ivory">REMEMBERS.</span>
          </h2>
        </motion.div>

        <div className="flex flex-col items-center gap-4 mb-20">
          <motion.h1
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 2, delay: 1 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-[0.2em] text-ivory"
          >
            AURELLE
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 2, delay: 1.5 }}
            className="font-sans text-xs tracking-[0.5em] uppercase text-gold"
          >
            After Dark
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, delay: 2 }}
          className="flex flex-col items-center gap-6"
        >
          <a href="#" className="group relative inline-flex items-center justify-center">
            <span className="font-sans text-xs tracking-[0.3em] text-onyx bg-ivory hover:bg-gold px-12 py-5 transition-colors duration-500">
              DISCOVER THE COLLECTION
            </span>
          </a>
          
          <div className="flex flex-col items-center gap-3 mt-8">
            <span className="w-px h-12 bg-gold/50" />
            <a href="#" className="font-sans text-[10px] tracking-[0.3em] text-ivory/50 hover:text-gold transition-colors duration-500">
              FOLLOW THE NIGHT
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
