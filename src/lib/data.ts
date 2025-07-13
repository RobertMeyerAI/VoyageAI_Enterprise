

'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, orderBy, addDoc, Timestamp, writeBatch, deleteDoc, updateDoc, setDoc } from 'firebase/firestore';
import type { Trip, Segment, NewTripData, NewSegmentData, ExtractedSegment } from './types';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

export async function addTrip(tripData: NewTripData): Promise<string> {
  try {
    const tripsCol = collection(db, 'trips');
    const docRef = await addDoc(tripsCol, {
      title: tripData.title,
      // Default dates if not provided, for simplicity
      startDate: Timestamp.fromDate(tripData.startDate ?? new Date('2025-07-01T00:00:00Z')),
      endDate: Timestamp.fromDate(tripData.endDate ?? new Date('2025-07-31T00:00:00Z')),
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

export async function updateTrip(tripId: string, tripData: NewTripData): Promise<void> {
  try {
    if (!tripData.startDate || !tripData.endDate) {
        throw new Error("Start and end dates are required for updating a trip.");
    }
    const tripDocRef = doc(db, 'trips', tripId);
    await updateDoc(tripDocRef, {
      ...tripData,
      startDate: Timestamp.fromDate(tripData.startDate),
      endDate: Timestamp.fromDate(tripData.endDate),
    });
    console.log(`Trip ${tripId} updated.`);
    revalidatePath('/itinerary');
    revalidatePath(`/itinerary/${tripId}`);
  } catch (error) {
    console.error('Error updating trip: ', error);
    throw new Error('Failed to update trip.');
  }
}

export async function deleteTrip(tripId: string): Promise<void> {
    try {
        const tripDocRef = doc(db, 'trips', tripId);
        const segmentsColRef = collection(db, 'trips', tripId, 'segments');
        
        const batch = writeBatch(db);

        // Delete all segments in the subcollection
        const segmentsSnapshot = await getDocs(segmentsColRef);
        segmentsSnapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });

        // Delete the trip document itself
        batch.delete(tripDocRef);

        await batch.commit();

        console.log(`Trip ${tripId} and all its segments have been deleted.`);
        revalidatePath('/itinerary');
        revalidatePath(`/itinerary/${tripId}`);
    } catch (error) {
        console.error('Error deleting trip: ', error);
        throw new Error('Failed to delete trip.');
    }
}


export async function addSegment(tripId: string, segmentData: NewSegmentData & { date: Date }): Promise<string> {
    try {
        const segmentsCol = collection(db, `trips/${tripId}/segments`);
        
        if (!segmentData.date) {
            throw new Error("Cannot add segment without a date.");
        }

        const dataToSave = {
            ...segmentData,
            date: Timestamp.fromDate(segmentData.date),
        };

        const docRef = await addDoc(segmentsCol, dataToSave);
        console.log(`Segment added with ID: ${docRef.id} to trip ${tripId}`);
        revalidatePath(`/itinerary/${tripId}`);
        return docRef.id;
    } catch (error) {
        console.error('Error adding segment: ', error);
        throw new Error('Failed to create new segment.');
    }
}

export async function addSegmentFromEmail(tripId: string, segmentData: ExtractedSegment): Promise<string> {
    try {
        // Convert date string from AI to Firestore Timestamp
        // The AI returns YYYY-MM-DD, which is safe to parse in UTC.
        const segmentDate = new Date(segmentData.date + 'T00:00:00Z');
        if (isNaN(segmentDate.getTime())) {
            throw new Error(`Invalid date format from AI: ${segmentData.date}`);
        }

        const newSegment = {
            ...segmentData,
            date: Timestamp.fromDate(segmentDate),
        }

        const segmentId = uuidv4();
        const segmentDocRef = doc(db, 'trips', tripId, 'segments', segmentId);
        await setDoc(segmentDocRef, newSegment);

        console.log(`Segment added from email with ID: ${segmentId} to trip ${tripId}`);
        revalidatePath(`/itinerary/${tripId}`);
        return segmentId;
    } catch (error: any) {
        console.error('Error adding segment from email: ', error);
        throw new Error('Failed to save parsed segment.');
    }
}

export async function deleteSegment(tripId: string, segmentId: string): Promise<void> {
    try {
        const segmentDocRef = doc(db, 'trips', tripId, 'segments', segmentId);
        await deleteDoc(segmentDocRef);
        console.log(`Segment ${segmentId} deleted from trip ${tripId}.`);
        revalidatePath(`/itinerary/${tripId}`);
    } catch (error) {
        console.error('Error deleting segment: ', error);
        throw new Error('Failed to delete segment.');
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
        const segmentsSnapshot = await getDocs(query(segmentsCol, orderBy('date', 'asc'), orderBy('startTime', 'asc')));
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
