import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ComparisonResultLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="relative z-50">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-purple-900/90 to-slate-900/90 backdrop-blur-sm"></div>
        <div className="relative px-6 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-3">
              <Skeleton className="w-8 h-8 rounded bg-slate-700" />
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">CI</span>
              </div>
              <div>
                <Skeleton className="h-6 w-48 bg-slate-700 mb-1" />
                <Skeleton className="h-4 w-32 bg-slate-700" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <Skeleton className="h-6 w-48 bg-slate-700 mb-2" />
              <Skeleton className="h-4 w-64 bg-slate-700" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                    <div className="flex items-center space-x-3 mb-3">
                      <Skeleton className="w-12 h-12 rounded-full bg-slate-600" />
                      <div>
                        <Skeleton className="h-4 w-24 bg-slate-600 mb-1" />
                        <Skeleton className="h-3 w-16 bg-slate-600" />
                      </div>
                    </div>
                    <Skeleton className="h-5 w-20 bg-slate-600" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Skeleton className="h-10 w-full bg-slate-700 rounded" />

            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <Skeleton className="h-6 w-32 bg-slate-700" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <div key={j} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Skeleton className="h-4 w-24 bg-slate-700" />
                          <Skeleton className="h-4 w-12 bg-slate-700" />
                        </div>
                        <Skeleton className="h-2 w-full bg-slate-700 rounded-full" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
