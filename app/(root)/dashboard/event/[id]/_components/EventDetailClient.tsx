"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Ban } from "lucide-react";
import EventInfoCard from "./EventInfoCard";
import PaymentStatusCard from "./PaymentStatusCard";
import FoodPollCard from "./FoodPollCard";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EventDetailProps } from "@/lib/types/shared.types";

export default function EventDetailClient({
  event,
  contributions,
  food,
  currentUserId,
}: EventDetailProps) {
  const router = useRouter();
  const supabase = createClient();

  const [participants, setParticipants] = useState(contributions);
  const [foodPoll, setFoodPoll] = useState(food);

  const userVote = useMemo(() => {
    const found = foodPoll
      .flatMap((f) => f.votes.map((v) => ({ foodId: f.id, ...v })))
      .find((v) => v.user_id === currentUserId);
    return found?.foodId ?? null;
  }, [foodPoll, currentUserId]);

  const daysLeft = useMemo(() => {
    const d = Math.ceil(
      (new Date(event.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return d;
  }, [event.date]);

  const totalTarget = useMemo(
    () => participants.reduce((sum, p) => sum + Number(p.amount ?? 0), 0),
    [participants]
  );
  const collectedAmount = useMemo(
    () => participants.filter((p) => p.paid).reduce((sum, p) => sum + Number(p.amount ?? 0), 0),
    [participants]
  );
  const paidCount = useMemo(() => participants.filter((p) => p.paid).length, [participants]);

  async function togglePaymentStatus(userId: string) {
    if (event.status === "cancelled" || event.status === "done") return;
    const current = participants.find((p) => p.user_id === userId);
    if (!current) return;
    const nextPaid = !current.paid;

    setParticipants((prev) =>
      prev.map((p) => (p.user_id === userId ? { ...p, paid: nextPaid } : p))
    );

    await supabase
      .from("contributions")
      .update({ paid: nextPaid })
      .match({ event_id: event.id, user_id: userId });
  }

  async function handleVote(foodId: string) {
    if (event.status === "cancelled" || event.status === "done") return;

    if (userVote === foodId) {
      setFoodPoll((prev) =>
        prev.map((f) =>
          f.id === foodId
            ? { ...f, votes: f.votes.filter((v) => v.user_id !== currentUserId) }
            : f
        )
      );

      await supabase.from("votes").delete().match({ food_option_id: foodId, user_id: currentUserId });
      return;
    }

    if (userVote) {
      setFoodPoll((prev) =>
        prev.map((f) =>
          f.id === userVote
            ? { ...f, votes: f.votes.filter((v) => v.user_id !== currentUserId) }
            : f
        )
      );

      await supabase.from("votes").delete().match({ food_option_id: userVote, user_id: currentUserId });
    }

    setFoodPoll((prev) =>
      prev.map((f) =>
        f.id === foodId
          ? { ...f, votes: [...f.votes, { user_id: currentUserId, users: { name: "You" } }] }
          : f
      )
    );

    await supabase.from("votes").insert({
      food_option_id: foodId,
      user_id: currentUserId,
    });
  }

  async function handleCancelEvent() {
    const { error } = await supabase
      .from("events")
      .update({ status: "cancelled" })
      .eq("id", event.id);

    if (error) {
      console.error("Failed to cancel event:", error);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">

      {event.status === "cancelled" && (
        <div className="p-4 rounded-lg bg-red-50 text-red-700 text-sm text-center">
          This event has been cancelled. No further actions are allowed.
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Birthday Event 🎉</h1>
            <p className="text-muted-foreground">Detail for split bill and food votes</p>
          </div>
        </div>

        {event.status !== "cancelled" && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                <Ban className="h-4 w-4" />
                Cancel Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cancel Event</DialogTitle>
                <DialogDescription>
                  Are you sure you want to cancel the event for <strong>{event.birthdayPerson?.name}</strong>?
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">No</Button>
                <Button variant="destructive" onClick={handleCancelEvent}>
                  Yes, cancel it
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <EventInfoCard
        celebrant={event.birthdayPerson?.name ?? "Unknown"}
        teamName={event.team?.name ?? "Unknown"}
        date={event.date}
        daysLeft={daysLeft}
        note={event.note}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PaymentStatusCard
          participants={participants}
          paidCount={paidCount}
          totalAmount={totalTarget}
          collectedAmount={collectedAmount}
          currency={event.team?.currency || "IDR"} // New
          onTogglePaid={togglePaymentStatus}
          eventId={event.id}
          disabled={event.status === "cancelled" || event.status === "done"}
        />
        <FoodPollCard
          foodPoll={foodPoll}
          userVote={userVote}
          totalVoters={participants.length}
          onVote={handleVote}
          disabled={event.status === "cancelled" || event.status === "done"}
        />
      </div>
    </div>
  );
}
