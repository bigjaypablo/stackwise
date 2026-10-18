import { useEffect, useState } from "react";
import { FormMessage } from "@/components/admin/form-message";
import { PageHeading } from "@/components/page-heading";
import { getSubscribers } from "@/lib/api";
import { downloadCsv, toCsv } from "@/lib/csv";
import { errorText } from "@/lib/errors";
import type { Subscriber } from "@/lib/types";

export function SubscribersScreen() {
  const [rows, setRows] = useState<Subscriber[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getSubscribers()
      .then((items) => setRows(items.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt))))
      .catch((reason: unknown) => setError(errorText(reason, "Could not load subscribers.")));
  }, []);

  return (
    <div className="max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageHeading title="Subscribers" description={`${rows.length} ${rows.length === 1 ? "person" : "people"} signed up.`} />
        <button
          type="button"
          disabled={rows.length === 0}
          className="pill-light disabled:opacity-40"
          onClick={() =>
            downloadCsv(
              "stackwise-subscribers.csv",
              toCsv(["email", "created_at"], rows.map((row) => [row.email, row.createdAt])),
            )
          }
        >
          Export CSV
        </button>
      </div>
      <FormMessage text={error} />
      <ul className="glass mt-5 divide-y divide-ink/10 overflow-hidden rounded-3xl">
        {rows.map((row) => (
          <li key={row.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
            <span className="min-w-0 truncate">{row.email}</span>
            <time className="shrink-0 tabular-nums text-ink/55" dateTime={row.createdAt}>
              {row.createdAt.slice(0, 10)}
            </time>
          </li>
        ))}
        {rows.length === 0 ? <li className="px-4 py-8 text-center text-sm text-ink/60">No subscribers yet.</li> : null}
      </ul>
    </div>
  );
}
