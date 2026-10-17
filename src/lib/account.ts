import { demoMode } from "@/lib/api";

export async function changePassword(password: string): Promise<void> {
  if (demoMode) throw new Error("Password changes are not available in demo mode.");
  const { supabase } = await import("@/lib/supabase-adapter");
  const { error } = await supabase().auth.updateUser({ password });
  if (error) throw new Error(error.message);
}
