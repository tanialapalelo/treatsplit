"use client"

import { Button } from '@/components/ui/button'
import React from 'react'
import { redirect } from "next/navigation";

const Header = () => {
    
  return (
    <div className="flex justify-between items-center">
    <div>
      <h1 className="text-3xl font-bold">Welcome👋</h1>
      <p className="text-muted-foreground">Manage split birthday plan with your team easily</p>
    </div>
    <div className="mt-2 space-x-2">
      <Button onClick={() => redirect("/dashboard/event/create")} variant="outline" size="sm">
       ➕ Create Event
      </Button>
      <Button onClick={() => redirect("/dashboard/history")} variant="outline" size="sm">
        📊 History
      </Button>
    </div>
  </div>
  )
}

export default Header