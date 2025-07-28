import { createClient } from "../supabase/server";
import { EventRow } from "../types/shared.types";

export async function getUpcomingBirthdays(teamIds: string[], daysAhead = 30) {
  if (!teamIds || teamIds.length === 0) return [];

  const supabase = await createClient();
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + daysAhead);

  const { data: events, error } = await supabase
    .from("events")
    .select(`
      id,
      date,
      note,
      status,
      teams ( name ),
      birthday_person:users!events_birthday_person_id_fkey ( name )
    `)
    .in("team_id", teamIds)
    .gte("date", today.toISOString().split("T")[0])
    .lte("date", maxDate.toISOString().split("T")[0])
    .order("date", { ascending: true });

  if (error) throw error;

  const typedEvents = (events ?? []) as unknown as EventRow[];

  return typedEvents.map((event) => ({
    ...event,
    name: event.birthday_person?.name || "Unknown",
    team: event.teams?.name || "Unknown",
    daysLeft: Math.ceil(
      (new Date(event.date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    ),
  }));
}

export async function getEventDetail(eventId: string) {
  const supabase = await createClient();

  const { data: event, error: eventErr } = await supabase
    .from("events")
    .select(`
      id,
      date,
      note,
      status,
      team_id,
      birthday_person_id,
      teams ( id, name, currency ),
      users!events_birthday_person_id_fkey ( id, name, birthday )
    `)
    .eq("id", eventId)
    .single();

  if (eventErr || !event) throw eventErr ?? new Error("Event not found");

  const { data: contributions, error: contrErr } = await supabase
    .from("contributions")
    .select(`
      user_id,
      amount,
      paid,
      users ( id, name )
    `)
    .eq("event_id", eventId);

  if (contrErr) throw contrErr;

  const { data: foodOptions, error: foodErr } = await supabase
    .from("food_options")
    .select("id, title")
    .eq("event_id", eventId);

  if (foodErr) throw foodErr;

  const foodOptionIds = foodOptions?.map((f) => f.id) ?? [];
  let votes: any[] = [];
  if (foodOptionIds.length > 0) {
    const { data: v, error: voteErr } = await supabase
      .from("votes")
      .select(`
        id,
        food_option_id,
        user_id,
        users ( id, name )
      `)
      .in("food_option_id", foodOptionIds);
    if (voteErr) throw voteErr;
    votes = v ?? [];
  }

  return {
    event: {
      ...event,
      team: event.teams,
      birthdayPerson: event.users,
    },
    contributions: contributions ?? [],
    food: (foodOptions ?? []).map((f) => ({
      ...f,
      votes: votes.filter((v) => v.food_option_id === f.id),
    })),
  };
}

