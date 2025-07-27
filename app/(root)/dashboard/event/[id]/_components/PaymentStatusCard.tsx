"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { PaymentStatusProps } from "@/lib/types/shared.types";
import { formatCurrency } from "@/lib/currency";

export default function PaymentStatusCard({
  participants,
  paidCount,
  totalAmount,
  collectedAmount,
  onTogglePaid,
  currency,
  disabled = false,
}: PaymentStatusProps) {
  const progressPercentage = useMemo(
    () => (totalAmount === 0 ? 0 : Math.round((collectedAmount / totalAmount) * 100)),
    [collectedAmount, totalAmount]
  );

  return (
    <Card className="rounded-2xl lg:col-span-2" style={{ boxShadow: "var(--soft-shadow)" }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Contributions
        </CardTitle>
        <CardDescription>
          {disabled
            ? "Updates are disabled for this event"
            : `${paidCount} of ${participants.length} members have paid`}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="font-semibold">
              {formatCurrency(collectedAmount, currency)} / {formatCurrency(totalAmount, currency)}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">
            {progressPercentage}% collected
          </p>
        </div>

        {/* List */}
        <div className="space-y-2">
          {participants.map((p) => (
            <div
              key={p.user_id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold">
                  {(p.users?.name ?? "U")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="font-medium text-sm">{p.users?.name ?? "Unknown"}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(Number(p.amount), currency)}
                  </p>
                </div>
              </div>

              <Button
                size="sm"
                variant={p.paid ? "default" : "outline"}
                onClick={() => !disabled && onTogglePaid(p.user_id)}
                className="rounded-full disabled:opacity-50"
                disabled={disabled}
              >
                {p.paid ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" /> Paid
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-1" /> Not yet
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
