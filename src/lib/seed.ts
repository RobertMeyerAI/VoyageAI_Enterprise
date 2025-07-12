// A script to seed the Firestore database with initial data.
// To run: `npx tsx src/lib/seed.ts`
// Ensure you have configured your .env.local file with your Firebase project details.
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, Timestamp, writeBatch } from 'firebase/firestore';
import { config } from 'dotenv';
import type { MockTrip } from './types';

// Load environment variables from .env.local
config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!firebaseConfig.projectId) {
  console.error("Firebase project ID is not set. Please check your .env.local file.");
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


const tripsData: MockTrip[] = [
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

async function seedDatabase() {
  console.log('Starting to seed database...');
  const batch = writeBatch(db);

  for (const trip of tripsData) {
    const { id, itinerary, ...tripData } = trip;
    const tripDocRef = doc(db, 'trips', id);
    
    // Convert date strings to Timestamps for the main trip document
    const firestoreTripData = {
        ...tripData,
        startDate: Timestamp.fromDate(new Date(trip.startDate)),
        endDate: Timestamp.fromDate(new Date(trip.endDate))
    };
    
    batch.set(tripDocRef, firestoreTripData);
    console.log(`- Staged trip: ${trip.title}`);

    for (const day of itinerary) {
      for (const segment of day.segments) {
        const { id: segmentId, ...segmentData } = segment;
        const segmentDocRef = doc(db, 'trips', id, 'segments', segmentId);

        // Add the date to each segment object
        const firestoreSegmentData = {
            ...segmentData,
            date: Timestamp.fromDate(new Date(day.date)),
        };

        batch.set(segmentDocRef, firestoreSegmentData);
        console.log(`  - Staged segment: ${segment.title}`);
      }
    }
  }

  try {
    await batch.commit();
    console.log('\nDatabase seeded successfully!');
    // process.exit(0) doesn't allow the script to terminate cleanly.
    // Let the script exit naturally.
  } catch (error) {
    console.error('\nError seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
