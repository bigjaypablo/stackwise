import type { ReactNode } from "react";
import { safeHttpUrl } from "@/lib/format";
import type { Affiliate } from "@/lib/types";

export function AffiliateLink({
  affiliate,
  className,
  children,
}: {
  affiliate: Affiliate;
  className?: string;
  children: ReactNode;
}) {
  const href = safeHttpUrl(affiliate.url);
  if (!href) return <span className={className}>{children}</span>;
  return (
    <a href={href} className={className} target="_blank" rel="sponsored nofollow noopener">
      {children}
    </a>
  );
}
