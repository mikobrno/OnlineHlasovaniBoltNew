/* eslint-disable */
import { FC } from 'react';

export const Progress: FC<{ value: number; className?: string; }> = ({ value, className }) => {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className={`bg-gray-200 rounded overflow-hidden ${className || ''}`}>
      <div style={{ width: `${pct}%` }} className="bg-blue-600 h-2" />
    </div>
  );
};

export default Progress;
