import { Link } from "@tanstack/react-router";

export function SectionHeading({
  id,
  title,
  viewAllSlug,
}: {
  id: string;
  title: string;
  viewAllSlug?: string;
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="h-6 w-1 rounded-full bg-accent" aria-hidden="true" />
        <h2 id={id} className="text-xl font-extrabold tracking-tight">
          {title}
        </h2>
      </div>
      {viewAllSlug ? (
        <Link to="/category/$slug" params={{ slug: viewAllSlug }} className="text-sm font-semibold text-accent">
          View all
        </Link>
      ) : null}
    </div>
  );
}
