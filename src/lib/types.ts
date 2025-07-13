
import type { Timestamp } from 'firebase/firestore';
import { z } from 'zod';

export type Segment = {
  id: string;
  type: 'flight' | 'lodging' | 'train' | 'ferry' | 'bus' | 'activity' | 'car';
  status: 'confirmed' | 'delayed' | 'cancelled';
  title: string;
  provider: string;
  confirmationCode: string;
  startTime: string; // Keep as string for mock/display HH:mm
  endTime: string; // Keep as string for mock/display HH:mm
  startLocation: string;
  endLocation: string;
  startLocationShort: string;
  endLocationShort: string;
  date: Timestamp;
  duration?: string;
  details?: Record<string, string>;
  media?: { type: 'qr' | 'pdf'; url: string }[];
};

// Type for when a Segment has been serialized for a Client Component
export type SerializedSegment = Omit<Segment, 'date'> & {
  date: string;
};


// This version of Segment is for the mock data structure
export type MockSegment = Omit<Segment, 'date'>;


export type DayGroup = {
  date: string;
  day: string;
  segments: SerializedSegment[];
};

export type Trip = {
  id: string;
  title: string;
  startDate: Timestamp;
  endDate: Timestamp;
  icon?: string;
};

// Type for when a Trip has been serialized for a Client Component
export type SerializedTrip = Omit<Trip, 'startDate' | 'endDate'> & {
  startDate: string;
  endDate: string;
};

// Data for creating a new Trip
export const NewTripSchema = z.object({
  title: z.string().min(1, "Title is required."),
  startDate: z.date({ required_error: "Start date is required." }),
  endDate: z.date({ required_error: "End date is required." }),
});
export type NewTripData = z.infer<typeof NewTripSchema>;

// Data for creating a new Segment
export const NewSegmentSchema = z.object({
  type: z.enum(['flight', 'lodging', 'train', 'ferry', 'bus', 'activity', 'car']),
  status: z.enum(['confirmed', 'delayed', 'cancelled']),
  title: z.string().min(1, "Title is required."),
  provider: z.string().min(1, "Provider is required."),
  confirmationCode: z.string(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)."),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)."),
  startLocation: z.string().min(1, "Start location is required."),
  endLocation: z.string().min(1, "End location is required."),
  startLocationShort: z.string().min(1, "Short start location is required."),
  endLocationShort: z.string().min(1, "Short end location is required."),
  date: z.date({ required_error: "Date is required." }),
});
export type NewSegmentData = z.infer<typeof NewSegmentSchema>;


// Trip type for mock data for seeding and fallback
export type MockTrip = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  icon: string;
  itinerary: {
    date: string;
    day: string;
    segments: MockSegment[];
  }[];
}

export type InboxMessage = {
  id: string;
  summary: string;
  from: string;
  subject: string;
  status: 'parsed' | 'unmatched' | 'conflict';
  received: string;
};

export type ConnectionOption = {
  type: 'Walk' | 'Public' | 'Rideshare' | 'Rental';
  duration: string;
  cost: string;
  provider: string;
  description: string;
  isBest: 'Fastest' | 'Cheapest' | 'Eco' | 'Accessible' | null;
};

export type Connection = {
  id: string;
  from: string;
  to: string;
  fromType: 'flight' | 'lodging' | 'train' | 'ferry' | 'bus' | 'activity' | 'car';
  toType: 'flight' | 'lodging' | 'train' | 'ferry' | 'bus' | 'activity' | 'car';
  options: ConnectionOption[];
};

export type AiChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export type Alert = {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  time: string;
};
