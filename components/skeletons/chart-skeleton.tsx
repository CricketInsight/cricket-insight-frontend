import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface ChartSkeletonProps {
  title?: boolean
  height?: number
  showLegend?: boolean
}

export function ChartSkeleton({ title = true, height = 300, showLegend = false }: ChartSkeletonProps) {
  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        {title && (
          <div className="flex items-center gap-2">
            <Skeleton className="w-5 h-5 bg-white/20" />
            <Skeleton className="h-6 w-48 bg-white/20" />
          </div>
        )}
        <Skeleton className="h-4 w-64 bg-white/20" />
      </CardHeader>
      <CardContent>
        {showLegend && (
          <div className="flex gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Skeleton className="w-3 h-3 rounded-full bg-white/20" />
              <Skeleton className="h-3 w-16 bg-white/20" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="w-3 h-3 rounded-full bg-white/20" />
              <Skeleton className="h-3 w-16 bg-white/20" />
            </div>
          </div>
        )}
        <div className="relative" style={{ height }}>
          {/* Chart area skeleton */}
          <Skeleton className="w-full h-full bg-white/20" />

          {/* Simulated chart elements */}
          <div className="absolute inset-4 flex items-end justify-between">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="w-8 bg-white/30" style={{ height: `${Math.random() * 60 + 20}%` }} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
