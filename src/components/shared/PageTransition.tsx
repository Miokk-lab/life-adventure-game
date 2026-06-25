import { motion } from 'motion/react';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export default function PageTransition({ children, className = '' }: Props) {
  return (
    <motion.div
      className={`min-h-screen ${className}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
