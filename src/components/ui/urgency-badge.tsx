import { Badge } from './badge';
import { cn } from '@/lib/utils';
import { AlertTriangle, Clock, Zap } from 'lucide-react';
import { JobUrgency } from '@/contexts/JobsContext';

interface UrgencyBadgeProps {
  urgency: JobUrgency;
  className?: string;
}

const urgencyConfig = {
  low: {
    label: 'Low',
    icon: Clock,
    className: 'bg-urgency-low/10 text-urgency-low border-urgency-low/20',
  },
  high: {
    label: 'High',
    icon: AlertTriangle,
    className: 'bg-urgency-high/10 text-urgency-high border-urgency-high/20',
  },
  emergency: {
    label: 'Emergency',
    icon: Zap,
    className: 'bg-urgency-emergency/10 text-urgency-emergency border-urgency-emergency/20 animate-pulse-soft',
  },
};

export function UrgencyBadge({ urgency, className }: UrgencyBadgeProps) {
  const config = urgencyConfig[urgency];
  const Icon = config.icon;

  return (
    <Badge 
      variant="outline" 
      className={cn("font-medium gap-1.5", config.className, className)}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
