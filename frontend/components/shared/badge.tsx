'use client';

import { cn } from '@/lib/utils';
import React from 'react';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

const variantClasses = {
  default: 'bg-primary text-primary-foreground',
  success: 'bg-green-600 text-white',
  warning: 'bg-yellow-600 text-white',
  error: 'bg-destructive text-destructive-foreground',
  info: 'bg-blue-600 text-white',
  outline: 'border border-border text-foreground',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
};

export function Badge({
  variant = 'default',
  size = 'md',
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium whitespace-nowrap',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
}

// Status badge with predefined statuses
export function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { variant: keyof typeof variantClasses; label: string }> = {
    active: { variant: 'success', label: 'Active' },
    inactive: { variant: 'error', label: 'Inactive' },
    pending: { variant: 'warning', label: 'Pending' },
    approved: { variant: 'success', label: 'Approved' },
    rejected: { variant: 'error', label: 'Rejected' },
    in_progress: { variant: 'info', label: 'In Progress' },
    completed: { variant: 'success', label: 'Completed' },
  };

  const config = statusConfig[status.toLowerCase()] || { variant: 'default' as const, label: status };

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
