'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, orderBy, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import type { Trip, Segment, NewTripData, NewSegmentData } from './types';
import { revalidatePath } from 'next/cache';

export async function addTrip(tripData: NewTripData): Promise<string> {
  try {
    const tripsCol = collection(db, 'trips');
    const docRef = await addDoc(tripsCol, {
      ...tripData,
      startDate: Timestamp.fromDate(new Date(tripData.startDate)),
      endDate: Timestamp.fromDate(new Date(tripData.endDate)),
      icon: 'Plane', // Default icon
    });
    console.log('Trip added with ID: ', docRef.id);
    revalidatePath('/itinerary');
    return docRef.id;
  } catch (error) {
    console.error('Error adding trip: ', error);
    throw new Error('Failed to create new trip.');
  }
}

export async function addSegment(tripId: string, segmentData: NewSegmentData): Promise<string> {
    try {
        const segmentsCol = collection(db, `trips/${tripId}/segments`);
        const docRef = await addDoc(segmentsCol, {
            ...segmentData,
            date: Timestamp.fromDate(new Date(segmentData.date)),
        });
        console.log(`Segment added with ID: ${docRef.id} to trip ${tripId}`);
        revalidatePath(`/itinerary/${tripId}`);
        return docRef.id;
    } catch (error) {
        console.error('Error adding segment: ', error);
        throw new Error('Failed to create new segment.');
    }
}


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
