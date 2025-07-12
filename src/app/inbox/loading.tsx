import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function InboxLoading() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <Skeleton className="h-8 w-3/4" />
      </header>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardContent className="flex items-center gap-4 p-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-3/4" />
              </div>
              <Skeleton className="h-6 w-24 rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
