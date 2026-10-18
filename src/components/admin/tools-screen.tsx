import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { FormMessage } from "@/components/admin/form-message";
import { ToolCard } from "@/components/admin/tool-card";
import { PageHeading } from "@/components/page-heading";
import { getAffiliates, getTools, saveTool } from "@/lib/api";
import { errorText } from "@/lib/errors";
import type { Affiliate, Tool } from "@/lib/types";

export function ToolsScreen() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [affiliateId, setAffiliateId] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(() => {
    Promise.all([getTools(), getAffiliates()])
      .then(([nextTools, nextAffiliates]) => {
        setTools(nextTools);
        setAffiliates(nextAffiliates);
      })
      .catch((reason: unknown) => setError(errorText(reason, "Could not load tools.")));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const sorted = useMemo(() => tools.slice().sort((a, b) => a.rank - b.rank), [tools]);

  function move(index: number, direction: -1 | 1) {
    const first = sorted[index];
    const second = sorted[index + direction];
    if (!first || !second) return;
    Promise.all([saveTool({ ...first, rank: second.rank }), saveTool({ ...second, rank: first.rank })])
      .then(load)
      .catch((reason: unknown) => setError(errorText(reason, "Could not reorder.")));
  }

  function add(event: FormEvent) {
    event.preventDefault();
    setError("");
    const rank = (sorted[sorted.length - 1]?.rank ?? 0) + 1;
    saveTool({
      id: crypto.randomUUID(),
      name: name.trim(),
      category: category.trim() || "Tool",
      rating: 0,
      affiliateId,
      rank,
      blurb: "",
    })
      .then(() => {
        setName("");
        setCategory("");
        setAffiliateId("");
        load();
      })
      .catch((reason: unknown) => setError(errorText(reason, "Could not add.")));
  }

  return (
    <div className="max-w-3xl">
      <PageHeading
        title="Featured tools"
        description="The first five fill the Featured tools panel on the home page. The panel stays hidden until you add at least one."
      />

      <section className="glass mt-5 rounded-[1.75rem] p-5">
        <h2 className="text-lg font-extrabold tracking-tight">Add a tool</h2>
        <form className="mt-3 space-y-3" onSubmit={add}>
          <div>
            <label htmlFor="tool-name" className="text-sm font-semibold">
              Name
            </label>
            <input
              id="tool-name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="field mt-1 h-12"
            />
          </div>
          <div>
            <label htmlFor="tool-category" className="text-sm font-semibold">
              Type (for example Exchange, AI editor, Password manager)
            </label>
            <input
              id="tool-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="field mt-1 h-12"
            />
          </div>
          <div>
            <label htmlFor="tool-affiliate" className="text-sm font-semibold">
              Affiliate link
            </label>
            <select
              id="tool-affiliate"
              value={affiliateId}
              onChange={(event) => setAffiliateId(event.target.value)}
              className="field mt-1 h-12"
            >
              <option value="">No affiliate (hides the Visit button)</option>
              {affiliates.map((affiliate) => (
                <option key={affiliate.id} value={affiliate.id}>
                  {affiliate.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="pill-accent">
            Add tool
          </button>
        </form>
      </section>

      <FormMessage text={error} />

      <ul className="mt-5 space-y-3">
        {sorted.map((tool, index) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            index={index}
            last={index === sorted.length - 1}
            affiliates={affiliates}
            onMove={move}
            onSaved={load}
            onError={setError}
          />
        ))}
      </ul>
      {sorted.length === 0 ? (
        <p className="glass mt-5 rounded-3xl px-5 py-8 text-center text-sm text-ink/65">No featured tools yet.</p>
      ) : null}
    </div>
  );
}
