
"use client"

import React from 'react'
import { Calendar, Users, Gift, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const StatsGrid = () => {
    
  const stats = [
    { title: "Event Aktif", value: "2", icon: Calendar, change: "+1 minggu ini" },
    { title: "Total Anggota", value: "24", icon: Users, change: "+3 bulan ini" },
    { title: "Urunan Terkumpul", value: "Rp 850K", icon: Gift, change: "bulan ini" },
    { title: "Tingkat Partisipasi", value: "92%", icon: TrendingUp, change: "+5%" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="rounded-2xl" style={{ boxShadow: "var(--soft-shadow)" }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </div>
                <stat.icon className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
  )
}

export default StatsGrid