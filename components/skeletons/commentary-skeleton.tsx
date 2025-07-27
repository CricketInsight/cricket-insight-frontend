import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function CommentarySkeleton() {
  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="w-5 h-5 bg-white/20" />
          <Skeleton className="h-6 w-32 bg-white/20" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex gap-3 p-3 rounded-lg border-l-4 border-l-white/20 bg-white/5">
              {/* Commentary icon skeleton */}
              <Skeleton className="w-6 h-6 rounded bg-white/20" />

              <div className="flex-1 space-y-2">
                {/* Over and runs badges skeleton */}
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-8 rounded bg-white/20" />
                  <Skeleton className="h-4 w-12 rounded bg-white/20" />
                  <Skeleton className="h-3 w-16 bg-white/20 ml-auto" />
                </div>

                {/* Commentary text skeleton */}
                <div className="space-y-1">
                  <Skeleton className="h-4 w-full bg-white/20" />
                  <Skeleton className="h-4 w-3/4 bg-white/20" />
                </div>

                {/* Player names skeleton */}
                <Skeleton className="h-3 w-32 bg-white/20" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
