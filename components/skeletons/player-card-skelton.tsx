import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function PlayerCardSkeleton() {
  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-500">
      <CardHeader className="text-center">
        <div className="flex flex-col items-center gap-4">
          {/* Avatar skeleton */}
          <Skeleton className="w-24 h-24 rounded-full bg-white/20" />

          <div className="space-y-2 w-full">
            {/* Name skeleton */}
            <Skeleton className="h-6 w-32 mx-auto bg-white/20" />

            {/* Country and role skeleton */}
            <div className="flex items-center justify-center gap-2">
              <Skeleton className="h-4 w-8 bg-white/20" />
              <Skeleton className="h-4 w-24 bg-white/20" />
            </div>

            {/* Badges skeleton */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Skeleton className="h-5 w-16 rounded-full bg-white/20" />
              <Skeleton className="h-5 w-20 rounded-full bg-white/20" />
              <Skeleton className="h-5 w-14 rounded-full bg-white/20" />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats skeleton */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="space-y-1">
            <Skeleton className="h-8 w-12 mx-auto bg-white/20" />
            <Skeleton className="h-3 w-16 mx-auto bg-white/20" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-8 w-12 mx-auto bg-white/20" />
            <Skeleton className="h-3 w-16 mx-auto bg-white/20" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-8 w-12 mx-auto bg-white/20" />
            <Skeleton className="h-3 w-16 mx-auto bg-white/20" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-8 w-12 mx-auto bg-white/20" />
            <Skeleton className="h-3 w-16 mx-auto bg-white/20" />
          </div>
        </div>

        {/* Action button skeleton */}
        <Skeleton className="h-9 w-full bg-white/20" />
      </CardContent>
    </Card>
  )
}
