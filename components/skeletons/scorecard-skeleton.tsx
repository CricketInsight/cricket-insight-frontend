import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ScorecardSkeleton() {
  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="w-5 h-5 bg-white/20" />
          <Skeleton className="h-6 w-24 bg-white/20" />
        </div>
      </CardHeader>
      <CardContent>
        {/* Tabs skeleton */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Skeleton className="h-8 bg-white/20" />
          <Skeleton className="h-8 bg-white/20" />
        </div>

        {/* Table skeleton */}
        <div className="space-y-3">
          {/* Table header */}
          <div className="grid grid-cols-6 gap-4">
            <Skeleton className="h-4 bg-white/20" />
            <Skeleton className="h-4 bg-white/20" />
            <Skeleton className="h-4 bg-white/20" />
            <Skeleton className="h-4 bg-white/20" />
            <Skeleton className="h-4 bg-white/20" />
            <Skeleton className="h-4 bg-white/20" />
          </div>

          {/* Table rows */}
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="grid grid-cols-6 gap-4">
              <Skeleton className="h-4 bg-white/20" />
              <Skeleton className="h-4 bg-white/20" />
              <Skeleton className="h-4 bg-white/20" />
              <Skeleton className="h-4 bg-white/20" />
              <Skeleton className="h-4 bg-white/20" />
              <Skeleton className="h-4 bg-white/20" />
            </div>
          ))}
        </div>

        {/* Collapsible sections skeleton */}
        <div className="mt-6 space-y-2">
          <Skeleton className="h-8 w-full bg-white/20" />
          <Skeleton className="h-8 w-full bg-white/20" />
        </div>
      </CardContent>
    </Card>
  )
}
