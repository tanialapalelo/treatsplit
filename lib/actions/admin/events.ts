"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSystemAdmin } from "@/lib/queries/admin/is-system-admin";
import { AdminEventRow, EventStatus } from "@/lib/types/shared.types";

export async function adminListEvents(currentUserId: string): Promise<AdminEventRow[]> {
  await isSystemAdmin(currentUserId);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select(`
      id,
      title,
      date,
      status,
      note,
      team_id,
      created_at,
      teams ( name ),
      birthday_person:users!events_birthday_person_id_fkey ( name )
    `)
    .order("date", { ascending: false });

  if (error) throw error;
  return (data || []) as unknown as AdminEventRow[];
}

export async function adminUpdateEvent(
  currentUserId: string,
  eventId: string,
  patch: Partial<{ status: EventStatus; note: string | null; date: string; title: string }>
) {
  await isSystemAdmin(currentUserId);

  const supabase = await createClient();
  const { error } = await supabase.from("events").update(patch).eq("id", eventId);
  if (error) throw error;

  revalidatePath("/admin");
}

export async function adminDeleteEvent(currentUserId: string, eventId: string) {
  await isSystemAdmin(currentUserId);

  const supabase = await createClient();
  const { error } = await supabase.from("events").delete().eq("id", eventId);
  if (error) throw error;

  revalidatePath("/admin");
}
