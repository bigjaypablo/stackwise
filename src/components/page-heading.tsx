export function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <header>
      {eyebrow ? <p className="text-xs font-bold uppercase tracking-wider text-accent">{eyebrow}</p> : null}
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
      {description ? <p className="mt-3 max-w-2xl text-ink/70">{description}</p> : null}
    </header>
  );
}
