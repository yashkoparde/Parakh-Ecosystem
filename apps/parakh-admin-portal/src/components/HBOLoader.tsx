/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

export default function HBOLoader({ onComplete }: { onComplete: () => void }) {
  const [shouldExit, setShouldExit] = useState(false);

  useEffect(() => {
    // Elegant timing coordination matching the cinematic CSS durations
    const timerExit = setTimeout(() => {
      setShouldExit(true);
    }, 3800); // Wait for animations to complete and settle

    const timerComplete = setTimeout(() => {
      onComplete();
    }, 4600); // Then trigger complete callback post-fadeout transition

    return () => {
      clearTimeout(timerExit);
      clearTimeout(timerComplete);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: shouldExit ? 0 : 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center z-50 overflow-hidden font-sans select-none"
    >
      <div className="relative flex flex-col items-center justify-center animate-hbo-glow">
        {/* Cinematic subtle dark background grain/texture overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

        {/* Main Title: PARAKH with cinematic text letter-spacing expansions */}
        <div className="overflow-hidden py-2">
          <h1 className="text-4xl md:text-6xl font-light tracking-[0.25em] text-white font-sans uppercase relative select-none animate-hbo-text">
            PARAKH
          </h1>
        </div>

        {/* Secondary subtitle "ADMIN PORTAL" */}
        <div className="mt-5 flex items-center gap-4 animate-hbo-subtitle">
          <div className="h-[1px] w-5 bg-slate-800" />
          <span className="text-xs font-mono font-medium text-slate-450 text-slate-400">
            ADMIN PORTAL
          </span>
          <div className="h-[1px] w-5 bg-slate-800" />
        </div>

        {/* Horizontal precise separation line */}
        <div className="mt-8 h-[1px] bg-gradient-to-r from-transparent via-slate-500 to-transparent animate-hbo-line" />
      </div>

      {/* Footer system status log line */}
      <div className="absolute bottom-12 font-mono text-[9px] text-slate-600 tracking-[0.25em] uppercase opacity-50">
        System Core Boot Session Initiated • Compliant
      </div>
    </motion.div>
  );
}
