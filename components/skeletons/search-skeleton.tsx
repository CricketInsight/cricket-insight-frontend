import { Skeleton } from "@/components/ui/skeleton"

export function SearchSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
          {/* Avatar skeleton */}
          <Skeleton className="w-12 h-12 rounded-full bg-white/20" />

          <div className="flex-1 space-y-2">
            {/* Name and flag skeleton */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-24 bg-white/20" />
              <Skeleton className="h-4 w-6 bg-white/20" />
            </div>

            {/* Details skeleton */}
            <Skeleton className="h-3 w-32 bg-white/20" />
          </div>

          {/* Badge skeleton */}
          <Skeleton className="h-5 w-8 rounded bg-white/20" />
        </div>
      ))}
    </div>
  )
}
