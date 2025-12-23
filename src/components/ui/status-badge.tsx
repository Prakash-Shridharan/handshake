import { Badge } from './badge';
import { cn } from '@/lib/utils';
import { Circle, Clock, PlayCircle, CheckCircle2 } from 'lucide-react';
import { JobStatus } from '@/contexts/JobsContext';

interface StatusBadgeProps {
  status: JobStatus;
  className?: string;
}

const statusConfig = {
  open: {
    label: 'Open',
    icon: Circle,
    className: 'bg-status-open/10 text-status-open border-status-open/20',
  },
  assigned: {
    label: 'Assigned',
    icon: Clock,
    className: 'bg-status-assigned/10 text-status-assigned border-status-assigned/20',
  },
  in_progress: {
    label: 'In Progress',
    icon: PlayCircle,
    className: 'bg-status-in-progress/10 text-status-in-progress border-status-in-progress/20',
  },
  completed: {
    label: 'Completed',
    icon: CheckCircle2,
    className: 'bg-status-completed/10 text-status-completed border-status-completed/20',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
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
