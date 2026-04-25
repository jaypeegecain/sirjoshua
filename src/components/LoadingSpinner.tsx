'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({ size = 'md', message, fullScreen = false }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-4',
    lg: 'w-16 h-16 border-4'
  };

  const container = fullScreen ? (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <Spinner size={size} />
      {message && <p className="text-on-surface-variant text-sm font-medium mt-4">{message}</p>}
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-4">
      <Spinner size={size} />
      {message && <p className="text-on-surface-variant text-sm font-medium">{message}</p>}
    </div>
  );

  return container;
}

function Spinner({ size }: { size: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-4',
    lg: 'w-16 h-16 border-4'
  };

  return (
    <div
      className={`${sizeClasses[size]} border-primary-container/30 border-t-primary-container rounded-full animate-spin`}
    />
  );
}
