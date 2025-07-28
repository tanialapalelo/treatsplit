import { createClient } from "@/lib/supabase/server";

export interface AdminStats {
  totalUsers: number;
  activeTeams: number;
  activeEvents: number;
  totalContributions: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = await createClient();

  const [{ count: usersCount }, { count: teamCount }, { count: eventCount }, { data: contribs }] = await Promise.all([
    supabase.from("users").select("id", { count: "exact", head: true }),
    supabase.from("teams").select("id", { count: "exact", head: true }),
    supabase.from("events").select("id", { count: "exact", head: true }),
    supabase.from("contributions").select("amount").eq("paid", true),
  ]);

  const totalContributions =
    contribs?.reduce((acc, c) => acc + Number(c.amount || 0), 0) ?? 0;

  return {
    totalUsers: usersCount || 0,
    activeTeams: teamCount || 0,
    activeEvents: eventCount || 0,
    totalContributions,
  };
}
