'use client';

import { motion } from 'framer-motion';

export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Top left blob */}
      <motion.div
        className="absolute top-[-15%] left-[-10%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-[var(--teal)] blur-[120px]"
        initial={{ opacity: 0.03, x: 0, y: 0, scale: 1 }}
        animate={{
          x: ['0%', '15%', '-5%', '0%'],
          y: ['0%', '10%', '-15%', '0%'],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      {/* Bottom right blob */}
      <motion.div
        className="absolute bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] rounded-full bg-[var(--teal)] blur-[140px]"
        initial={{ opacity: 0.04, x: 0, y: 0, scale: 1 }}
        animate={{
          x: ['0%', '-20%', '10%', '0%'],
          y: ['0%', '-15%', '5%', '0%'],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Middle floating blob */}
      <motion.div
        className="absolute top-[30%] left-[40%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] rounded-full bg-[var(--teal)] blur-[100px]"
        initial={{ opacity: 0.02, x: 0, y: 0 }}
        animate={{
          x: ['0%', '-30%', '20%', '0%'],
          y: ['0%', '30%', '-20%', '0%'],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}
