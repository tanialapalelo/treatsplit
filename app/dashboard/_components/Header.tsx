"use client"

import { Button } from '@/components/ui/button'
import React from 'react'
import { redirect } from "next/navigation";

const Header = () => {
    
  return (
    <div className="flex justify-between items-center">
    <div>
      <h1 className="text-3xl font-bold">Welcome, default 🎉</h1>
      <p className="text-muted-foreground">Manage split birthday plan with your team easily</p>
    </div>
    <div className="mt-2 space-x-2">
      <Button onClick={() => redirect("/history")} variant="outline" size="sm">
        📊 History
      </Button>
      <Button onClick={() => redirect("/analytics")} variant="outline" size="sm">
        📈 Analytics
      </Button>
      <Button onClick={() => redirect("/help")} variant="outline" size="sm">
        💬 Help
      </Button>
    </div>
  </div>
  )
}

export default Header