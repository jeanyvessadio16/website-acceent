import React from 'react';

export default function Loading() {
  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-center px-4 bg-background">
      <div className="relative flex flex-col items-center justify-center">
        {/* Animated loader */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Subtle background ring */}
          <div className="absolute inset-0 border-4 border-primary/10 rounded-full"></div>
          {/* Spinning gradient ring */}
          <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent border-r-transparent animate-spin duration-1000"></div>
          {/* Inner pulse */}
          <div className="w-3 h-3 bg-primary rounded-full animate-ping"></div>
        </div>
        
        {/* Text */}
        <div className="mt-8 flex flex-col items-center space-y-2 opacity-90 text-center">
          <h3 className="text-xl font-bold text-primary tracking-[0.2em] uppercase">ACCEENT</h3>
          <div className="flex items-center gap-1.5 h-6">
            <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        </div>
      </div>
    </div>
  );
}
