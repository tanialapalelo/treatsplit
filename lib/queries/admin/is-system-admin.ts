import { createClient } from "@/lib/supabase/server";

export async function isSystemAdmin(userId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("system_admins")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("isSystemAdmin error", error);
    return false;
  }
  return !!data;
}
