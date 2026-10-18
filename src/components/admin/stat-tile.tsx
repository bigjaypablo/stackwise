export function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass rounded-3xl p-4">
      <p className="text-sm text-ink/60">{label}</p>
      <p className="mt-1 text-3xl font-black tabular-nums">{value}</p>
    </div>
  );
}
