
'use server';
/**
 * @fileOverview A Genkit flow for processing travel emails from a magic mailbox.
 *
 * - processEmails - A function that handles the email processing.
 * - ProcessEmailsOutput - The return type for the processEmails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { google } from 'googleapis';
import { extractSegmentFromEmail } from './extract-segment-from-email-flow';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid';
import { config } from 'dotenv';
import { getTripSegments } from '@/lib/data';
import type { SerializedSegment } from '@/lib/types';


// Load environment variables from .env file
config({ path: '.env' });

const ProcessEmailsOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type ProcessEmailsOutput = z.infer<typeof ProcessEmailsOutputSchema>;

export async function processEmails(): Promise<ProcessEmailsOutput> {
  return processEmailsFlow();
}

const processEmailsFlow = ai.defineFlow(
  {
    name: 'processEmailsFlow',
    inputSchema: z.void(),
    outputSchema: ProcessEmailsOutputSchema,
  },
  async () => {
    console.log('Checking magic mailbox for new travel emails...');

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.GMAIL_REFRESH_TOKEN;
    const magicMailboxEmail = process.env.MAGIC_MAILBOX_EMAIL;

    if (!clientId || !clientSecret || !refreshToken || !magicMailboxEmail) {
      const message = 'Gmail OAuth credentials or magic mailbox email not configured in .env';
      console.error(message);
      return { success: false, message };
    }

    try {
      const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
      oauth2Client.setCredentials({ refresh_token: refreshToken });

      const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
      
      const res = await gmail.users.messages.list({
        userId: 'me', // 'me' refers to the authenticated user's mailbox
        q: 'is:unread', // Fetch only unread emails
      });

      const messages = res.data.messages;
      if (!messages || messages.length === 0) {
        console.log('No new emails found.');
        return { success: true, message: 'Email sync complete. 0 new emails found.' };
      }

      console.log(`Found ${messages.length} new emails. Processing...`);
      let processedCount = 0;
      let duplicateCount = 0;

      // TODO: The tripId should be determined dynamically. Hardcoding for now.
      const tripId = 'scandinavia-2025';
      const existingSegmentsResult = await getTripSegments(tripId);
      const serializedSegments: SerializedSegment[] = existingSegmentsResult.map(segment => ({
          ...segment,
          date: segment.date.toDate().toISOString(),
      }));

      for (const message of messages) {
        if (!message.id) continue;
        
        const msg = await gmail.users.messages.get({
          userId: 'me',
          id: message.id,
          format: 'full',
        });

        let emailBody = '';
        const parts = msg.data.payload?.parts;
        if (parts) {
            const part = parts.find(p => p.mimeType === 'text/plain' && p.body?.data);
            if (part && part.body?.data) {
                emailBody = Buffer.from(part.body.data, 'base64').toString('utf-8');
            }
        }
        
        if (emailBody) {
            console.log(`--- Parsing Email ID: ${message.id} ---`);
            const extractionResult = await extractSegmentFromEmail({ 
                emailBody,
                existingSegments: serializedSegments,
            });
            
            if (extractionResult.isTravelEmail && extractionResult.segment) {
                if (extractionResult.isDuplicate) {
                    console.log(`Segment is a duplicate. Skipping.`);
                    duplicateCount++;
                } else {
                    console.log(`Extracted segment: ${extractionResult.segment.title}`);
                    const newSegment = {
                        ...extractionResult.segment,
                        date: Timestamp.fromDate(new Date(extractionResult.segment.date)),
                    }
    
                    const segmentId = uuidv4();
                    const segmentDocRef = doc(db, 'trips', tripId, 'segments', segmentId);
                    await setDoc(segmentDocRef, newSegment);
                    
                    console.log(`Saved segment ${segmentId} to trip ${tripId}`);
                    processedCount++;
                }
            } else {
                console.log('Email was not a travel reservation. Skipping.');
            }
        }

        // Mark the email as read after processing
        await gmail.users.messages.modify({
            userId: 'me',
            id: message.id,
            requestBody: {
                removeLabelIds: ['UNREAD']
            }
        });
      }

      return {
        success: true,
        message: `Email sync complete. ${messages.length} email(s) checked, ${processedCount} new segment(s) added. ${duplicateCount} duplicate(s) ignored.`,
      };

    } catch (error: any) {
        console.error('Failed to process emails:', error.message);
        if (error.response?.data?.error === 'invalid_grant') {
          return { success: false, message: `Authentication failed (invalid_grant). Your refresh token may be invalid or expired. Please re-run 'npm run gmail:get-token'.`};
        }
        return { success: false, message: `An error occurred: ${error.message}`};
    }
  }
);
