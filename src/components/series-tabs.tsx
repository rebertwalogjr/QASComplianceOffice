"use client"

import React, { createContext, useContext, useState} from "react"

interface TabsContextProps {
  activeTab: string,
  setActiveTab: (value: string) => void
}

interface SeriesTabsProps {
  defaultValue: string
  children: React.ReactNode
  className?: string
}

interface SeriesTabsTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
}

interface SeriesTabsContentProps {
  value: string
  children: React.ReactNode
  className?: string
}

const TabsContext = createContext<TabsContextProps | undefined>(undefined)

function useTabs() {
  const context = useContext(TabsContext)
  if (!context) throw new Error ("useTabs must be used within SeriesTabs")
  return context
}

function SeriesTabs({ defaultValue, children, className } : SeriesTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue)
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={`flex flex-col flex-1 ${ className }`}>{children}</div>
    </TabsContext.Provider>
  )
}

function SeriesTabsList({ children } : { children : React.ReactNode }){
  return (
    <div className="sticky top-16 border-b z-10 bg-background flex items-center overflow-x-auto flex-nowrap whitespace-nowrap gap-2 scrollbar-hide">
      <nav className="flex gap-4 px-4 md:px-8 md:gap-8">{ children }</nav>
    </div>
  )
}

function SeriesTabsTrigger({ value, children, className } : SeriesTabsTriggerProps){
  const { activeTab, setActiveTab } = useTabs()
  const isActive = activeTab === value
  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`relative hover:bg-transparent h-12 group font-semibold ${className} ${ isActive
              ? "text-primary"
              : "text-muted-foreground hover:text-muted-foreground"}`}
    >
      {children}
        <span className={`absolute left-0 bottom-0 w-full h-0.5 rounded ${ isActive ? "bg-primary" : "group-hover:bg-muted"}`}>
        </span>
      </button>
  )
}

function SeriesTabsContent({ value, children, className } : SeriesTabsContentProps) {
  const { activeTab } = useTabs()
  return (
    activeTab === value 
    ? <div className={`p-4 ${className}`}>{children}</div>
    : null
  )
}

export {
  SeriesTabs,
  SeriesTabsList,
  SeriesTabsTrigger,
  SeriesTabsContent
}