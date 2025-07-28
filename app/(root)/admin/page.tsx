import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { adminGetStats } from "@/lib/actions/admin/stats";
import { adminListUsers } from "@/lib/actions/admin/users";
import { adminListTeams } from "@/lib/actions/admin/teams";
import AdminPanelClient from "./_components/AdminPanelClient";
import { isSystemAdmin } from "@/lib/queries/admin/is-system-admin";
import { adminListEvents } from "@/lib/actions/admin/events";
import { adminListContributions } from "@/lib/queries/admin/contributions";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) redirect("/auth/login");

  try {
    await isSystemAdmin(user.id);
  } catch {
    redirect("/dashboard");
  }

  const [stats, users, teams, events, contributions] = await Promise.all([
    adminGetStats(),
    adminListUsers(user.id),
    adminListTeams(user.id),
    adminListEvents(user.id),
    adminListContributions(user.id),
  ]);

  return (
    <AdminPanelClient
      currentUserId={user.id}
      stats={stats}
      users={users}
      teams={teams}
      events={events}
      contributions={contributions}
    />
  );
}
