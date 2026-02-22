import { cn } from '@/lib/utils';
import { Status } from '@prisma/client';

const statusConfig = {
  [Status.OPEN]: { label: 'Open', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
  [Status.IN_PROGRESS]: { label: 'In Progress', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  [Status.RESOLVED]: { label: 'Resolved', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
  [Status.CLOSED]: { label: 'Closed', className: 'bg-slate-500/20 text-slate-400 border-slate-500/30' },
};

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
