import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function ItineraryLoading() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <Skeleton className="h-8 w-3/4" />
      </header>

      {[...Array(2)].map((_, i) => (
        <div key={i} className="flex flex-col gap-4">
          <Skeleton className="h-6 w-1/4" />
          <div className="grid gap-4">
            {[...Array(2)].map((_, j) => (
              <Card key={j}>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-md" />
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="w-1/3 space-y-2">
                      <Skeleton className="h-6 w-1/2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                    <Skeleton className="h-4 w-8" />
                    <div className="w-1/3 space-y-2 items-end flex flex-col">
                      <Skeleton className="h-6 w-1/2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                  <div className="mt-4 border-t border-dashed pt-4 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
