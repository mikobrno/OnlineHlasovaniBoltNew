import { FC, ReactNode } from 'react';

export const Badge: FC<{ children: ReactNode; variant?: string }> = ({ children }) => {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
      {children}
    </span>
  );
};

export default Badge;
