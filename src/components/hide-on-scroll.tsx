"use client"

import React, { useEffect, useRef, useState } from "react"

interface Props {
  children: React.ReactNode
  /** number of pixels from top to consider "at top" (default 10) */
  offset?: number
  className?: string
}

export default function HideOnScroll({ children, offset = 10, className = "" }: Props) {
  const [visible, setVisible] = useState(true)
  const ticking = useRef(false)

  useEffect(() => {
    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          setVisible(window.scrollY < offset)
          ticking.current = false
        })
        ticking.current = true
      }
    }

    // initial state
    setVisible(typeof window !== "undefined" ? window.scrollY < offset : true)

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [offset])

  // animations: slide up & fade out when hidden
  return (
    <div
      className={`${className} transition-all duration-200 ease-in-out overflow-hidden`}
      style={{
        height: visible ? "auto" : "0px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-4px)",
      }}
    >
      {children}
    </div>
  )
}