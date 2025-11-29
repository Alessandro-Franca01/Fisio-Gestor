import React from 'react';
import { IconName } from '../types';

interface IconProps {
  name: IconName;
  className?: string;
  filled?: boolean;
}

export const Icon: React.FC<IconProps> = ({ name, className = "", filled = false }) => {
  return (
    <span 
      className={`material-symbols-outlined ${filled ? 'fill' : ''} ${className}`}
    >
      {name}
    </span>
  );
};
