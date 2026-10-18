import { useState } from "react";
import { deleteTool, saveTool } from "@/lib/api";
import { errorText } from "@/lib/errors";
import type { Affiliate, Tool } from "@/lib/types";

export function ToolCard({
  tool,
  index,
  last,
  affiliates,
  onMove,
  onSaved,
  onError,
}: {
  tool: Tool;
  index: number;
  last: boolean;
  affiliates: Affiliate[];
  onMove: (index: number, direction: -1 | 1) => void;
  onSaved: () => void;
  onError: (value: string) => void;
}) {
  const [name, setName] = useState(tool.name);
  const [category, setCategory] = useState(tool.category);
  const [affiliateId, setAffiliateId] = useState(tool.affiliateId);
  const changed = name !== tool.name || category !== tool.category || affiliateId !== tool.affiliateId;

  return (
    <li className="glass rounded-3xl p-4">
      <div className="flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-full bg-ink text-sm font-bold text-white">{index + 1}</span>
        {index < 5 ? (
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">On home page</span>
        ) : null}
        <div className="ml-auto flex gap-1">
          <button
            type="button"
            aria-label={`Move ${tool.name} up`}
            disabled={index === 0}
            className="pill-light size-10 p-0 disabled:opacity-35"
            onClick={() => onMove(index, -1)}
          >
            ↑
          </button>
          <button
            type="button"
            aria-label={`Move ${tool.name} down`}
            disabled={last}
            className="pill-light size-10 p-0 disabled:opacity-35"
            onClick={() => onMove(index, 1)}
          >
            ↓
          </button>
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <input aria-label="Tool name" value={name} onChange={(event) => setName(event.target.value)} className="field h-11" />
        <input
          aria-label="Tool type"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="field h-11"
        />
        <select
          aria-label="Affiliate link"
          value={affiliateId}
          onChange={(event) => setAffiliateId(event.target.value)}
          className="field h-11"
        >
          <option value="">No affiliate</option>
          {affiliates.map((affiliate) => (
            <option key={affiliate.id} value={affiliate.id}>
              {affiliate.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={!changed}
          className={changed ? "pill-accent h-10" : "pill-light disabled:opacity-40"}
          onClick={() =>
            saveTool({ ...tool, name: name.trim(), category: category.trim(), affiliateId })
              .then(onSaved)
              .catch((reason: unknown) => onError(errorText(reason, "Save failed.")))
          }
        >
          Save
        </button>
        <button
          type="button"
          className="pill-light text-red-600"
          onClick={() => {
            if (!window.confirm(`Remove ${tool.name} from the home page?`)) return;
            deleteTool(tool.id)
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
