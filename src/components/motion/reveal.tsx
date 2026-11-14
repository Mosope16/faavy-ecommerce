"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LUXURY_EASE_SLOW } from "./motion-variants";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export function Reveal({
  children,
  className = "",
  delay = 0,
  duration = 0.75,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{
          duration,
          delay,
          ease: LUXURY_EASE_SLOW,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
