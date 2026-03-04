import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="p-8 space-y-4">
      <div className="flex items-center space-y-2">
        <Skeleton className="h-12 w-12 rounded-full animate-pulse" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px] animate-pulse" />
          <Skeleton className="h-4 w-[250px] animate-pulse" />
        </div>
      </div>
      <Skeleton className="h-[400px] w-full rounded-xl animate-pulse" />
    </div>
  )
}