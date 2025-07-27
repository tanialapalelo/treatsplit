import EventForm from "@/components/forms/EventForm"
import { createClient } from "@/lib/supabase/server"

export default async function CreateEventPage() {
  const supabase = await createClient()
  const { data: teams } = await supabase.from("teams").select("id, name")
  const { data: members } = await supabase.from("users").select("id, name")

  return (
    <div>
      <EventForm teams={teams ?? []} teamMembers={members ?? []} />
    </div>
  )
}
