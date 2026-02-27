import { cn } from '@/lib/utils';
import { AlertCircle, Info, AlertTriangle, CheckCircle } from 'lucide-react';

type CalloutType = 'info' | 'warning' | 'error' | 'success' | 'note';

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}

const calloutConfig: Record<
  CalloutType,
  { icon: React.ComponentType<{ className?: string }>; bg: string; border: string; text: string }
> = {
  info: { icon: Info, bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800' },
  warning: { icon: AlertTriangle, bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800' },
  error: { icon: AlertCircle, bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800' },
  success: { icon: CheckCircle, bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800' },
  note: { icon: Info, bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-800' },
};

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const config = calloutConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'my-4 rounded-lg border p-4',
        config.bg,
        config.border
      )}
    >
      <div className="flex gap-3">
        <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', config.text)} />
        <div className="flex-1">
          {title && (
            <p className={cn('mb-1 font-semibold', config.text)}>
              {title}
            </p>
          )}
          <div className={cn('text-sm', config.text)}>{children}</div>
        </div>
      </div>
    </div>
  );
}
