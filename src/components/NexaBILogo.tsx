import nexabiLogoSrc from '@/assets/nexabi-logo.png';

interface NexaBILogoProps {
  size?: number;
  className?: string;
}

export function NexaBILogo({ size = 20, className = '' }: NexaBILogoProps) {
  return (
    <img 
      src={nexabiLogoSrc} 
      alt="NexaBI Logo" 
      width={size} 
      height={size}
      className={`object-contain ${className}`}
    />
  );
}
