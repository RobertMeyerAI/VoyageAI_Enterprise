
import type { Connection, Alert, InboxMessage } from './types';

export const connectionsData: Connection[] = [
  {
    id: 'conn1',
    from: 'Copenhagen Airport',
    to: 'Absalon Hotel',
    fromType: 'flight',
    toType: 'lodging',
    options: [
      {
        type: 'Public',
        duration: '25 min',
        cost: '36 DKK',
        provider: 'DOT',
        description: 'Metro M2 towards Vanløse, then 5 min walk.',
        isBest: 'Fastest',
      },
      {
        type: 'Rideshare',
        duration: '20 min',
        cost: '250-300 DKK',
        provider: 'Uber',
        description: 'Varies with traffic conditions.',
        isBest: null,
      },
    ],
  },
  {
    id: 'conn2',
    from: 'Stockholm Central',
    to: 'Gamla Stan Airbnb',
    fromType: 'train',
    toType: 'lodging',
    options: [
      {
        type: 'Walk',
        duration: '15 min',
        cost: 'Free',
        provider: 'Self',
        description: 'A scenic walk through downtown Stockholm.',
        isBest: 'Cheapest',
      },
      {
        type: 'Public',
        duration: '5 min',
        cost: '42 SEK',
        provider: 'SL',
        description: 'T-bana one stop to Gamla Stan station.',
        isBest: null,
      },
    ],
  },
];

export const alertsData: Alert[] = [
    {
      id: 'alert1',
      severity: 'critical',
      title: 'Helsinki Ferry Strike',
      description: 'A potential strike may affect your ferry on July 26. We are monitoring the situation.',
      time: '2h ago'
    },
    {
      id: 'alert2',
      severity: 'warning',
      title: 'Visa Expiry approaching',
      description: 'Your Schengen Visa expires in 30 days. Plan your next steps accordingly.',
      time: '1d ago'
    },
    {
      id: 'alert3',
      severity: 'info',
      title: 'Weather Advisory for Stockholm',
      description: 'Expect light rain on Tuesday. Pack an umbrella!',
      time: '3d ago'
    }
  ];
  
  export const inboxData: InboxMessage[] = [
    {
      id: 'msg1',
      summary: 'Flight SK944 to CPH confirmed.',
      from: 'SAS <noreply@flysas.com>',
      subject: 'Your upcoming flight to Copenhagen',
      status: 'parsed',
      received: 'Jul 10'
    },
    {
      id: 'msg2',
      summary: 'Absalon Hotel reservation confirmed.',
      from: 'Booking.com <customer.service@booking.com>',
      subject: 'Confirmation: Absalon Hotel, Copenhagen',
      status: 'parsed',
      received: 'Jul 10'
    },
    {
      id: 'msg3',
      summary: 'Your Stockholm-Helsinki trip.',
      from: 'Viking Line <info@vikingline.com>',
      subject: 'Booking confirmation VL-887123',
      status: 'parsed',
      received: 'Jul 11'
    },
    {
      id: 'msg4',
      summary: 'Can you recommend a restaurant?',
      from: 'friends@example.com',
      subject: 'Re: Your trip!',
      status: 'unmatched',
      received: 'Jul 12'
    },
    {
      id: 'msg5',
      summary: 'Duplicate flight booking found.',
      from: 'Voyage AI <alerts@voyage.ai>',
      subject: 'Potential conflict in your itinerary',
      status: 'conflict',
      received: 'Jul 12'
    }
  ];
  
