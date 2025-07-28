
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import Header from "./_components/Header";
import StatsGrid from "./_components/StatsGrid";
import UpcomingBirthday from "./_components/UpcomingBirthday";
import { getUpcomingBirthdays } from "@/lib/queries/events";
import { getDashboardStats } from "@/lib/queries/stats";
import { getUserTeamIds } from "@/lib/queries/teams";

export default async function Dashboard() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  
  if (error || !data?.claims?.sub) {
    redirect("/auth/login");
  }

  const userId = data.claims.sub;
  const teamIds = await getUserTeamIds(userId);
  
  const upcoming = await getUpcomingBirthdays(teamIds);
  const stats = await getDashboardStats(teamIds);


  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-background p-4 space-y-6 font-jakarta animate-fade-in">
      <Header />
      <StatsGrid stats={stats} />
      <UpcomingBirthday data={upcoming} />
    </div>
  );
}
