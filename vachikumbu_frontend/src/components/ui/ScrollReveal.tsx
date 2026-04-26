import { motion, useInView } from "framer-motion";
import { useRef, ReactNode, forwardRef } from "react";

type AnimationType = "fade-up" | "fade-left" | "fade-right" | "scale" | "fade";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  animation?: AnimationType;
  duration?: number;
}

const getVariants = (type: AnimationType) => {
  switch (type) {
    case "fade-up":
      return { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } };
    case "fade-left":
      return { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } };
    case "fade-right":
      return { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } };
    case "scale":
      return { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } };
    case "fade":
      return { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  }
};

export const ScrollReveal = forwardRef<HTMLDivElement, ScrollRevealProps>(
  ({ children, delay = 0, className = "", animation = "fade-up", duration = 0.7 }, _forwardedRef) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-60px" });
    const variants = getVariants(animation);

    return (
      <motion.div
        ref={ref}
        variants={variants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }
);

ScrollReveal.displayName = "ScrollReveal";
