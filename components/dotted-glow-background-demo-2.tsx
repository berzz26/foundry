import React from "react";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";

export default function DottedGlowBackgroundDemoSecond() {
  return (
    <div className="relative mx-auto flex min-h-[70vh] w-full flex-col items-center justify-center overflow-hidden bg-[#F9FAFB] dark:bg-neutral-950">
      
      {/* Subtle Dotted Background */}
      <DottedGlowBackground
        className="absolute inset-0 pointer-events-none"
        opacity={0.4} 
        gap={16} 
        radius={1.2}
        colorLightVar="--color-neutral-300"
        glowColorLightVar="--color-neutral-200"
        colorDarkVar="--color-neutral-800"
        glowColorDarkVar="--color-neutral-900"
        backgroundOpacity={0}
        speedMin={0.3}
        speedMax={1}
        speedScale={1}
        style={{
           maskImage: 'radial-gradient(circle at center, white 20%, transparent 80%)',
           WebkitMaskImage: 'radial-gradient(circle at center, white 20%, transparent 80%)'
        }}
      />

      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center justify-center space-y-8 px-8 py-20 text-center">
        
        {/* Optional matching badge */}
        <div className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50/50 px-4 py-1.5 text-xs font-medium text-[#1C7A70] backdrop-blur-sm dark:border-teal-900 dark:bg-teal-950/50 dark:text-teal-300">
          <span className="mr-1.5 text-base leading-none">⚡</span> Premium React Components
        </div>

        <div className="space-y-6">
          <h2 className="text-center text-5xl font-medium tracking-tight text-[#111827] sm:text-6xl md:text-7xl dark:text-neutral-100">
            Ready to buy <br />
            <span className="font-serif italic text-[#1C7A70] dark:text-[#259c90]">Aceternity Pro</span>?
          </h2>
          <p className="mx-auto max-w-xl text-center text-lg text-neutral-500 dark:text-neutral-400">
            Unlock premium components, advanced animations, and exclusive
            templates to build stunning modern interfaces.
          </p>
        </div>

        <div className="flex flex-col gap-4 pt-6 sm:flex-row items-center justify-center">
          <button className="inline-flex items-center justify-center rounded-full bg-[#0F172A] px-8 py-3.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-slate-800 hover:-translate-y-0.5 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200">
            View Pricing <span className="ml-2">→</span>
          </button>
          <button className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white/50 px-8 py-3.5 text-sm font-medium text-neutral-700 shadow-sm backdrop-blur-md transition-all duration-200 hover:bg-white hover:-translate-y-0.5 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-200 dark:hover:bg-neutral-800">
            Explore Components
          </button>
        </div>
        
      </div>
    </div>
  );
}