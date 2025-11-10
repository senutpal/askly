import { cn } from "@workspace/ui/lib/utils";
import React from "react";

interface WidgetHeaderProps {
  title?: string;
  subtitle?: string;
  className?: string;
  children?: React.ReactNode;
}

export const WidgetHeader: React.FC<WidgetHeaderProps> = ({
  title,
  subtitle,
  className,
  children,
}) => {
  return (
    <header
      className={cn(
        "bg-gradient-to-r from-blue-600 to-blue-500 p-6 rounded-t-xl text-white shadow-md",
        className
      )}
    >
      {children ? (
        <div>{children}</div>
      ) : (
        <div className="flex flex-col gap-1">
          {title && (
            <h1 className="text-2xl font-bold font-sans-alt">{title}</h1>
          )}
          {subtitle && (
            <p className="text-sm opacity-80 font-sans-alt">{subtitle}</p>
          )}
        </div>
      )}
    </header>
  );
};
