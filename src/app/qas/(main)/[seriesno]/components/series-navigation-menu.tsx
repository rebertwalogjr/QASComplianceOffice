"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function SeriesNavigationMenu() {

  const tabs = [
    { key: "details", title: "Details" },
    { key: "audit", title: "Audit Trail" },
    { key: "update", title: "Update Trail" },
    { key: "review", title: "Review Trail" },
  ]

  const [activeTab, setActiveTab] = useState({ key: "details", title: "Details" })

  return (
    <div className="bg-background border-b flex items-center px-4 overflow-x-auto flex-nowrap whitespace-nowrap gap-2 scrollbar-hide">
      <nav className="flex gap-2">
        {tabs.map((tab) => (
          <Button key={tab.key}
            // variant={activeTab.key === tab.key ? "default" : "ghost"}
            variant="ghost"
            onClick={() => setActiveTab(tab)}
            className={`relative hover:bg-transparent h-12 group ${activeTab.key === tab.key
              ? "text-primary"
              : "text-muted-foreground hover:text-muted-foreground"}`}
          >
            {tab.title}
            <span className={`absolute left-0 bottom-0 w-full h-0.5 rounded ${ activeTab.key === tab.key ? "bg-primary" : "group-hover:bg-muted"}`}></span>
          </Button>
        ))}
      </nav>
    </div>
  )
}