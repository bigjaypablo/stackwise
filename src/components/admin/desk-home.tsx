import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LaunchChecklist, type ChecklistItem } from "@/components/admin/launch-checklist";
import { StatTile } from "@/components/admin/stat-tile";
import { PageHeading } from "@/components/page-heading";
import { isPlaceholder } from "@/lib/affiliate-checks";
import { getAffiliates, getPosts, getTools } from "@/lib/api";
import { listAll } from "@/lib/comments";
import { CONTACT_EMAIL } from "@/lib/site";
import type { Post, Role } from "@/lib/types";

const INTRO: Record<Role, string> = {
  writer: "You can draft and edit your own stories, then send them for review.",
  editor: "You can edit every story, publish, moderate comments, and export subscribers.",
  admin: "You can publish, manage affiliate links and featured tools, and run the team.",
};

export function DeskHome({ role }: { role: Role }) {
  const staff = role !== "writer";
  const [posts, setPosts] = useState<Post[]>([]);
  const [pending, setPending] = useState(0);
  const [affiliateCount, setAffiliateCount] = useState(0);
  const [placeholders, setPlaceholders] = useState(false);
  const [toolCount, setToolCount] = useState(0);

  useEffect(() => {
    getPosts({ status: "all", includeUnpublished: true })
      .then(setPosts)
      .catch(() => undefined);
    if (staff) {
      listAll()
        .then((items) => setPending(items.filter((item) => item.status === "pending").length))
        .catch(() => undefined);
    }
    if (role === "admin") {
      getAffiliates()
        .then((rows) => {
          setAffiliateCount(rows.length);
          setPlaceholders(rows.some((row) => isPlaceholder(row.url)));
        })
        .catch(() => undefined);
      getTools()
        .then((rows) => setToolCount(rows.length))
        .catch(() => undefined);
    }
  }, [role, staff]);

  const published = posts.filter((post) => post.status === "published").length;
  const review = posts.filter((post) => post.status === "in_review").length;
  const drafts = posts.filter((post) => post.status === "draft").length;

  const checklist: ChecklistItem[] = [
    { label: "Publish your first post", done: published >= 1, to: "/admin/posts" },
    { label: "Reach 5 published posts", done: published >= 5, to: "/admin/posts" },
    { label: "Add your approved affiliate links", done: affiliateCount > 0 && !placeholders, to: "/admin/affiliates" },
    { label: "Add featured tools for the home page", done: toolCount > 0, to: "/admin/tools" },
    { label: "Set the public contact email in src/lib/site.ts", done: CONTACT_EMAIL.length > 0 },
  ];

  const tiles = [
    { label: "Published", value: published },
    { label: "In review", value: review },
    { label: "Drafts", value: drafts },
    ...(staff ? [{ label: "Comments waiting", value: pending }] : []),
  ];

  return (
    <div className="max-w-3xl">
      <PageHeading title="Desk" description={INTRO[role]} />

      <div className="mt-5 grid grid-cols-2 gap-3">
        {tiles.map((tile) => (
          <StatTile key={tile.label} label={tile.label} value={tile.value} />
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link to="/admin/posts" className="pill-accent">
          Open posts
        </Link>
        {staff && pending > 0 ? (
          <Link to="/admin/comments" className="pill-light">
            Review {pending} {pending === 1 ? "comment" : "comments"}
          </Link>
        ) : null}
      </div>

      {role === "admin" ? <LaunchChecklist items={checklist} /> : null}
    </div>
  );
}
