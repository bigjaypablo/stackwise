import { useRef, useState, type ChangeEvent } from "react";
import { uploadCover } from "@/lib/uploads";

export function ImageUpload({
  value,
  onChange,
  label = "Cover image",
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function pick(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setError("");
    setBusy(true);
    try {
      onChange(await uploadCover(file));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <p className="text-sm font-semibold">{label}</p>
      <div className="mt-1 overflow-hidden rounded-2xl border border-ink/10 bg-white/60">
        {value ? (
          <img src={value} alt="" className="aspect-[16/9] w-full object-cover" />
        ) : (
          <div className="grid aspect-[16/9] place-items-center px-6 text-center text-sm text-ink/55">
            No image yet. A post without one gets a stock photo for its category.
          </div>
        )}
      </div>
      <input ref={input} type="file" accept="image/*" className="sr-only" onChange={pick} />
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button type="button" disabled={busy} onClick={() => input.current?.click()} className="pill-accent h-10 disabled:opacity-60">
          {busy ? "Uploading…" : value ? "Replace image" : "Upload image"}
        </button>
        {value && !busy ? (
          <button type="button" onClick={() => onChange("")} className="pill-light">
            Remove
          </button>
        ) : null}
      </div>
      {error ? (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
