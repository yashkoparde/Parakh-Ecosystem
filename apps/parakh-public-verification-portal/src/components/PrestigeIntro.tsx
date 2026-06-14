/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion } from 'motion/react';

interface PrestigeIntroProps {
  onComplete: () => void;
}

export default function PrestigeIntro({ onComplete }: PrestigeIntroProps) {
  useEffect(() => {
    // Beautiful automatic transition into the official portal after high-fidelity text reveals
    const timer = setTimeout(() => {
      onComplete();
    }, 4200); // 4.2 seconds matches perfect visual pace of cinematic keyframe curves

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      key="hbo-prestige-intro"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(8px)' }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 bg-[#090A0F] z-50 flex flex-col justify-center items-center px-6 select-none overflow-hidden"
    >
      {/* Absolute dark canvas ambient light */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.015)_0%,rgba(0,0,0,0)_80%)] pointer-events-none" />
      {/* Centerpiece Group with Cinematic Animation Classes */}
      <div className="flex flex-col items-center justify-center text-center animate-hbo-glow">
        
        {/* Title phrase aligned perfectly */}
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-semibold font-sans tracking-[0.25em] h-12 uppercase animate-hbo-text">
          Parakh
        </h1>

        {/* High-contrast division line */}
        <div className="h-[1px] bg-[#1E293B] mt-5 mb-5 mx-auto animate-hbo-line" style={{ width: '80%', maxWidth: '300px' }} />

        {/* Subtitle phrase */}
        <div className="text-[11px] sm:text-xs font-sans tracking-[0.4em] text-[#94A3B8] uppercase font-light animate-hbo-subtitle">
          Verification Portal
        </div>

      </div>
    </motion.div>
  );
}

