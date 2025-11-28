import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function PlayerCardSkeleton() {
  return (
    <Card className="bg-slate-800/50 dark:bg-slate-800/50 light:bg-white border-slate-700 dark:border-slate-700 light:border-slate-200">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Skeleton className="w-16 h-16 rounded-full bg-slate-700 dark:bg-slate-700 light:bg-slate-200" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24 bg-slate-700 dark:bg-slate-700 light:bg-slate-200" />
            <Skeleton className="h-3 w-16 bg-slate-700 dark:bg-slate-700 light:bg-slate-200" />
            <Skeleton className="h-5 w-20 bg-slate-700 dark:bg-slate-700 light:bg-slate-200" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Skeleton className="h-3 w-12 bg-slate-700 dark:bg-slate-700 light:bg-slate-200" />
            <Skeleton className="h-4 w-8 bg-slate-700 dark:bg-slate-700 light:bg-slate-200" />
          </div>
          <div className="flex justify-between items-center">
            <Skeleton className="h-3 w-16 bg-slate-700 dark:bg-slate-700 light:bg-slate-200" />
            <Skeleton className="h-4 w-10 bg-slate-700 dark:bg-slate-700 light:bg-slate-200" />
          </div>
          <div className="flex justify-between items-center">
            <Skeleton className="h-3 w-20 bg-slate-700 dark:bg-slate-700 light:bg-slate-200" />
            <Skeleton className="h-4 w-8 bg-slate-700 dark:bg-slate-700 light:bg-slate-200" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
