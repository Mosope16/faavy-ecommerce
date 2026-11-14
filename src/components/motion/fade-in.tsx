"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { fadeInVariants, slideUpVariants } from "./motion-variants";

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "none";
}

export function FadeIn({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: FadeInProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const baseVariants = direction === "up" ? slideUpVariants : fadeInVariants;

  return (
    <motion.div
      variants={baseVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
