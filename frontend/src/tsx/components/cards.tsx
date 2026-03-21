import React from 'react';
import '../../css/components.css';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  glass = true, 
  className = '', 
  ...props 
}) => {
  const cardClass = `card ${glass ? 'glass' : ''} ${className}`;
  
  return (
    <div className={cardClass.trim()} {...props}>
      {children}
    </div>
  );
};