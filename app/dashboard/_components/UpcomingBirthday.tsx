"use client"

import React from 'react'
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from 'next/navigation';

const UpcomingBirthday = () => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "active": return "bg-green-100 text-green-800";
            case "planning": return "bg-blue-100 text-blue-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "active": return "On going";
            case "planning": return "Plan";
            default: return "Done";
        }
    };

    // Mock data untuk upcoming birthdays
    const upcomingBirthdays = [
        { id: 1, name: "Sarah Wijaya", date: "2024-01-15", daysLeft: 3, team: "Marketing", status: "active" },
        { id: 2, name: "Ahmad Fadli", date: "2024-01-20", daysLeft: 8, team: "Engineering", status: "planning" },
        { id: 3, name: "Lisa Chen", date: "2024-01-25", daysLeft: 13, team: "Design", status: "planning" },
    ];
    return (
        <div>

            <Card className="rounded-2xl" style={{ boxShadow: "var(--soft-shadow)" }}>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                🎂 Upcoming birthday
                            </CardTitle>
                            <CardDescription>
                                Event to be prepared
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {upcomingBirthdays.map((birthday) => (
                        <div key={birthday.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                            onClick={() => redirect(`/event/${birthday.id}`)}>
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                                    🎉
                                </div>
                                <div>
                                    <h3 className="font-semibold">{birthday.name}</h3>
                                    <p className="text-sm text-muted-foreground">Tim {birthday.team}</p>
                                    <p className="text-xs text-muted-foreground">{new Date(birthday.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                            </div>
                            <div className="text-right space-y-2">
                                <Badge className={getStatusColor(birthday.status)}>
                                    {getStatusText(birthday.status)}
                                </Badge>
                                <p className="text-sm font-semibold text-primary">
                                    {birthday.daysLeft} hari lagi
                                </p>
                            </div>
                        </div>
                    ))}

                    {upcomingBirthdays.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            <div className="text-6xl mb-4">🎂</div>
                            <p>Tidak ada ulang tahun dalam waktu dekat</p>
                            <p className="text-sm">Event baru akan muncul otomatis sesuai tanggal lahir anggota</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default UpcomingBirthday