import { useCallback, useEffect, useState, type FormEvent } from "react";
import { AffiliateCard } from "@/components/admin/affiliate-card";
import { FormMessage } from "@/components/admin/form-message";
import { PageHeading } from "@/components/page-heading";
import { getAffiliates, saveAffiliate } from "@/lib/api";
import { errorText } from "@/lib/errors";
import { safeHttpUrl, slugify } from "@/lib/format";
import type { Affiliate } from "@/lib/types";

export function AffiliatesScreen() {
  const [rows, setRows] = useState<Affiliate[]>([]);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(() => {
    getAffiliates()
      .then(setRows)
      .catch((reason: unknown) => setError(errorText(reason, "Could not load affiliates.")));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function add(event: FormEvent) {
    event.preventDefault();
    setError("");
    const safe = safeHttpUrl(url.trim());
    if (!safe) {
      setError("Enter the full link, starting with https://");
      return;
    }
    const base = slugify(name) || "link";
    let id = base;
    let count = 2;
    while (rows.some((row) => row.id === id)) {
      id = `${base}-${count}`;
      count += 1;
    }
    saveAffiliate({ id, name: name.trim(), url: safe })
      .then(() => {
        setName("");
        setUrl("");
        load();
      })
      .catch((reason: unknown) => setError(errorText(reason, "Could not save.")));
  }

  return (
    <div className="max-w-3xl">
      <PageHeading
        title="Affiliate links"
        description="One list. Every Visit button and Featured tool box on the site reads from here. Use only the links your affiliate programs give you."
      />

      <section className="glass mt-5 rounded-[1.75rem] p-5">
        <h2 className="text-lg font-extrabold tracking-tight">Add a link</h2>
        <form className="mt-3 space-y-3" onSubmit={add}>
          <div>
            <label htmlFor="aff-name" className="text-sm font-semibold">
              Name
            </label>
            <input
              id="aff-name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Bybit"
              className="field mt-1 h-12"
            />
          </div>
          <div>
            <label htmlFor="aff-url" className="text-sm font-semibold">
              Your affiliate link
            </label>
            <input
              id="aff-url"
              required
              inputMode="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://"
              className="field mt-1 h-12"
            />
          </div>
          <button type="submit" className="pill-accent">
            Add link
          </button>
        </form>
      </section>

      <FormMessage text={error} />

      <ul className="mt-5 space-y-3">
        {rows.map((row) => (
          <AffiliateCard key={row.id} row={row} onSaved={load} onError={setError} />
        ))}
      </ul>
      {rows.length === 0 ? (
        <p className="glass mt-5 rounded-3xl px-5 py-8 text-center text-sm text-ink/65">
          No affiliate links yet. Add one after a program approves you.
        </p>
      ) : null}
    </div>
  );
}
