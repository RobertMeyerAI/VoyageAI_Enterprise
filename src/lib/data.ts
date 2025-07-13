'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';
import type { Trip, Segment } from './types';

export async function getTrips(): Promise<Trip[]> {
  try {
    const tripsCol = collection(db, 'trips');
    const tripsSnapshot = await getDocs(query(tripsCol, orderBy('startDate', 'asc')));
    const tripsList = tripsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Trip));
    return tripsList;
  } catch (error: any) {
    console.error("Firebase Error: Failed to fetch trips. Please ensure that you have created a Firestore database in your Firebase project ('atlasnomad') and that your security rules allow read access.", error.message);
    return [];
  }
}

export async function getTrip(tripId: string): Promise<Trip | null> {
    try {
        const tripDocRef = doc(db, 'trips', tripId);
        const tripDoc = await getDoc(tripDocRef);

        if (!tripDoc.exists()) {
            console.log(`Trip with ID ${tripId} not found.`);
            return null;
        }

        return { id: tripDoc.id, ...tripDoc.data() } as Trip;
    } catch (error: any) {
        console.error(`Firebase Error: Failed to fetch trip ${tripId}.`, error.message);
        return null;
    }
}


export async function getTripSegments(tripId: string): Promise<Segment[]> {
    try {
        const segmentsCol = collection(db, `trips/${tripId}/segments`);
        const segmentsSnapshot = await getDocs(query(segmentsCol, orderBy('date', 'asc')));
        if (segmentsSnapshot.empty) {
            console.log(`No segments found for trip ${tripId}.`);
            return [];
        }
        const segmentsList = segmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Segment));
        return segmentsList;
    } catch (error: any) {
        console.error(`Firebase Error: Failed to fetch segments for trip ${tripId}.`, error.message);
        return [];
    }
}
