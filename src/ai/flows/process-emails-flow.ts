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

    const serviceAccountJson = process.env.GMAIL_SERVICE_ACCOUNT_JSON;
    const magicMailboxEmail = process.env.MAGIC_MAILBOX_EMAIL;

    if (!serviceAccountJson || !magicMailboxEmail) {
      const message = 'Service account or magic mailbox email not configured in .env';
      console.error(message);
      return { success: false, message };
    }

    try {
      const credentials = JSON.parse(serviceAccountJson);

      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/gmail.readonly'],
      });

      // We need to impersonate a user in the G-Suite domain to read emails
      const authClient = await auth.getClient();
      // @ts-ignore - subject is not in the type definition but is required for domain-wide delegation
      authClient.subject = magicMailboxEmail;
      
      const gmail = google.gmail({ version: 'v1', auth: authClient });
      
      const res = await gmail.users.messages.list({
        userId: 'me',
        q: 'is:unread', // Fetch only unread emails
      });

      const messages = res.data.messages;
      if (!messages || messages.length === 0) {
        console.log('No new emails found.');
        return { success: true, message: 'Email sync complete. 0 new emails found.' };
      }

      console.log(`Found ${messages.length} new emails. Processing...`);

      for (const message of messages) {
        if (!message.id) continue;
        
        const msg = await gmail.users.messages.get({
          userId: 'me',
          id: message.id,
          format: 'full', // We want the full email payload
        });

        // The email body is typically in the payload.parts array, base64 encoded.
        // This is a simplified extraction. A robust implementation would handle multipart messages.
        const emailBody = msg.data.payload?.parts?.find(part => part.mimeType === 'text/plain')?.body?.data;
        if (emailBody) {
            const decodedBody = Buffer.from(emailBody, 'base64').toString('utf-8');
            console.log('--- Email Body ---');
            console.log(decodedBody.substring(0, 300) + '...'); // Log first 300 chars
            // TODO: Pass the decodedBody to another Genkit flow for parsing and saving to Firestore.
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
        message: `Email sync complete. ${messages.length} new email(s) processed.`,
      };

    } catch (error: any) {
        console.error('Failed to process emails:', error.message);
        return { success: false, message: `An error occurred: ${error.message}`};
    }
  }
);
