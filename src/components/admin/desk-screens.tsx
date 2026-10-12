import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  deleteAffiliate,
  deleteTool,
  getAffiliates,
  getPosts,
  getSubscribers,
  getTools,
  getUsers,
  inviteUser,
  saveAffiliate,
  saveTool,
  setUserRole,
} from "@/lib/api";
import { demoMode } from "@/lib/api";
import { slugify } from "@/lib/format";
import type { Affiliate, Role, Subscriber, TeamUser, Tool } from "@/lib/types";

export function DeskHome({ role }: { role: Role }) {
  const [counts, setCounts] = useState({ posts: 0, review: 0 });

  useEffect(() => {
    getPosts({ status: "all", includeUnpublished: true })
      .then((posts) => {
        setCounts({
          posts: posts.length,
          review: posts.filter((post) => post.status === "in_review").length,
        });
      })
      .catch(() => undefined);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Desk</h1>
      <p className="mt-2 max-w-xl text-sm text-ink/70">
        {role === "writer"
          ? "You can draft and edit your own stories, then send them for review."
          : role === "editor"
            ? "You can edit every story, publish, manage categories, and export subscribers."
            : "You can publish, edit affiliate links, reorder Top Picks, and manage the team."}
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-paper p-4">
          <p className="text-sm text-ink/60">Stories you can see</p>
          <p className="mt-1 text-3xl font-black tabular-nums">{counts.posts}</p>
        </div>
        <div className="rounded-2xl border border-line bg-paper p-4">
          <p className="text-sm text-ink/60">Waiting on review</p>
          <p className="mt-1 text-3xl font-black tabular-nums">{counts.review}</p>
        </div>
      </div>
      <Link to="/admin/posts" className="mt-5 inline-flex h-11 items-center rounded-full bg-accent px-4 text-sm font-semibold text-paper">
        Open posts
      </Link>
    </div>
  );
}

export function AffiliatesScreen() {
  const [rows, setRows] = useState<Affiliate[]>([]);
  const [draft, setDraft] = useState({ id: "", name: "", url: "" });
  const [error, setError] = useState("");

  const load = () => {
    getAffiliates()
      .then(setRows)
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not load affiliates."));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Affiliate links</h1>
      <p className="mt-2 text-sm text-ink/70">One list. Every public Visit button reads from here.</p>
      {error ? <p className="mt-3 text-sm text-accent">{error}</p> : null}
      <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-paper">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead className="border-b border-line text-ink/60">
            <tr>
              <th className="px-3 py-3 font-semibold">ID</th>
              <th className="px-3 py-3 font-semibold">Name</th>
              <th className="px-3 py-3 font-semibold">URL</th>
              <th className="px-3 py-3 font-semibold"> </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <AffiliateRow key={row.id} row={row} onSaved={load} onError={setError} />
            ))}
          </tbody>
        </table>
      </div>
      <form
        className="mt-4 grid gap-2 rounded-2xl border border-line bg-paper p-4 sm:grid-cols-4"
        onSubmit={(event) => {
          event.preventDefault();
          saveAffiliate(draft)
            .then(() => {
              setDraft({ id: "", name: "", url: "" });
              load();
            })
            .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not save."));
        }}
      >
        <input aria-label="New id" value={draft.id} onChange={(event) => setDraft({ ...draft, id: slugify(event.target.value) })} placeholder="id" className="h-11 rounded-xl border border-line px-3" />
        <input aria-label="New name" required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Name" className="h-11 rounded-xl border border-line px-3" />
        <input aria-label="New URL" required value={draft.url} onChange={(event) => setDraft({ ...draft, url: event.target.value })} placeholder="https://" className="h-11 rounded-xl border border-line px-3" />
        <button type="submit" className="h-11 rounded-full bg-accent font-semibold text-paper">Add link</button>
      </form>
    </div>
  );
}

function AffiliateRow({ row, onSaved, onError }: { row: Affiliate; onSaved: () => void; onError: (value: string) => void }) {
  const [name, setName] = useState(row.name);
  const [url, setUrl] = useState(row.url);
  return (
    <tr className="border-b border-line last:border-b-0">
      <td className="px-3 py-3 font-mono text-xs">{row.id}</td>
      <td className="px-3 py-3">
        <input aria-label={`${row.name} name`} value={name} onChange={(event) => setName(event.target.value)} className="h-10 w-full rounded-lg border border-line px-2" />
      </td>
      <td className="px-3 py-3">
        <input aria-label={`${row.name} url`} value={url} onChange={(event) => setUrl(event.target.value)} className="h-10 w-full rounded-lg border border-line px-2" />
      </td>
      <td className="px-3 py-3">
        <div className="flex gap-2">
          <button
            type="button"
            className="h-10 rounded-full bg-ink px-3 text-xs font-semibold text-paper"
            onClick={() => {
              saveAffiliate({ ...row, name, url }).then(onSaved).catch((reason: unknown) => onError(reason instanceof Error ? reason.message : "Save failed."));
            }}
          >
            Save
          </button>
          <button
            type="button"
            className="h-10 rounded-full px-3 text-xs font-semibold"
            onClick={() => {
              deleteAffiliate(row.id).then(onSaved).catch((reason: unknown) => onError(reason instanceof Error ? reason.message : "Delete failed."));
            }}
          >
            Remove
          </button>
        </div>
      </td>
    </tr>
  );
}

export function ToolsScreen() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [error, setError] = useState("");

  const load = () => {
    Promise.all([getTools(), getAffiliates()])
      .then(([nextTools, nextAffiliates]) => {
        setTools(nextTools);
        setAffiliates(nextAffiliates);
      })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not load tools."));
  };

  useEffect(() => {
    load();
  }, []);

  const move = (index: number, direction: -1 | 1) => {
    const next = tools.slice();
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    const current = next[index];
    const other = next[target];
    if (!current || !other) return;
    const currentRank = current.rank;
    current.rank = other.rank;
    other.rank = currentRank;
    Promise.all([saveTool(current), saveTool(other)])
      .then(load)
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not reorder."));
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Top Picks</h1>
      <p className="mt-2 text-sm text-ink/70">These five-or-so tools fill the dark panel on the homepage.</p>
      {error ? <p className="mt-3 text-sm text-accent">{error}</p> : null}
      <ul className="mt-4 space-y-3">
        {tools.map((tool, index) => (
          <li key={tool.id} className="grid gap-2 rounded-2xl border border-line bg-paper p-3 sm:grid-cols-[auto_1fr_8rem_8rem_auto]">
            <div className="flex gap-1">
              <button type="button" aria-label={`Move ${tool.name} up`} className="size-10 rounded-lg border border-line" onClick={() => move(index, -1)}>
                ↑
              </button>
              <button type="button" aria-label={`Move ${tool.name} down`} className="size-10 rounded-lg border border-line" onClick={() => move(index, 1)}>
                ↓
              </button>
            </div>
            <ToolFields tool={tool} affiliates={affiliates} onSaved={load} onError={setError} />
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="mt-4 h-11 rounded-full bg-accent px-4 text-sm font-semibold text-paper"
        onClick={() => {
          const rank = (tools[tools.length - 1]?.rank ?? 0) + 1;
          saveTool({
            id: crypto.randomUUID(),
            name: "New tool",
            category: "Tool",
            rating: 8,
            affiliateId: affiliates[0]?.id ?? "",
            rank,
            blurb: "",
          })
            .then(load)
            .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not add."));
        }}
      >
        Add tool
      </button>
    </div>
  );
}

function ToolFields({
  tool,
  affiliates,
  onSaved,
  onError,
}: {
  tool: Tool;
  affiliates: Affiliate[];
  onSaved: () => void;
  onError: (value: string) => void;
}) {
  const [draft, setDraft] = useState(tool);
  return (
    <>
      <input aria-label="Tool name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} className="h-11 rounded-xl border border-line px-3" />
      <input aria-label="Tool category" value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} className="h-11 rounded-xl border border-line px-3" />
      <input aria-label="Rating" type="number" min={0} max={10} step={0.1} value={draft.rating} onChange={(event) => setDraft({ ...draft, rating: Number(event.target.value) })} className="h-11 rounded-xl border border-line px-3 tabular-nums" />
      <div className="flex gap-2 sm:col-span-5">
        <select aria-label="Affiliate" value={draft.affiliateId} onChange={(event) => setDraft({ ...draft, affiliateId: event.target.value })} className="h-11 flex-1 rounded-xl border border-line px-3">
          <option value="">No affiliate</option>
          {affiliates.map((affiliate) => (
            <option key={affiliate.id} value={affiliate.id}>
              {affiliate.name}
            </option>
          ))}
        </select>
        <button type="button" className="h-11 rounded-full bg-ink px-4 text-sm font-semibold text-paper" onClick={() => saveTool(draft).then(onSaved).catch((reason: unknown) => onError(reason instanceof Error ? reason.message : "Save failed."))}>
          Save
        </button>
        <button type="button" className="h-11 rounded-full px-3 text-sm" onClick={() => deleteTool(tool.id).then(onSaved).catch((reason: unknown) => onError(reason instanceof Error ? reason.message : "Delete failed."))}>
          Remove
        </button>
      </div>
    </>
  );
}

export function SubscribersScreen() {
  const [rows, setRows] = useState<Subscriber[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getSubscribers()
      .then(setRows)
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not load subscribers."));
  }, []);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Subscribers</h1>
        <button
          type="button"
          className="h-11 rounded-full border border-line bg-paper px-4 text-sm font-semibold"
          onClick={() => {
            const csv = ["email,created_at", ...rows.map((row) => `${row.email},${row.createdAt}`)].join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = "stackwise-subscribers.csv";
            anchor.click();
            URL.revokeObjectURL(url);
          }}
        >
          Export CSV
        </button>
      </div>
      {error ? <p className="mt-3 text-sm text-accent">{error}</p> : null}
      <ul className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper">
        {rows.map((row) => (
          <li key={row.id} className="flex items-center justify-between px-4 py-3 text-sm">
            <span>{row.email}</span>
            <time className="text-ink/55 tabular-nums" dateTime={row.createdAt}>
              {row.createdAt.slice(0, 10)}
            </time>
          </li>
        ))}
        {rows.length === 0 ? <li className="px-4 py-8 text-sm text-ink/60">No subscribers yet.</li> : null}
      </ul>
    </div>
  );
}

export function TeamScreen() {
  const [users, setUsers] = useState<TeamUser[]>([]);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("writer");

  const load = () => {
    getUsers()
      .then(setUsers)
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not load the team."));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Team</h1>
      <p className="mt-2 text-sm text-ink/70">
        {demoMode
          ? "Invite creates a local account. Default password is demo1234 unless you set one later in code."
          : "People sign up on the login page as writers. Promote or deactivate them here. Removing a Supabase auth user needs the service role, which this app never uses."}
      </p>
      {error ? <p className="mt-3 text-sm text-accent">{error}</p> : null}
      <ul className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper">
        {users.map((user) => (
          <li key={user.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{user.name}</p>
              <p className="text-xs text-ink/60">{user.email}{user.active ? "" : " · inactive"}</p>
            </div>
            <label className="sr-only" htmlFor={`role-${user.id}`}>
              Role for {user.email}
            </label>
            <select
              id={`role-${user.id}`}
              value={user.role}
              onChange={(event) => {
                setUserRole(user.id, event.target.value as Role, user.active).then(load).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not change role."));
              }}
              className="h-10 rounded-xl border border-line px-2 text-sm"
            >
              <option value="admin">admin</option>
              <option value="editor">editor</option>
              <option value="writer">writer</option>
            </select>
            <button
              type="button"
              className="h-10 rounded-full px-3 text-sm font-semibold"
              onClick={() => {
                setUserRole(user.id, user.role, !user.active).then(load).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not update."));
              }}
            >
              {user.active ? "Deactivate" : "Reactivate"}
            </button>
          </li>
        ))}
      </ul>
      {demoMode ? (
        <form
          className="mt-4 grid gap-2 rounded-2xl border border-line bg-paper p-4 sm:grid-cols-4"
          onSubmit={(event) => {
            event.preventDefault();
            inviteUser({ email, name, role })
              .then(() => {
                setEmail("");
                setName("");
                load();
              })
              .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not invite."));
          }}
        >
          <input aria-label="Name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" className="h-11 rounded-xl border border-line px-3" />
          <input aria-label="Email" required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" className="h-11 rounded-xl border border-line px-3" />
          <select aria-label="Role" value={role} onChange={(event) => setRole(event.target.value as Role)} className="h-11 rounded-xl border border-line px-3">
            <option value="writer">writer</option>
            <option value="editor">editor</option>
            <option value="admin">admin</option>
          </select>
          <button type="submit" className="h-11 rounded-full bg-accent font-semibold text-paper">
            Invite
          </button>
        </form>
      ) : null}
    </div>
  );
}
