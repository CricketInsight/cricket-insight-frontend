import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function TeamCardSkeleton() {
  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-500">
      <CardHeader>
        <div className="flex items-center gap-4">
          {/* Team flag/logo skeleton */}
          <Skeleton className="w-16 h-16 rounded-full bg-white/20" />

          <div className="flex-1 space-y-2">
            {/* Team name skeleton */}
            <Skeleton className="h-6 w-32 bg-white/20" />

            {/* Rankings skeleton */}
            <div className="flex gap-2">
              <Skeleton className="h-4 w-16 rounded-full bg-white/20" />
              <Skeleton className="h-4 w-16 rounded-full bg-white/20" />
              <Skeleton className="h-4 w-16 rounded-full bg-white/20" />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats grid skeleton */}
        <div className="grid grid-cols-3 gap-4 text-center">
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

        {/* Captain and coach skeleton */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16 bg-white/20" />
            <Skeleton className="h-4 w-24 bg-white/20" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-12 bg-white/20" />
            <Skeleton className="h-4 w-20 bg-white/20" />
          </div>
        </div>

        {/* Action button skeleton */}
        <Skeleton className="h-9 w-full bg-white/20" />
      </CardContent>
    </Card>
  )
}
