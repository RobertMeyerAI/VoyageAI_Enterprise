'use server';
/**
 * @fileOverview A Genkit flow for providing lounge access information to users via the Ask Atlas AI button.
 *
 * - getLoungeAccessInfo - A function that retrieves lounge access information based on the user's location and access.
 * - LoungeAccessInfoInput - The input type for the getLoungeAccessInfo function.
 * - LoungeAccessInfoOutput - The return type for the getLoungeAccessInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LoungeAccessInfoInputSchema = z.object({
  location: z.string().describe('The current airport or location of the user.'),
  accessType: z.string().describe('The type of lounge access the user has (e.g., Priority Pass, airline status).'),
  query: z.string().optional().describe('Optional query from the user'),
});
export type LoungeAccessInfoInput = z.infer<typeof LoungeAccessInfoInputSchema>;

const LoungeAccessInfoOutputSchema = z.object({
  loungeName: z.string().describe('The name of the lounge.'),
  locationDescription: z.string().describe('Description of where the lounge is located in the airport.'),
  openHours: z.string().describe('The hours that the lounge is open.'),
  amenities: z.string().describe('The amenities offered at the lounge.'),
  query: z.string().optional().describe('Optional query from the user'),
});
export type LoungeAccessInfoOutput = z.infer<typeof LoungeAccessInfoOutputSchema>;

export async function getLoungeAccessInfo(input: LoungeAccessInfoInput): Promise<LoungeAccessInfoOutput> {
  return getLoungeAccessInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'loungeAccessInfoPrompt',
  input: {schema: LoungeAccessInfoInputSchema},
  output: {schema: LoungeAccessInfoOutputSchema},
  prompt: `You are Atlas, a helpful AI assistant that provides information about airport lounges. The user is at {{location}} and has {{accessType}} lounge access.

  {% if query %}
  The user has the following query: {{query}}
  {% endif %}
  Find the lounge name, location description, open hours, and amenities of the lounge at the airport.
  `,
});

const getLoungeAccessInfoFlow = ai.defineFlow(
  {
    name: 'getLoungeAccessInfoFlow',
    inputSchema: LoungeAccessInfoInputSchema,
    outputSchema: LoungeAccessInfoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
