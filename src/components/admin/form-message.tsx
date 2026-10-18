export function FormMessage({ text }: { text: string }) {
  if (!text) return null;
  return (
    <p className="mt-3 text-sm text-red-600" role="alert">
      {text}
    </p>
  );
}
