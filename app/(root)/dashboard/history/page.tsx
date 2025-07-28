import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import HistoryList from "./_components/HistoryList";
import { getUserTeamIds } from "@/lib/queries/teams";
import { getEventHistory } from "@/lib/queries/history";

export default async function HistoryPage() {
  const supabase = await createClient();
  const { data: claims, error } = await supabase.auth.getClaims();
  if (error || !claims?.claims?.sub) redirect("/auth/login");

  const userId = claims.claims.sub;
  const teamId = await getUserTeamIds(userId);

  const history = await getEventHistory(teamId);

  return (
    <div className="p-4 space-y-6">
      <HistoryList data={history} />
    </div>
  );
}
