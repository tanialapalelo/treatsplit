"use client";

import { useState, useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Calendar, DollarSign, ArrowLeft } from "lucide-react";
import { createEvent } from "@/lib/actions/createEvent";

const eventSchema = z.object({
  title: z.string().min(3, "Title must be longer than 3 characters"),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  amount: z.string().refine((val) => !isNaN(Number(val)), "Must be a number"),
  teamId: z.string().min(1, "Select a team"),
  birthdayPersonId: z.string().min(1, "Select the birthday person"),
  participantIds: z.array(z.string()).min(1, "Select at least 1 participant"),
  foodOptions: z.array(z.string()).min(1, "Add at least 1 food option"),
});

type EventFormData = z.infer<typeof eventSchema>;

export default function EventForm({
  teams,
  teamMembers,
}: {
  teams: { id: string; name: string }[];
  teamMembers: { id: string; name: string; team: string }[];
}) {
  const router = useRouter();
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [foodOptions, setFoodOptions] = useState<string[]>([]);
  const [foodInput, setFoodInput] = useState("");

  const { register, handleSubmit, setValue, watch } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: { participantIds: [], foodOptions: [] },
  });

  const birthdayPersonId = watch("birthdayPersonId");

  // Remove birthday person from selected participants
  useEffect(() => {
    if (birthdayPersonId) {
      setSelectedMembers((prev) => {
        const updated = prev.filter((id) => id !== birthdayPersonId);
        setValue("participantIds", updated);
        return updated;
      });
    }
  }, [birthdayPersonId, setValue]);

  const onSubmit = async (data: EventFormData) => {
    try {
      const res = await createEvent({
        ...data,
        amount: Number(data.amount),
      });
      if (res.success) {
        toast("🎉 Event has been successfully created!");
        router.push("/dashboard");
      }
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const handleMemberToggle = (id: string) => {
    if (id === birthdayPersonId) return; // prevent adding birthday person
    const updated = selectedMembers.includes(id)
      ? selectedMembers.filter((m) => m !== id)
      : [...selectedMembers, id];
    setSelectedMembers(updated);
    setValue("participantIds", updated);
  };

  const addFoodOption = () => {
    if (foodInput.trim() && !foodOptions.includes(foodInput.trim())) {
      const updated = [...foodOptions, foodInput.trim()];
      setFoodOptions(updated);
      setValue("foodOptions", updated);
      setFoodInput("");
    }
  };

  const removeFoodOption = (food: string) => {
    const updated = foodOptions.filter((f) => f !== food);
    setFoodOptions(updated);
    setValue("foodOptions", updated);
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => redirect("/dashboard")}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Create a New Event</h1>
            <p className="text-muted-foreground">Manage celebrations for your team</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Event Details */}
          <Card className="border-primary/20 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Event Details
              </CardTitle>
              <CardDescription>Basic information about the event</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <Label>Event Title</Label>
              <Input {...register("title")} placeholder="Tania's Birthday" />
              <Label>Description</Label>
              <Textarea
                {...register("description")}
                placeholder="Celebration for Tania's birthday..."
              />
              <Label>Event Date</Label>
              <Input type="date" {...register("date")} />
              <Label>Target Contribution</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-10" placeholder="50000" {...register("amount")} />
              </div>
              <Label>Team</Label>
              <Select onValueChange={(val) => setValue("teamId", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Label>Who is the birthday person?</Label>
              <Select onValueChange={(val) => setValue("birthdayPersonId", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a person" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Participants */}
          <Card className="border-primary/20 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-secondary/10 to-primary/10">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Select Participants
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const allExceptBirthday = teamMembers
                    .filter((m) => m.id !== birthdayPersonId)
                    .map((m) => m.id);
                  setSelectedMembers(allExceptBirthday);
                  setValue("participantIds", allExceptBirthday);
                }}
              >
                Select All
              </Button>
              {teamMembers.map((m) => (
                <div
                  key={m.id}
                  className={`p-3 border rounded-lg cursor-pointer ${
                    selectedMembers.includes(m.id)
                      ? "bg-primary/5 border-primary"
                      : "hover:border-primary/50"
                  } ${m.id === birthdayPersonId ? "opacity-50 pointer-events-none" : ""}`}
                  onClick={() => handleMemberToggle(m.id)}
                >
                  {m.name} {m.id === birthdayPersonId && "(Birthday)"}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Food Options */}
        <Card className="border-primary/20 shadow-lg mt-6">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-sm">
            <CardTitle className="flex items-center gap-2">🍽️ Food Options</CardTitle>
            <CardDescription>Add food options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 mt-4">
              <Input
                value={foodInput}
                onChange={(e) => setFoodInput(e.target.value)}
                placeholder="e.g. Pizza"
              />
              <Button type="button" onClick={addFoodOption}>
                Add
              </Button>
            </div>
            {foodOptions.length > 0 && (
              <ul className="space-y-2">
                {foodOptions.map((food) => (
                  <li
                    key={food}
                    className="flex items-center justify-between border p-2 rounded-md"
                  >
                    {food}
                    <Button variant="destructive" size="sm" onClick={() => removeFoodOption(food)}>
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end my-6">
          <Button type="submit" className="bg-gradient-to-r from-primary to-secondary">
            Create Event
          </Button>
        </div>
      </form>
    </div>
  );
}
