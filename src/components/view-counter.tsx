import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { incrementView, getViewCount } from '@/lib/api/views';

interface ViewCounterProps {
  type: 'gallery' | 'book' | 'report';
  slug: string;
  increment?: boolean;
  initialCount?: number;
  className?: string;
}

export function ViewCounter({
  type,
  slug,
  increment = false,
  initialCount,
  className = '',
}: ViewCounterProps) {
  const [count, setCount] = useState(initialCount ?? 0);

  useEffect(() => {
    if (increment) {
      incrementView(type, slug).then((newCount) => {
        if (newCount > 0) setCount(newCount);
      });
    } else if (initialCount === undefined) {
      getViewCount(type, slug).then((c) => setCount(c));
    }
  }, [type, slug, increment, initialCount]);

  return (
    <span className={`inline-flex items-center gap-1 text-gray-500 ${className}`}>
      <Eye className="h-3.5 w-3.5" />
      <span className="text-xs">{count.toLocaleString()}</span>
    </span>
  );
}
