import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function InsightSkeleton() {
  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="w-5 h-5 bg-white/20" />
          <Skeleton className="h-6 w-32 bg-white/20" />
        </div>
        <Skeleton className="h-4 w-48 bg-white/20" />
      </CardHeader>
      <CardContent className="space-y-4">
        {/* AI insight content skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full bg-white/20" />
          <Skeleton className="h-4 w-5/6 bg-white/20" />
          <Skeleton className="h-4 w-4/5 bg-white/20" />
        </div>

        {/* Key metrics skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="text-center space-y-1">
              <Skeleton className="h-8 w-12 mx-auto bg-white/20" />
              <Skeleton className="h-3 w-16 mx-auto bg-white/20" />
            </div>
          ))}
        </div>

        {/* Action buttons skeleton */}
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24 bg-white/20" />
          <Skeleton className="h-8 w-20 bg-white/20" />
        </div>
      </CardContent>
    </Card>
  )
}
