"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer id="contact" className="bg-onyx-dark text-ivory/60 py-20 px-6 md:px-12 border-t border-gold/10">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
        <div className="flex flex-col gap-2">
          <Link href="/" className="group inline-block">
            <h2 className="font-serif text-3xl tracking-widest text-ivory group-hover:text-gold transition-colors duration-500">
              AURELLE
            </h2>
          </Link>
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold/80 mb-4">
            After Dark
          </p>
          <a href="mailto:inquiries@aurelle.com" className="font-sans text-[10px] tracking-widest uppercase text-ivory/50 hover:text-gold transition-colors">
            inquiries@aurelle.com
          </a>
        </div>

        <nav className="flex flex-wrap gap-8 md:gap-12">
          {["COLLECTION", "THE NIGHT", "ABOUT", "CONTACT"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              className="font-sans text-xs tracking-[0.2em] hover:text-ivory transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-6 font-sans text-[10px] tracking-widest uppercase">
          <a href="#" className="hover:text-gold transition-colors">
            Instagram
          </a>
          <a href="#" className="hover:text-gold transition-colors">
            Twitter
          </a>
          <a href="#" className="hover:text-gold transition-colors">
            Facebook
          </a>
        </div>
      </div>
      
      <div className="container mx-auto mt-20 pt-8 border-t border-ivory/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] tracking-widest uppercase font-sans">
        <p>&copy; {new Date().getFullYear()} AURELLE. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="#" className="hover:text-ivory transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-ivory transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
