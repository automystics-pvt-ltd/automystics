import React from "react";

export function DiagonalDivider({ className = "", direction = "right", fill = "fill-white", flip = false }: { className?: string, direction?: "left" | "right", fill?: string, flip?: boolean }) {
  return (
    <div className={`absolute left-0 right-0 w-full overflow-hidden leading-none z-10 ${className}`} style={{ transform: flip ? 'rotate(180deg)' : 'none' }}>
      <svg
        className="relative block w-[calc(100%+1.3px)] h-[80px] md:h-[120px]"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        {direction === "right" ? (
          <path d="M1200 120L0 16.48V0h1200v120z" className={fill} />
        ) : (
          <path d="M0 120L1200 16.48V0H0v120z" className={fill} />
        )}
      </svg>
    </div>
  );
}

export function WaveDivider({ className = "", fill = "fill-white", flip = false }: { className?: string, fill?: string, flip?: boolean }) {
  return (
    <div className={`absolute left-0 right-0 w-full overflow-hidden leading-none z-10 ${className}`} style={{ transform: flip ? 'rotate(180deg)' : 'none' }}>
      <svg 
        className="relative block w-[calc(100%+1.3px)] h-[60px] md:h-[100px]" 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none"
      >
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className={fill}></path>
      </svg>
    </div>
  );
}
