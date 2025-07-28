import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "../currency";

/**
 * Main dashboard stats query
 */
export async function getDashboardStats(teamIds: string[]) {
  if (!teamIds || teamIds.length === 0) {
    return defaultStats("IDR");
  }

  const supabase = await createClient();
  const today = new Date();
  const startOfThisWeek = getStartOfWeek(today);
  const startOfLastWeek = getStartOfWeek(new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000));
  const { startOfThisMonth, startOfLastMonth } = getMonthRanges();

  /** ----------------- 0. Team Currency ----------------- */
  const { data: teamData, error: teamError } = await supabase
    .from("teams")
    .select("currency")
    .in("id", teamIds);

  if (teamError) {
    console.error("Error fetching team currency:", teamError);
  }

  // For now, assume the first team's currency (MVP)
  const teamCurrency = teamData?.[0]?.currency || "IDR";

  /** ----------------- 1. Active Events ----------------- */
  const { count: currentWeekEvents } = await supabase
    .from("events")
    .select("id", { count: "exact", head: true })
    .in("team_id", teamIds)
    .gte("date", startOfThisWeek.toISOString().split("T")[0]);

  const { count: lastWeekEvents } = await supabase
    .from("events")
    .select("id", { count: "exact", head: true })
    .in("team_id", teamIds)
    .gte("date", startOfLastWeek.toISOString().split("T")[0])
    .lt("date", startOfThisWeek.toISOString().split("T")[0]);

  /** ----------------- 2. Total Members ----------------- */
  const { data: allMembers } = await supabase
    .from("team_members")
    .select("user_id")
    .in("team_id", teamIds);

  const totalMembers = allMembers ? new Set(allMembers.map((m) => m.user_id)).size : 0;

  // New members this month vs last month
  const { data: currentMonthMembers } = await supabase
    .from("team_members")
    .select("user_id")
    .in("team_id", teamIds)
    .gte("joined_at", startOfThisMonth.toISOString());

  const { data: lastMonthMembers } = await supabase
    .from("team_members")
    .select("user_id")
    .in("team_id", teamIds)
    .gte("joined_at", startOfLastMonth.toISOString())
    .lt("joined_at", startOfThisMonth.toISOString());

  const totalMembersChange =
    (currentMonthMembers?.length || 0) - (lastMonthMembers?.length || 0);

  /** ----------------- 3. Contributions ----------------- */
  const eventIds = await getEventIds(teamIds);

  const { data: currentContributions } = await supabase
    .from("contributions")
    .select("amount, user_id")
    .eq("paid", true)
    .in("event_id", eventIds)
    .gte("created_at", startOfThisMonth.toISOString());

  const { data: lastContributions } = await supabase
    .from("contributions")
    .select("amount, user_id")
    .eq("paid", true)
    .in("event_id", eventIds)
    .gte("created_at", startOfLastMonth.toISOString())
    .lt("created_at", startOfThisMonth.toISOString());

  const currentCollected =
    currentContributions?.reduce((acc, c) => acc + Number(c.amount || 0), 0) || 0;

  const lastCollected =
    lastContributions?.reduce((acc, c) => acc + Number(c.amount || 0), 0) || 0;

  const collectedChange = currentCollected - lastCollected;

  /** ----------------- 4. Participation ----------------- */
  const currentUniquePayers = currentContributions
    ? new Set(currentContributions.map((c) => c.user_id)).size
    : 0;

  const lastUniquePayers = lastContributions
    ? new Set(lastContributions.map((c) => c.user_id)).size
    : 0;

  const currentParticipation = totalMembers > 0
    ? Math.round((currentUniquePayers / totalMembers) * 100)
    : 0;

  const lastParticipation = totalMembers > 0
    ? Math.round((lastUniquePayers / totalMembers) * 100)
    : 0;

  const participationChange = currentParticipation - lastParticipation;

  /** ----------------- 5. Return ----------------- */
  return {
    activeEvents: currentWeekEvents || 0,
    activeEventsChange: `${((currentWeekEvents || 0) - (lastWeekEvents || 0)) >= 0 ? "+" : ""}${(currentWeekEvents || 0) - (lastWeekEvents || 0)} this week`,
    totalMembers,
    totalMembersChange: `${totalMembersChange >= 0 ? "+" : ""}${totalMembersChange} this month`,
    collected: formatCurrency(currentCollected, teamCurrency),
    collectedChange: `${collectedChange >= 0 ? "+" : ""}${formatCurrency(collectedChange, teamCurrency)}`,
    participation: `${currentParticipation}%`,
    participationChange: `${participationChange >= 0 ? "+" : ""}${participationChange}%`,
  };
}

function defaultStats(currency: string) {
  return {
    activeEvents: 0,
    activeEventsChange: "+0 this week",
    totalMembers: 0,
    totalMembersChange: "+0 this month",
    collected: formatCurrency(0, currency),
    collectedChange: `+${formatCurrency(0, currency)}`,
    participation: "0%",
    participationChange: "+0%",
  };
}

function getStartOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust to Monday
  return new Date(d.setDate(diff));
}

function getMonthRanges() {
  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return { startOfThisMonth, startOfLastMonth };
}

async function getEventIds(teamIds: string[]) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("id")
    .in("team_id", teamIds);
  return data?.map((e) => e.id) || [];
}
