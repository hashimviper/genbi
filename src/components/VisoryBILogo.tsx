import visorybiLogoSrc from '@/assets/visorybi-logo.png';

interface VisoryBILogoProps {
  size?: number;
  className?: string;
}

export function VisoryBILogo({ size = 20, className = '' }: VisoryBILogoProps) {
  return (
    <img 
      src={visorybiLogoSrc} 
      alt="VisoryBI Logo" 
      width={size} 
      height={size}
      className={`object-contain ${className}`}
    />
  );
}
