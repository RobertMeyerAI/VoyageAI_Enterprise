export type Segment = {
  id: string;
  type: 'flight' | 'lodging' | 'train' | 'ferry' | 'bus' | 'activity' | 'car';
  status: 'confirmed' | 'delayed' | 'cancelled';
  title: string;
  provider: string;
  confirmationCode: string;
  startTime: string;
  endTime: string;
  startLocation: string;
  endLocation: string;
  startLocationShort: string;
  endLocationShort: string;
  duration?: string;
  details?: Record<string, string>;
  media?: { type: 'qr' | 'pdf'; url: string }[];
};

export type DayGroup = {
  date: string;
  day: string;
  segments: Segment[];
};

export type Trip = {
  id: string;
  title: string;
  itinerary: DayGroup[];
  startDate: string;
  endDate: string;
  image: {
    url: string;
    aiHint: string;
  };
};

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
