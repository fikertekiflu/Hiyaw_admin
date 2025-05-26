// src/components/icons/HiyawLogo.tsx
import Link from 'next/link';
import React from 'react';

export const HiyawLogo = ({ className, size = "default" }: { className?: string, size?: "default" | "small" }) => {
  const textSize = size === "small" ? "text-xl" : "text-2xl";
  const subTextSize = size === "small" ? "text-[10px]" : "text-xs";

  return (
    <Link href="/dashboard" className={`inline-block group ${className}`}>
      <div 
        className={`font-brand-accent ${textSize} font-extrabold leading-none tracking-tight text-primary group-hover:text-primary/80 transition-colors`}
      >
        HIYAW
      </div>
      <span 
        className={`block ${subTextSize} font-sans text-sidebar-foreground group-hover:text-sidebar-foreground/80 transition-colors -mt-0.5 tracking-wide`}
      >
        ANIMATION
      </span>
    </Link>
  );
};