import { useEffect, useState } from "react";
import { formatUtcDate, timeAgo } from "@/lib/format";

export function TimeAgo({ iso }: { iso: string }) {
  const [label, setLabel] = useState(() => formatUtcDate(iso));

  useEffect(() => {
    setLabel(timeAgo(iso));
  }, [iso]);

  if (!iso) return null;
  return (
    <time dateTime={iso} className="tabular-nums">
      {label}
    </time>
  );
}
