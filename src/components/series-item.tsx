'use client'

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile";

type ItemGroupProps = React.ComponentProps<"div"> & {
  orientation?: "horizontal" | "vertical"
}


function SeriesContainer({ className, ...props} : React.ComponentProps<"div">){
  const isMobile = useIsMobile()
  return (
    <div
      data-slot=""
      className={cn(
        "w-full bg-background space-y-5 pb-8",
        className,
        isMobile ? "px-2 py-2" : "px-6 py-4"
      )}
      { ...props } 
    />
  )
}

function SeriesGroup({ 
  orientation,
  className,
  ...props
  } : ItemGroupProps){
  const isMobile = useIsMobile()
  const dir = orientation ?? (isMobile ? "vertical" : "horizontal")
  return (
    <div
      className={cn(
        "flex px-2",
        dir === "horizontal" ? "flex-row gap-8 items-center" :"flex-col gap-1 items-start",
        className
      )}
      { ...props } 
    />
  )
}

function SeriesTitle({ className, ...props} : React.ComponentProps<"div">){
  return(
    <div 
      className={cn(
        "flex w-fit items-center gap-2 text-lg leading-snug font-medium", className
      )}
      { ...props }
    />
  )
}

function SeriesLabel({ className, ...props} : React.ComponentProps<"div">){
  return(
    <div 
      className={cn(
        "w-2xs font-medium text-sm", className
      )}
      { ...props }
    />
  )
}

function SeriesDescription({ className, ...props} : React.ComponentProps<"div">){
  return(
    <div 
      className={cn(
        "font-normal text-muted-foreground text-sm", className
      )}
      { ...props }
    />
  )
}

function SeriesValue({ className, ...props} : React.ComponentProps<"div">){
  return(
    <div 
      className={cn(
        "text-sm", className
      )}
      { ...props }
    />
  )
}

const itemMediaVariants = cva(
  "flex shrink-0 items-center justify-center gap-2 group-has-[[data-slot=item-description]]/item:self-start [&_svg]:pointer-events-none group-has-[[data-slot=item-description]]/item:translate-y-0.5",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "size-8 border rounded-sm bg-muted [&_svg:not([class*='size-'])]:size-4",
        image:
          "size-10 rounded-sm overflow-hidden [&_img]:size-full [&_img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function SeriesMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof itemMediaVariants>) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(itemMediaVariants({ variant, className }))}
      {...props}
    />
  )
}

function SeriesHeader({ className, ...props} : React.ComponentProps<"div">){
  return(
    <div 
      className={cn(
        "flex gap-1 items-center h-10", className
      )}
      { ...props }
    />
  )
}

export {
  SeriesContainer,
  SeriesGroup,
  SeriesTitle,
  SeriesMedia,
  SeriesHeader,
  SeriesLabel,
  SeriesValue,
  SeriesDescription
}