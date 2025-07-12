import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Map as MapIcon } from 'lucide-react';

export default function MapPage() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground">
          Map View
        </h1>
        <p className="text-muted-foreground">
          Geospatial display of your journey.
        </p>
      </header>
      <Card className="flex flex-1 flex-col items-center justify-center text-center">
        <CardHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MapIcon className="h-8 w-8" />
          </div>
          <CardTitle className="mt-4">Map Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            An interactive map of your trip segments and connections will be
            available here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
