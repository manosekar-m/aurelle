"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import Magnetic from "./Magnetic";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const navLinks = [
    { name: "COLLECTION", href: "#collection" },
    { name: "THE NIGHT", href: "#the-night" },
    { name: "ABOUT", href: "#about" },
    { name: "CONTACT", href: "#contact" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 1 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out ${
          isScrolled
            ? "py-4 bg-onyx/40 backdrop-blur-2xl border-b border-gold/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
            : "py-8 bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="group inline-block" data-cursor="enter">
            <h1 className="font-serif text-2xl md:text-3xl tracking-widest text-ivory group-hover:text-gold transition-colors duration-500">
              AURELLE
            </h1>
          </Link>

          <nav className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <Magnetic key={link.name}>
                <Link
                  href={link.href}
                  className="font-sans text-xs tracking-[0.2em] text-ivory/80 hover:text-gold relative overflow-hidden group py-2"
                >
                  <span className="relative z-10">{link.name}</span>
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gold origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100" />
                </Link>
              </Magnetic>
            ))}
          </nav>

          <button
            className="md:hidden flex flex-col gap-1.5 p-2 z-50 relative"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            <span
              className={`w-6 h-[1px] bg-ivory transition-transform duration-500 ${
                isMobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""
              }`}
            />
            <span
              className={`w-6 h-[1px] bg-ivory transition-opacity duration-500 ${
                isMobileMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`w-6 h-[1px] bg-ivory transition-transform duration-500 ${
                isMobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""
              }`}
            />
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={isMobileMenuOpen ? "open" : "closed"}
        variants={{
          open: { opacity: 1, pointerEvents: "auto" },
          closed: { opacity: 0, pointerEvents: "none" },
        }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-40 bg-onyx flex items-center justify-center"
      >
        <div className="flex flex-col items-center gap-10">
          {navLinks.map((link, i) => (
            <motion.div
              key={link.name}
              variants={{
                open: { opacity: 1, y: 0, transition: { delay: 0.1 * i + 0.3, duration: 0.7 } },
                closed: { opacity: 0, y: 20 },
              }}
            >
              <Link
                href={link.href}
                className="font-serif text-3xl tracking-widest text-ivory hover:text-gold transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
