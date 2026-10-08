"use client";

import { materialsList } from "@/data/collection";
import { motion } from "framer-motion";

export default function MaterialShowcase() {
  return (
    <section className="py-32 bg-onyx px-6 overflow-hidden">
      <div className="container mx-auto">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="font-serif text-3xl md:text-5xl text-ivory tracking-widest mb-6"
          >
            THE VOCABULARY OF THE NIGHT
          </motion.h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
            className="w-24 h-[1px] bg-gold mx-auto"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 max-w-6xl mx-auto">
          {materialsList.map((material, i) => (
            <motion.div
              key={material.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
              className="group relative flex flex-col items-center p-8 border border-gold/10 hover:border-gold/30 transition-colors duration-500 bg-onyx-dark/50"
            >
              {/* Simulated subtle material reflection */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-ivory/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[2s] ease-in-out" />
              </div>
              
              <h4 className="font-serif text-xl md:text-2xl text-ivory mb-4 tracking-widest text-center">
                {material.name}
              </h4>
              <p className="font-sans text-[9px] md:text-[10px] tracking-[0.3em] text-gold/80 uppercase text-center">
                {material.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
