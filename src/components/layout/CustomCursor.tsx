"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [hoverText, setHoverText] = useState("");
  const cursorRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { damping: 25, stiffness: 150, mass: 0.5 });
  const smoothY = useSpring(mouseY, { damping: 25, stiffness: 150, mass: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      const isInteractive = target.closest("a, button, [role='button']");
      const isLook = target.closest("[data-cursor='explore']");
      const isCTA = target.closest("[data-cursor='enter']");

      if (isCTA) {
        setIsHovering(true);
        setHoverText("ENTER");
      } else if (isLook) {
        setIsHovering(true);
        setHoverText("EXPLORE");
      } else if (isInteractive) {
        setIsHovering(true);
        setHoverText("");
      } else {
        setIsHovering(false);
        setHoverText("");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[500] flex items-center justify-center mix-blend-difference hidden md:flex"
      style={{
        x: smoothX,
        y: smoothY,
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      <motion.div
        animate={{
          width: isHovering ? (hoverText ? 80 : 40) : 10,
          height: isHovering ? (hoverText ? 80 : 40) : 10,
          backgroundColor: isHovering && !hoverText ? "transparent" : "#FDFBF7",
          border: isHovering && !hoverText ? "1px solid #FDFBF7" : "none",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="rounded-full flex items-center justify-center text-[10px] font-sans font-medium tracking-widest text-onyx shadow-[0_0_15px_rgba(253,251,247,0.2)]"
      >
        <motion.span
          animate={{ opacity: hoverText ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {hoverText}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
