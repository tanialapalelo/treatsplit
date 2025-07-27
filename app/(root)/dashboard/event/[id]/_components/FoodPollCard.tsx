"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FoodPollProps } from "@/lib/types/shared.types";


export default function FoodPollCard({
  foodPoll,
  userVote,
  totalVoters,
  onVote,
  disabled = false,
}: FoodPollProps) {
  const sortedFoods = [...foodPoll].sort((a, b) => b.votes.length - a.votes.length);
  const highestVotes = sortedFoods[0]?.votes.length || 0;
  const winners = sortedFoods.filter((f) => f.votes.length === highestVotes);

  const winnerText =
    highestVotes === 0
      ? "No votes"
      : winners.length > 1
        ? `Tie between ${winners.map((w) => w.title).join(" & ")}`
        : `${winners[0].title} won! 🏆`;

  return (
    <Card className="rounded-2xl" style={{ boxShadow: "var(--soft-shadow)" }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">🍽️ Food Polling</CardTitle>
        <CardDescription>
          {disabled ? "Voting is disabled for this event" : "Vote for food to celebrate the birthday"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {foodPoll.map((food) => {
          const votes = food.votes.length;
          const perc = totalVoters === 0 ? 0 : Math.round((votes / totalVoters) * 100);

          return (
            <div key={food.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{food.title}</span>
                <Badge variant="outline" className="rounded-full">
                  {votes} vote
                </Badge>
              </div>

              <Button
                variant={userVote === food.id ? "default" : "outline"}
                className="w-full rounded-full text-left justify-start disabled:opacity-50"
                disabled={disabled}
                onClick={() => !disabled && onVote(food.id)}
              >
                <div className="flex items-center justify-between w-full">
                  <span>
                    {disabled
                      ? "Voting disabled"
                      : userVote === food.id
                      ? "✅ Your choice"
                      : "Vote for this"}
                  </span>
                  <div className="text-xs text-muted-foreground">{perc}%</div>
                </div>
              </Button>

              {votes > 0 && (
                <div className="pl-3">
                  <Progress value={perc} className="h-1 mb-1" />
                  <div className="text-xs text-muted-foreground">
                    Voters: {food.votes.map((v) => v.users?.name ?? "Unknown").join(", ")}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {foodPoll.length > 0 && (
          <div className="mt-6 p-3 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-sm text-center">
              <strong>Current Result :</strong>
            </p>
            <p className="text-sm text-center text-primary font-semibold">{winnerText}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
