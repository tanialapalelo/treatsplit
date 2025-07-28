import { createClient } from "@/lib/supabase/server";

/**
 * Get all ID team ID based on user
 */
export async function getUserTeamIds(userId: string): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("team_members")
    .select("team_id")
    .eq("user_id", userId);

  if (error) {
    console.error("getUserTeamIds error:", error);
    return [];
  }

  return data.map((item) => item.team_id);
}
