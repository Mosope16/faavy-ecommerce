import { type Variants } from "framer-motion";

/**
 * FAAVY Luxury Editorial Motion System
 * Refined cubic-bezier easing curves inspired by high-fashion editorial digital experiences.
 */

export const LUXURY_EASE = [0.22, 1, 0.36, 1] as const; // Gentle, confident decelerate
export const LUXURY_EASE_SLOW = [0.16, 1, 0.3, 1] as const; // Editorial reveal decelerate
export const SNAPPY_EASE = [0.25, 0.1, 0.25, 1.0] as const; // Micro-interactions

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: LUXURY_EASE,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.25,
      ease: LUXURY_EASE,
    },
  },
};

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: LUXURY_EASE,
    },
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: {
      duration: 0.3,
      ease: LUXURY_EASE,
    },
  },
};

export const heroTextVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: LUXURY_EASE_SLOW,
    },
  },
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

export const staggeredChildVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: LUXURY_EASE,
    },
  },
};

export const imageRevealVariants: Variants = {
  hidden: { opacity: 0, scale: 1.04 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.85,
      ease: LUXURY_EASE_SLOW,
    },
  },
};

export const cardHoverVariants: Variants = {
  rest: { y: 0, transition: { duration: 0.35, ease: LUXURY_EASE } },
  hover: { y: -4, transition: { duration: 0.35, ease: LUXURY_EASE } },
};

export const drawerVariants: Variants = {
  closed: {
    x: "100%",
    transition: {
      type: "spring",
      stiffness: 350,
      damping: 35,
    },
  },
  open: {
    x: 0,
    transition: {
      type: "spring",
      stiffness: 350,
      damping: 35,
    },
  },
};

export const modalVariants: Variants = {
  closed: {
    opacity: 0,
    scale: 0.96,
    transition: {
      duration: 0.2,
      ease: LUXURY_EASE,
    },
  },
  open: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: LUXURY_EASE,
    },
  },
};
