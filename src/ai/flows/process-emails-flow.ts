
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
        userId: magicMailboxEmail,
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
          userId: magicMailboxEmail,
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
            userId: magicMailboxEmail,
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
        if (error.response?.data?.error === 'invalid_grant') {
          return { success: false, message: `Authentication failed (invalid_grant). Your refresh token may be invalid or expired. Please re-run 'npm run gmail:get-token'.`};
        }
        return { success: false, message: `An error occurred: ${error.message}`};
    }
  }
);
