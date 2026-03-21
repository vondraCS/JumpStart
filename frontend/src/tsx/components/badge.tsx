import React from 'react';
import '../../css/components.css';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'brand' | 'tertiary' | 'neutral';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', className = '' }) => {
  return (
    <span className={`badge badge-${variant} ${className}`.trim()}>
      {children}
    </span>
  );
};
