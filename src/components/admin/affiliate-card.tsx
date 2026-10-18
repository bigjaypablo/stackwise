import { useState } from "react";
import { isPlaceholder } from "@/lib/affiliate-checks";
import { deleteAffiliate, saveAffiliate } from "@/lib/api";
import { errorText } from "@/lib/errors";
import { safeHttpUrl } from "@/lib/format";
import type { Affiliate } from "@/lib/types";

export function AffiliateCard({
  row,
  onSaved,
  onError,
}: {
  row: Affiliate;
  onSaved: () => void;
  onError: (value: string) => void;
}) {
  const [name, setName] = useState(row.name);
  const [url, setUrl] = useState(row.url);
  const changed = name !== row.name || url !== row.url;

  return (
    <li className="glass rounded-3xl p-4">
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-mono text-xs text-ink/50">{row.id}</p>
        {isPlaceholder(row.url) ? (
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">Placeholder link</span>
        ) : null}
      </div>
      <div className="mt-2 space-y-2">
        <input
          aria-label={`${row.name} name`}
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="field h-11"
        />
        <input
          aria-label={`${row.name} link`}
          inputMode="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          className="field h-11"
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={!changed}
          className={changed ? "pill-accent h-10" : "pill-light disabled:opacity-40"}
          onClick={() => {
            const safe = safeHttpUrl(url.trim());
            if (!safe) {
              onError("Enter the full link, starting with https://");
              return;
            }
            saveAffiliate({ ...row, name: name.trim(), url: safe })
              .then(onSaved)
              .catch((reason: unknown) => onError(errorText(reason, "Save failed.")));
          }}
        >
          Save
        </button>
        <button
          type="button"
          className="pill-light text-red-600"
          onClick={() => {
            if (!window.confirm(`Remove ${row.name}? Posts and tools using it will lose their link.`)) return;
            deleteAffiliate(row.id)
              .then(onSaved)
              .catch((reason: unknown) => onError(errorText(reason, "Remove failed.")));
          }}
        >
          Remove
        </button>
      </div>
    </li>
  );
}
