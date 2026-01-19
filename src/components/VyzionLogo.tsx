import vyzionLogoSrc from '@/assets/vyzion-logo.png';

interface VyzionLogoProps {
  size?: number;
  className?: string;
}

export function VyzionLogo({ size = 20, className = '' }: VyzionLogoProps) {
  return (
    <img 
      src={vyzionLogoSrc} 
      alt="Vyzion Logo" 
      width={size} 
      height={size}
      className={`object-contain ${className}`}
    />
  );
}
