"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { AdminContributionRow } from "@/lib/types/shared.types";
import { isSystemAdmin } from "./is-system-admin";

export async function adminListContributions(currentUserId: string): Promise<AdminContributionRow[]> {
  await isSystemAdmin(currentUserId);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contributions")
    .select(`
      id,
      event_id,
      user_id,
      amount,
      paid,
      created_at,
      users ( name ),
      events ( date )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as unknown as AdminContributionRow[];
}

export async function adminUpdateContribution(
  currentUserId: string,
  contributionId: string,
  patch: Partial<{ amount: number; paid: boolean }>
) {
  await assertIsAdmin(currentUserId);

  const supabase = await createClient();
  const { error } = await supabase
    .from("contributions")
    .update(patch)
    .eq("id", contributionId);
  if (error) throw error;

  revalidatePath("/admin");
}

export async function adminDeleteContribution(currentUserId: string, contributionId: string) {
  await isSystemAdmin(currentUserId);

  const supabase = await createClient();
  const { error } = await supabase.from("contributions").delete().eq("id", contributionId);
  if (error) throw error;

  revalidatePath("/admin");
}
