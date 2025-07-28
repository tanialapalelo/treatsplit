"use client";

import { useState } from "react";
import { Search, Filter, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function HistoryList({ data }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const router = useRouter();

    const filteredEvents = data.filter((event) => {
        const matchesSearch =
            event.celebrant.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.team.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === "all" || event.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            case "upcoming":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" onClick={() => router.push("/dashboard")}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">History of Birthday 🎉</h1>
                    <p className="text-muted-foreground">Checkout all the history of all events</p>
                </div>
            </div>

            {/* Filters */}
            <Card className="rounded-2xl" style={{ boxShadow: "var(--soft-shadow)" }}>
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Find by name or team..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 rounded-full"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-3 py-2 rounded-full border border-input bg-background"
                            >
                                <option value="all">All Status</option>
                                <option value="completed">Done</option>
                                <option value="upcoming">Upcoming</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-2xl" style={{ boxShadow: "var(--soft-shadow)" }}>
                <CardContent className="space-y-4">
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map((event) => (
                            <div
                                key={event.id}
                                className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                                        {event.status === "completed"
                                            ? "🎉"
                                            : event.status === "cancelled"
                                            ? "❌"
                                            : "⏳"}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{event.celebrant}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Tim {event.team}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(event.date).toLocaleDateString("id-ID", {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right space-y-1">
                                    <Badge className={getStatusColor(event.status)}>
                                        {event.status}
                                    </Badge>

                                    {event.status === "completed" && (
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold">
                                                Rp {event.totalAmount.toLocaleString("id-ID")}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {event.participants} orang •{" "}
                                                {event.participationRate}%
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {event.foodChoice}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <div className="text-6xl mb-4">📊</div>
                            <p>No history for any events</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
