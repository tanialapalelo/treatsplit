import { redirect } from "next/navigation";
import { getEventDetail } from "@/lib/queries/events";
import { createClient } from "@/lib/supabase/server";
import EventDetailClient from "./_components/EventDetailClient";

export default async function EventPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) redirect("/auth/login");

  const payload = await getEventDetail(params.id);

  return (
    <EventDetailClient
      event={payload.event}
      contributions={payload.contributions}
      food={payload.food}
      currentUserId={data.user.id}
    />
  );
}
