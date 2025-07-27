import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function MatchCardSkeleton() {
  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-500">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {/* Status badge skeleton */}
            <Skeleton className="h-5 w-12 rounded-full bg-white/20" />
            {/* Format badge skeleton */}
            <Skeleton className="h-5 w-8 rounded bg-white/20" />
          </div>
          <div className="text-right space-y-1">
            {/* Date and time skeleton */}
            <Skeleton className="h-3 w-16 bg-white/20" />
            <Skeleton className="h-3 w-12 bg-white/20" />
          </div>
        </div>
        {/* Series title skeleton */}
        <Skeleton className="h-4 w-48 bg-white/20" />
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Teams and Scores */}
        <div className="space-y-3">
          {/* Team 1 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded bg-white/20" />
              <Skeleton className="h-4 w-20 bg-white/20" />
            </div>
            <div className="text-right space-y-1">
              <Skeleton className="h-6 w-16 bg-white/20" />
              <Skeleton className="h-3 w-12 bg-white/20" />
            </div>
          </div>

          {/* Team 2 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded bg-white/20" />
              <Skeleton className="h-4 w-20 bg-white/20" />
            </div>
            <div className="text-right space-y-1">
              <Skeleton className="h-6 w-16 bg-white/20" />
              <Skeleton className="h-3 w-12 bg-white/20" />
            </div>
          </div>
        </div>

        {/* Match Result */}
        <Skeleton className="h-12 w-full rounded-lg bg-white/20" />

        {/* Match Details */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-full bg-white/20" />
          <Skeleton className="h-3 w-3/4 bg-white/20" />
          <Skeleton className="h-3 w-2/3 bg-white/20" />
        </div>

        {/* Highlights */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-24 bg-white/20" />
          <div className="flex flex-wrap gap-1">
            <Skeleton className="h-4 w-16 rounded-full bg-white/20" />
            <Skeleton className="h-4 w-20 rounded-full bg-white/20" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-8 flex-1 bg-white/20" />
          <Skeleton className="h-8 w-16 bg-white/20" />
        </div>
      </CardContent>
    </Card>
  )
}
