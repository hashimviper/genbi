import { useRef, useState, useEffect, ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyWidgetProps {
  children: ReactNode;
  className?: string;
}

export function LazyWidget({ children, className }: LazyWidgetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : (
        <div className="flex h-full w-full items-center justify-center p-4">
          <Skeleton className="h-full w-full rounded-xl" />
        </div>
      )}
    </div>
  );
}
