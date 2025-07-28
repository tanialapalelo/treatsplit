"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { AdminTeamRow, Currency } from "@/lib/types/shared.types";
import { isSystemAdmin } from "@/lib/queries/admin/is-system-admin";

export async function adminListTeams(currentUserId: string): Promise<AdminTeamRow[]> {
  await isSystemAdmin(currentUserId);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("teams")
    .select("id, name, currency, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function adminUpdateTeam(
  currentUserId: string,
  teamId: string,
  patch: Partial<{ name: string; currency: Currency }>
) {
  await isSystemAdmin(currentUserId);

  const supabase = await createClient();
  const { error } = await supabase.from("teams").update(patch).eq("id", teamId);
  if (error) throw error;

  revalidatePath("/admin");
}

export async function adminDeleteTeam(currentUserId: string, teamId: string) {
  await isSystemAdmin(currentUserId);

  const supabase = await createClient();
  const { error } = await supabase.from("teams").delete().eq("id", teamId);
  if (error) throw error;

  revalidatePath("/admin");
}
