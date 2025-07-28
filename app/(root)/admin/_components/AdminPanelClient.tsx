"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Users, Calendar, DollarSign } from "lucide-react";
import AdminStats from "./AdminStats";
import UsersTable from "./UsersTable";
import { 
  AdminStats as AdminStatsType, 
  AdminUserRow,
  AdminTeamRow,
  AdminEventRow,
  AdminContributionRow,
} from "@/lib/types/shared.types";
import TeamsTable from "./TeamsTable";
import EventsTable from "./EventsTable";
import ContributionsTable from "./ContributionsTable";

type Props = {
  currentUserId: string;
  stats: AdminStatsType;
  users: AdminUserRow[];
  teams: AdminTeamRow[];
  events: AdminEventRow[];
  contributions: AdminContributionRow[];
};

export default function AdminPanelClient({
  currentUserId,
  stats,
  users,
  teams,
  events,
  contributions,
}: Props) {
  return (
    <div className="container max-w-7xl mx-auto space-y-6 py-6">
      <AdminStats stats={stats} />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" /> Database Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="users">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" /> Users
              </TabsTrigger>
              <TabsTrigger value="teams">Teams</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="contributions">Contributions</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="mt-6">
              <UsersTable currentUserId={currentUserId} users={users} />
            </TabsContent>

            <TabsContent value="teams" className="mt-6">
              <TeamsTable currentUserId={currentUserId} teams={teams} />
            </TabsContent>

            <TabsContent value="events" className="mt-6">
              <EventsTable currentUserId={currentUserId} events={events} />
            </TabsContent>

            <TabsContent value="contributions" className="mt-6">
              <ContributionsTable
                currentUserId={currentUserId}
                contributions={contributions}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
