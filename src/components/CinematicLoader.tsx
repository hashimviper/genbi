import { useState, useEffect } from 'react';
import { VisoryBILogo } from './VisoryBILogo';

interface CinematicLoaderProps {
  onComplete: () => void;
}

export function CinematicLoader({ onComplete }: CinematicLoaderProps) {
  const [phase, setPhase] = useState<'logo' | 'text' | 'fadeout'>('logo');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('text'), 800);
    const t2 = setTimeout(() => setPhase('fadeout'), 2200);
    const t3 = setTimeout(() => onComplete(), 2800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-opacity duration-600 ${
        phase === 'fadeout' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary/10"
            style={{
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `cinematic-particle ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Light sweep */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
          style={{
            animation: 'cinematic-sweep 2.5s ease-in-out infinite',
          }}
        />
      </div>

      {/* Logo */}
      <div
        className={`relative transition-all duration-700 ${
          phase === 'logo' ? 'scale-75 opacity-0' : 'scale-100 opacity-100'
        }`}
        style={{
          animation: phase !== 'fadeout' ? 'cinematic-logo-pulse 2s ease-in-out infinite' : 'none',
        }}
      >
        <div className="relative">
          <div className="absolute -inset-8 rounded-full bg-primary/10 blur-2xl animate-pulse" />
          <VisoryBILogo size={96} />
        </div>
      </div>

      {/* Text */}
      <div
        className={`mt-8 text-center transition-all duration-500 ${
          phase === 'text' || phase === 'fadeout'
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4'
        }`}
      >
        <h1 className="text-4xl font-bold tracking-tight">
          <span className="gradient-text">VisoryBI</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Business Intelligence Platform</p>
      </div>

      {/* Loading bar */}
      <div className="mt-10 h-1 w-48 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full gradient-bg"
          style={{
            animation: 'cinematic-loading 2.2s ease-in-out forwards',
          }}
        />
      </div>
    </div>
  );
}
