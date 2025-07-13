import type { Timestamp } from 'firebase/firestore';

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

// This version of Segment is specifically for the mock data structure
export type MockSegment = Omit<Segment, 'date'>;


export type DayGroup = {
  date: string;
  day: string;
  segments: Segment[];
};

export type Trip = {
  id: string;
  title: string;
  startDate: Timestamp;
  endDate: Timestamp;
  icon: string;
};

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
