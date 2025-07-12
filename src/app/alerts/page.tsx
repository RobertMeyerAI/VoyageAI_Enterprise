import { Card, CardContent } from '@/components/ui/card';
import { alertsData } from '@/lib/mock-data';
import type { Alert } from '@/lib/types';
import {
  AlertTriangle,
  Info,
  ShieldAlert,
} from 'lucide-react';

const severityInfo: Record<
  Alert['severity'],
  { icon: React.ReactNode; color: string; }
> = {
  critical: {
    icon: <ShieldAlert className="h-4 w-4" />,
    color: 'text-red-400',
  },
  warning: {
    icon: <AlertTriangle className="h-4 w-4" />,
    color: 'text-yellow-400',
  },
  info: {
    icon: <Info className="h-4 w-4" />,
    color: 'text-blue-400',
  },
};

export default function AlertsPage() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground">
          Live Alerts
        </h1>
        <p className="text-muted-foreground">
          Critical updates and warnings about your trip.
        </p>
      </header>
      <div className="space-y-4">
        {alertsData.map((alert) => (
          <Card key={alert.id} className="transition-all hover:bg-secondary/50">
            <CardContent className="flex items-start gap-4 p-4">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary ${
                  severityInfo[alert.severity].color
                }`}
              >
                {severityInfo[alert.severity].icon}
              </div>
              <div className="flex-1">
                <p className="font-medium">{alert.title}</p>
                <p className="text-sm text-muted-foreground">{alert.description}</p>
              </div>
              <p className="text-xs text-muted-foreground whitespace-nowrap">
                {alert.time}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
