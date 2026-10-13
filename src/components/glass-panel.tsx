import type { ReactNode } from "react";

export function GlassPanel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`glass rounded-[1.75rem] ${className}`}>{children}</div>;
}
