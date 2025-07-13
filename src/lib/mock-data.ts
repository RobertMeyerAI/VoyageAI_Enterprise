import type { Connection, Alert, InboxMessage, MockTrip } from './types';
import { Timestamp } from 'firebase/firestore';


export const tripsData: MockTrip[] = [
    {
      id: 'scandinavia-2025',
      title: 'Summer in Scandinavia',
      startDate: '2025-07-20',
      endDate: '2025-07-27',
      icon: 'MountainSnow',
      itinerary: [
        {
          date: '2025-07-20',
          day: 'Saturday',
          segments: [
            {
              id: 'seg1',
              type: 'flight',
              status: 'confirmed',
              title: 'Flight to Copenhagen',
              provider: 'Scandinavian Airlines',
              confirmationCode: 'SK944',
              startTime: '14:30',
              endTime: '16:50',
              startLocation: 'Charles de Gaulle Airport',
              endLocation: 'Copenhagen Airport',
              startLocationShort: 'CDG',
              endLocationShort: 'CPH',
              duration: '2h 20m',
              details: { Gate: '42B', Seat: '18A', Terminal: '2D' },
              media: [
                {
                  type: 'qr',
                  url: 'https://placehold.co/150x150.png',
                },
              ],
            },
            {
              id: 'seg2',
              type: 'lodging',
              status: 'confirmed',
              title: 'Copenhagen Hotel',
              provider: 'Absalon Hotel',
              confirmationCode: 'BK12984',
              startTime: '18:00',
              endTime: '11:00 (July 23)',
              startLocation: 'Helgolandsgade 15, 1653 Copenhagen',
              endLocation: 'Helgolandsgade 15, 1653 Copenhagen',
              startLocationShort: 'Absalon Hotel',
              endLocationShort: 'Absalon Hotel',
              details: { "Booked Via": "Booking.com" },
            },
          ],
        },
        {
          date: '2025-07-23',
          day: 'Tuesday',
          segments: [
            {
              id: 'seg3',
              type: 'train',
              status: 'confirmed',
              title: 'Train to Stockholm',
              provider: 'SJ',
              confirmationCode: 'X2000-538',
              startTime: '12:12',
              endTime: '17:20',
              startLocation: 'Copenhagen Central Station',
              endLocation: 'Stockholm Central Station',
              startLocationShort: 'København H',
              endLocationShort: 'Stockholm C',
              duration: '5h 8m',
              details: { Platform: '7', Coach: '3', Seat: '24' },
            },
            {
              id: 'seg4',
              type: 'lodging',
              status: 'confirmed',
              title: 'Stockholm Airbnb',
              provider: 'Airbnb',
              confirmationCode: 'HMJ3P2QY1',
              startTime: '18:30',
              endTime: '10:00 (July 26)',
              startLocation: 'Gamla Stan, Stockholm',
              endLocation: 'Gamla Stan, Stockholm',
              startLocationShort: 'Gamla Stan',
              endLocationShort: 'Gamla Stan',
              details: { "Booked Via": "Airbnb" },
            },
          ],
        },
        {
          date: '2025-07-26',
          day: 'Friday',
          segments: [
            {
              id: 'seg5',
              type: 'ferry',
              status: 'delayed',
              title: 'Ferry to Helsinki',
              provider: 'Viking Line',
              confirmationCode: 'VL-887123',
              startTime: '16:30',
              endTime: '10:10 (July 27)',
              startLocation: 'Stadsgården, Stockholm',
              endLocation: 'Katajanokka, Helsinki',
              startLocationShort: 'Stockholm Port',
              endLocationShort: 'Helsinki Port',
              duration: '17h 40m',
              details: { 'New Departure': '17:00', Cabin: 'A4 - 10231', Deck: '10' },
            },
          ],
        },
      ],
    },
    {
      id: 'nyc-2025',
      title: 'Weekend in New York',
      startDate: '2025-08-15',
      endDate: '2025-08-18',
      icon: 'Building2',
      itinerary: [
        {
          date: '2025-08-15',
          day: 'Friday',
          segments: [
            {
              id: 'seg6',
              type: 'flight',
              status: 'confirmed',
              title: 'Flight to JFK',
              provider: 'Delta',
              confirmationCode: 'DL421',
              startTime: '09:15',
              endTime: '12:05',
              startLocation: 'San Francisco International',
              endLocation: 'John F. Kennedy International',
              startLocationShort: 'SFO',
              endLocationShort: 'JFK',
              duration: '5h 50m',
            },
            {
              id: 'seg7',
              type: 'lodging',
              status: 'confirmed',
              title: 'The Hoxton, Williamsburg',
              provider: 'The Hoxton',
              confirmationCode: 'HX98765',
              startTime: '15:00',
              endTime: '12:00 (Aug 18)',
              startLocation: '97 Wythe Ave, Brooklyn, NY 11249',
              endLocation: '97 Wythe Ave, Brooklyn, NY 11249',
              startLocationShort: 'The Hoxton',
              endLocationShort: 'The Hoxton',
              details: { "Booked Via": "Hotels.com" },
            },
          ],
        },
      ],
    },
  ];

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
