import { FC, ReactNode } from 'react';

export const Tabs: FC<{ value: string; onValueChange?: (v: string) => void; className?: string; children?: ReactNode }> = ({ value, children }) => {
  return <div className="tabs-root">{children}</div>;
};

export const TabsList: FC<{ children?: ReactNode }> = ({ children }) => (
  <div className="flex space-x-2 mb-4">{children}</div>
);

export const TabsTrigger: FC<{ value: string; children?: ReactNode; onClick?: () => void }> = ({ children }) => (
  <button className="px-3 py-1 text-sm font-medium">{children}</button>
);

export const TabsContent: FC<{ value: string; children?: ReactNode }> = ({ children }) => (
  <div className="tab-content">{children}</div>
);

export default Tabs;
