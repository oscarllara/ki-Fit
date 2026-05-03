"use client";

import React from 'react';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ className = "", showTagline = true, size = 'md' }: LogoProps) => {
  const sizes = {
    sm: { ki: "text-4xl", body: "text-[10px]", tagline: "text-[8px]" },
    md: { ki: "text-6xl", body: "text-sm", tagline: "text-[10px]" },
    lg: { ki: "text-8xl", body: "text-xl", tagline: "text-[12px]" }
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative flex flex-col items-center">
        {/* Ki Stylized */}
        <div className="flex items-center gap-1 italic">
          <span className={`${currentSize.ki} font-black text-primary -skew-x-12 tracking-tighter`}>K</span>
          <div className="flex flex-col items-center -ml-2">
            <div className="w-3 h-3 md:w-4 md:h-4 bg-primary rounded-full mb-1" />
            <div className={`${currentSize.ki} font-black text-white -skew-x-12 leading-[0.8]`}>i</div>
          </div>
        </div>
        
        {/* BODY FIT */}
        <div className={`${currentSize.body} font-black tracking-[0.4em] text-white italic uppercase -mt-2`}>
          BODY <span className="text-primary">FIT</span>
        </div>

        {showTagline && (
          <div className="mt-6 flex flex-col items-center w-full max-w-[300px]">
            <div className="flex items-center gap-4 w-full mb-2">
              <div className="h-[1px] flex-1 bg-white/20" />
              {/* EKG Line */}
              <svg width="32" height="16" viewBox="0 0 24 12" className="text-primary fill-none stroke-current stroke-[3]">
                <path d="M0 6h4l1.5-4 2 8 2-4h2l1.5-4 2 8 2-4h5" />
              </svg>
              <div className="h-[1px] flex-1 bg-white/20" />
            </div>
            <p className={`${currentSize.tagline} font-black tracking-[0.2em] text-white uppercase whitespace-nowrap`}>
              TREINE. <span className="text-primary">SUPERE.</span> EVOLUA.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logo;