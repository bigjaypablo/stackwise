import { demoMode } from "@/lib/api";

const MAX_BYTES = 15 * 1024 * 1024;

async function shrink(file: File, edge: number, quality: number): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, edge / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("This browser cannot process images.");
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", quality));
  if (!blob) throw new Error("Could not prepare that image.");
  return blob;
}

function toDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read that image."));
    reader.readAsDataURL(blob);
  });
}

/** Shrinks the image in the browser, uploads it, and returns its public address. */
export async function uploadCover(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Choose an image file.");
  if (file.size > MAX_BYTES) throw new Error("That image is over 15 MB. Pick a smaller one.");

  if (demoMode) {
    return toDataUrl(await shrink(file, 900, 0.7));
  }

  const blob = await shrink(file, 1600, 0.82);
  const { supabase } = await import("@/lib/supabase-adapter");
  const client = supabase();
  const path = `${new Date().toISOString().slice(0, 7)}/${crypto.randomUUID()}.webp`;
  const { error } = await client.storage
    .from("covers")
    .upload(path, blob, { contentType: "image/webp", cacheControl: "31536000" });
  if (error) throw new Error("Upload failed. Check your connection and try again.");
  return client.storage.from("covers").getPublicUrl(path).data.publicUrl;
}
