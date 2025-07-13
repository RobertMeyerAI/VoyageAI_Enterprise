
'use client';
import type { Segment } from '@/lib/types';
import Image from 'next/image';
import {
  Activity,
  ArrowRight,
  Bus,
  Car,
  ChevronDown,
  Ship,
  Hotel,
  MoreVertical,
  Plane,
  Train,
  QrCode,
  FileText,
  Pencil,
  Trash2,
  Loader2,
} from 'lucide-react';
import {
  Card,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useState, useTransition } from 'react';
import { cn } from '@/lib/utils';
import { deleteSegment } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

const segmentIcons: Record<Segment['type'], React.ReactNode> = {
  flight: <Plane className="h-5 w-5" />,
  lodging: <Hotel className="h-5 w-5" />,
  train: <Train className="h-5 w-5" />,
  ferry: <Ship className="h-5 w-5" />,
  bus: <Bus className="h-5 w-5" />,
  activity: <Activity className="h-5 w-5" />,
  car: <Car className="h-5 w-5" />,
};

const mediaIcons: Record<NonNullable<Segment['media']>[number]['type'], React.ReactNode> = {
  qr: <QrCode className="h-4 w-4 mr-2" />,
  pdf: <FileText className="h-4 w-4 mr-2" />,
};

const segmentColors: Record<Segment['type'], string> = {
  flight: 'text-blue-400',
  lodging: 'text-purple-400',
  train: 'text-green-400',
  ferry: 'text-cyan-400',
  bus: 'text-orange-400',
  activity: 'text-pink-400',
  car: 'text-amber-500',
};

const statusColors: Record<Segment['status'], string> = {
  confirmed: 'bg-green-500/20 text-green-300 border-green-500/30',
  delayed: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  cancelled: 'bg-red-500/20 text-red-300 border-red-500/30',
};

interface SegmentCardProps {
    segment: Segment;
    tripId: string;
}

export function SegmentCard({ segment, tripId }: SegmentCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDelete = () => {
    startTransition(async () => {
        try {
            await deleteSegment(tripId, segment.id);
            toast({
                title: 'Segment Deleted',
                description: `"${segment.title}" has been successfully deleted.`,
            });
            setIsAlertOpen(false);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to delete the segment. Please try again.',
            });
        }
    });
  }

  return (
    <Collapsible
      asChild
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <Card className="overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/10">
            <div className="flex items-center gap-3 p-2 text-left">
              <CollapsibleTrigger className="flex flex-1 items-center gap-3 text-left">
                <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary ${
                    segmentColors[segment.type]
                    }`}
                >
                    {segmentIcons[segment.type]}
                </div>
                <div className="flex-1 overflow-hidden">
                    <div className="truncate text-sm font-semibold">
                    {segment.title}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                    {segment.provider}
                    </div>
                </div>
                <Badge
                  variant="outline"
                  className={`hidden text-xs capitalize sm:inline-flex ${statusColors[segment.status]}`}
                  >
                  {segment.status}
                </Badge>
              </CollapsibleTrigger>
              <div className="flex items-center gap-2">
                <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            className="text-red-500 focus:text-red-500"
                            onSelect={(e) => {
                                e.preventDefault();
                                setIsAlertOpen(true);
                            }}
                        >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                     <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the segment "{segment.title}".
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isPending}
                            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                            >
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                    </Button>
                </CollapsibleTrigger>
            </div>
            </div>
        <CollapsibleContent>
            <div className="border-t border-dashed p-4 text-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-mono text-lg font-medium">
                  {segment.startTime}
                </span>
                <span className="text-muted-foreground">
                  {segment.startLocationShort}
                </span>
              </div>
              <div className="flex flex-col items-center text-muted-foreground">
                <ArrowRight className="h-4 w-4" />
                {segment.duration && (
                  <span className="text-xs">{segment.duration}</span>
                )}
              </div>
              <div className="flex flex-col items-end">
                <span className="font-mono text-lg font-medium">
                  {segment.endTime}
                </span>
                <span className="text-muted-foreground">
                  {segment.endLocationShort}
                </span>
              </div>
            </div>
            <div className="space-y-1 border-t pt-4">
              <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Confirmation:</span>
                  <span className="font-mono font-medium text-foreground">
                  {segment.confirmationCode}
                  </span>
              </div>
              {segment.details &&
                  Object.entries(segment.details).map(([key, value]) => (
                  <div
                      key={key}
                      className="flex justify-between text-xs text-muted-foreground"
                  >
                      <span>{key}:</span>
                      <span className="font-mono font-medium text-foreground">
                      {String(value)}
                      </span>
                  </div>
                  ))}
              </div>
              {segment.media && segment.media.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                    Boarding Pass / Tickets
                  </h4>
                  <div className="flex flex-wrap gap-4">
                    {segment.media.map((item, index) => (
                      <a
                        key={index}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-2 rounded-lg border p-2 hover:bg-secondary"
                      >
                        {item.type === 'qr' && (
                          <Image
                            src={item.url}
                            alt="QR Code"
                            width={100}
                            height={100}
                            className="rounded-md"
                            data-ai-hint="qr code"
                          />
                        )}
                        <span className="flex items-center text-xs font-medium text-primary">
                          {mediaIcons[item.type]}
                          {item.type === 'qr' ? 'Scan QR Code' : 'View PDF'}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
