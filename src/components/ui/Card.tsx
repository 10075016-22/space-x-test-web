import React from 'react';
import { cn } from '@/lib/utils';
import { CardProps } from '@/lib/types';

const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-gray-200 shadow-sm',
        hover && 'hover:shadow-md transition-shadow duration-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('px-6 py-4 border-b border-gray-200', className)}>
      {children}
    </div>
  );
};

const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('px-6 py-4', className)}>
      {children}
    </div>
  );
};

const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('px-6 py-4 border-t border-gray-200', className)}>
      {children}
    </div>
  );
};

export { Card, CardHeader, CardContent, CardFooter };
export default Card;
