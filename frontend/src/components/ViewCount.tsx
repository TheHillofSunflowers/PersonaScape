import { useState, useEffect } from 'react';

interface ViewCountProps {
  count: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ViewCount({ 
  count, 
  size = 'md', 
  className = '' 
}: ViewCountProps) {
  // Format large numbers (e.g., 1.2k instead of 1200)
  const [formattedCount, setFormattedCount] = useState<string>(count.toString());

  useEffect(() => {
    // Format the count for display
    if (count >= 1000000) {
      setFormattedCount(`${(count / 1000000).toFixed(1)}M`);
    } else if (count >= 1000) {
      setFormattedCount(`${(count / 1000).toFixed(1)}K`);
    } else {
      setFormattedCount(count.toString());
    }
  }, [count]);

  // Size classes for the component
  const sizeClasses = {
    sm: 'text-xs gap-0.5',
    md: 'text-sm gap-1',
    lg: 'text-base gap-1.5'
  };

  return (
    <div className={`flex items-center ${sizeClasses[size]} ${className}`}>
      <span className="text-gray-400 mr-1">👁️</span>
      <span className="text-gray-500">{formattedCount}</span>
    </div>
  );
} 