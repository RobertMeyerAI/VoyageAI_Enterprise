import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { connectionsData } from '@/lib/mock-data';
import type { ConnectionOption, Segment } from '@/lib/types';
import {
  ArrowRight,
  Bus,
  Car,
  Ship,
  Footprints,
  Hotel,
  Plane,
  Train,
  Wind,
  CircleDollarSign,
  Star,
  Leaf,
  PersonStanding
} from 'lucide-react';

const segmentIcons: Record<Segment['type'], React.ReactNode> = {
  flight: <Plane className="h-5 w-5" />,
  lodging: <Hotel className="h-5 w-5" />,
  train: <Train className="h-5 w-5" />,
  ferry: <Ship className="h-5 w-5" />,
  bus: <Bus className="h-5 w-5" />,
  activity: <Plane className="h-5 w-5" />, // placeholder
  car: <Car className="h-5 w-5" />,
};

const optionIcons: Record<ConnectionOption['type'], React.ReactNode> = {
  Public: <Bus className="h-5 w-5" />,
  Rideshare: <Car className="h-5 w-5" />,
  Walk: <Footprints className="h-5 w-5" />,
  Rental: <Car className="h-5 w-5" />,
};

const bestIcons: Record<NonNullable<ConnectionOption['isBest']>, React.ReactNode> = {
    Fastest: <Wind className="h-3 w-3" />,
    Cheapest: <CircleDollarSign className="h-3 w-3" />,
    Eco: <Leaf className="h-3 w-3" />,
    Accessible: <PersonStanding className="h-3 w-3" />,
}

export default function ConnectionsPage() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground">
          Connections
        </h1>
        <p className="text-muted-foreground">
          AI-powered transit suggestions to fill the gaps in your journey.
        </p>
      </header>
      <div className="space-y-8">
        {connectionsData.map((connection) => (
          <div key={connection.id}>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                  {segmentIcons[connection.fromType]}
                </span>
                <span className='hidden sm:inline'>{connection.from}</span>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0" />
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                  {segmentIcons[connection.toType]}
                </span>
                <span className='hidden sm:inline'>{connection.to}</span>
              </div>
            </div>
            <div className="grid gap-4">
              {connection.options.map((option) => (
                <Card
                  key={option.type}
                  className="relative transition-all hover:shadow-lg hover:shadow-primary/10"
                >
                  {option.isBest && <Badge className='absolute top-2 right-2 text-xs py-0.5 px-1.5'><span className='mr-1'>{bestIcons[option.isBest]}</span>{option.isBest}</Badge>}
                  <div className="flex items-center p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mr-3">
                      {optionIcons[option.type]}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{option.type}</p>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                    </div>
                     <div className="text-right ml-2">
                        <p className="text-sm font-medium whitespace-nowrap">{option.duration}</p>
                        <p className="text-xs font-medium text-muted-foreground whitespace-nowrap">{option.cost}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
