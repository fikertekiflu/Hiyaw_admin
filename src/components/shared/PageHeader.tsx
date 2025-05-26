// src/components/shared/PageHeader.tsx
import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export default function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
      <div className="space-y-1.5">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {children && <div className="flex-shrink-0 mt-4 md:mt-0 flex gap-3">{children}</div>}
    </div>
  );
}