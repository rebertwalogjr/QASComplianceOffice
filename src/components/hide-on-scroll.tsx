"use client"

import React, { useEffect, useRef, useState } from "react"

interface Props {
  children: React.ReactNode
  /** number of pixels from top to consider "at top" (default 10) */
  offset?: number // when to hide
  revealOffset?: number // when to show
  className?: string,
}
export default function HideOnScroll({ children, offset = 40, revealOffset = 10, className = "" }: Props) {
  const [visible, setVisible] = useState(true)
  const [maxHeight, setMaxHeight] = useState("0px")
  const containerRef = useRef<HTMLDivElement>(null)
  const ticking = useRef(false)

  // Measure content height
  useEffect(() => {
    if (containerRef.current) {
      const naturalHeight = containerRef.current.scrollHeight
      setMaxHeight(naturalHeight + "px")
    }
  }, [children])

  useEffect(() => {
    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY
          let newVisible = visible
          if (y > offset) newVisible = false
          if (y < revealOffset) newVisible = true

          // Dispatch custom event when visibility changes
          if (newVisible != visible) {
            setVisible(newVisible)
            window.dispatchEvent(
              new CustomEvent("seriesTitleVisibility", {
                detail: { visible: newVisible }
              })
            )
          }

          // return newVisible

          ticking.current = false
        })
        // ticking.current = true
      }
    }

    // initial state
    setVisible(typeof window !== "undefined" ? window.scrollY < offset : true)

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [offset, revealOffset, visible])

  // animations: slide up & fade out when hidden
  return (
    <div
      className={`${className} transition-all duration-300 ease-in-out overflow-hidden`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-6px)",
        height: visible ? maxHeight : "0px",
      }}
      ref={containerRef}
    >
      {children}
    </div>
  )
}