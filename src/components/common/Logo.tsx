import React, { useState } from 'react';
import { ShieldAlert } from 'lucide-react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'auto';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'auto',
  size = 'md',
  showSubtitle = true,
}) => {
  const [imageError, setImageError] = useState(false);

  // Sizing definitions
  const heights = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const isLight = variant === 'light';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {!imageError ? (
        <img
          src="/off-logo.jpeg"
          alt="EV Cyber Academy Official Logo"
          className={`${heights[size]} w-auto object-contain rounded-md shadow-sm border border-slate-200/50`}
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-600 text-white font-black text-xl shadow-md">
          <ShieldAlert className="w-6 h-6 text-white" />
        </div>
      )}

      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-black tracking-tight ${textSizes[size]} ${
              isLight ? 'text-white' : 'text-slate-900'
            }`}
          >
            EV
          </span>
          <span
            className={`font-black tracking-tight ${textSizes[size]} text-red-600`}
          >
            CYBER
          </span>
          <span
            className={`font-bold tracking-tight ${textSizes[size]} ${
              isLight ? 'text-slate-200' : 'text-slate-800'
            }`}
          >
            ACADEMY
          </span>
        </div>
        {showSubtitle && (
          <span
            className={`text-[10px] tracking-widest font-black uppercase ${
              isLight ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Private Limited
          </span>
        )}
      </div>
    </div>
  );
};

