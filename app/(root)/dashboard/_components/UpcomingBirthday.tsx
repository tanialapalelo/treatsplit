"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";

export default function UpcomingBirthday({ data }: { data: any[] }) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "active": return "bg-green-100 text-green-800";
            case "planning": return "bg-blue-100 text-blue-800";
            case "done": return "bg-gray-200 text-gray-700";
            case "cancelled": return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "active": return "On Going";
            case "planning": return "Plan";
            case "done": return "Done";
            case "cancelled": return "Cancelled";
            default: return "Unknown";
        }
    };

    return (
        <Card className="rounded-2xl" style={{ boxShadow: "var(--soft-shadow)" }}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">🎂 Upcoming birthday</CardTitle>
                        <CardDescription>Event to be prepared</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {data.length > 0 ? (
                    data.map((birthday) => (
                        <div
                            key={birthday.id}
                            className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                            onClick={() => redirect(`/dashboard/event/${birthday.id}`)}
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                                    🎉
                                </div>
                                <div>
                                    <h3 className="font-semibold">{birthday.name}</h3>
                                    <p className="text-sm text-muted-foreground">Team: {birthday.team}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(birthday.date).toLocaleDateString("id-ID", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right space-y-2">
                                <Badge className={getStatusColor(birthday.status)}>
                                    {getStatusText(birthday.status)}
                                </Badge>
                                <p className="text-sm font-semibold text-primary">
                                    within {birthday.daysLeft} days
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        <div className="text-6xl mb-4">🎂</div>
                        <p>No birthdays coming up</p>
                        <p className="text-sm">
                            New events will appear automatically according to the member's birth date.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
