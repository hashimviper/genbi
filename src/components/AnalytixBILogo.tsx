import analytixbiLogoSrc from '@/assets/analytixbi-logo.png';

interface AnalytixBILogoProps {
  size?: number;
  className?: string;
}

export function AnalytixBILogo({ size = 20, className = '' }: AnalytixBILogoProps) {
  return (
    <img 
      src={analytixbiLogoSrc} 
      alt="AnalytixBI Logo" 
      width={size} 
      height={size}
      className={`object-contain ${className}`}
    />
  );
}
