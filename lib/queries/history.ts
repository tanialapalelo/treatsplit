import { createClient } from "@/lib/supabase/server";
import { EventHistoryRow } from "../types/shared.types";

export async function getEventHistory(teamIds: string[]) {
  if (!teamIds || teamIds.length === 0) return [];

  const supabase = await createClient();

  const { data: events, error } = await supabase
    .from("events")
    .select(
      `
        id,
        date,
        note,
        status,
        teams ( name ),
        birthday_person:users!events_birthday_person_id_fkey ( name ),
        contributions ( amount, paid ),
        food_options ( id, title, votes ( id ) )
      `
    )
    .in("team_id", teamIds)
    .order("date", { ascending: false })
    .returns<EventHistoryRow[]>();

  if (error) throw error;

  return events.map((e) => {
    const rawStatus = e.status || "planning";
    const statusMap: Record<string, string> = {
      planning: "upcoming",
      active: "upcoming",
      done: "completed",
      cancelled: "cancelled",
    };
    const status = statusMap[rawStatus] || rawStatus;

    const participants = e.contributions?.length || 0;
    const totalAmount =
      e.contributions?.filter((c) => c.paid).reduce((sum, c) => sum + Number(c.amount), 0) || 0;

    const participationRate =
      participants > 0
        ? Math.round((e.contributions.filter((c) => c.paid).length / participants) * 100)
        : 0;

    // Find food with highest votes
    const topFood =
      e.food_options && e.food_options.length > 0
        ? [...e.food_options]
            .map((f) => ({ ...f, voteCount: f.votes?.length || 0 }))
            .sort((a, b) => b.voteCount - a.voteCount)[0]?.title
        : "-";

    return {
      id: e.id,
      celebrant: e.birthday_person?.name || "Unknown",
      team: e.teams?.name || "Unknown",
      date: e.date,
      status,
      totalAmount,
      participants,
      participationRate,
      foodChoice: topFood,
    };
  });
}
