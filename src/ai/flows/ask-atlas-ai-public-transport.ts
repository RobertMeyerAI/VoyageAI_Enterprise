'use server';
/**
 * @fileOverview An AI agent that provides public transport directions from a user's current location to their destination.
 *
 * - askAtlasAIPublicTransport - A function that handles the process of getting public transport directions.
 * - AskAtlasAIPublicTransportInput - The input type for the askAtlasAIPublicTransport function.
 * - AskAtlasAIPublicTransportOutput - The return type for the askAtlasAIPublicTransport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AskAtlasAIPublicTransportInputSchema = z.object({
  currentLocation: z
    .string()
    .describe("The user's current location, e.g., 'NRT Airport'."),
  destination: z.string().describe('The destination address or location.'),
});
export type AskAtlasAIPublicTransportInput = z.infer<
  typeof AskAtlasAIPublicTransportInputSchema
>;

const AskAtlasAIPublicTransportOutputSchema = z.object({
  route: z.string().describe('The fastest public transport route.'),
  fare: z.string().describe('The estimated fare for the route.'),
  travelTime: z.string().describe('The estimated travel time for the route.'),
});
export type AskAtlasAIPublicTransportOutput = z.infer<
  typeof AskAtlasAIPublicTransportOutputSchema
>;

export async function askAtlasAIPublicTransport(
  input: AskAtlasAIPublicTransportInput
): Promise<AskAtlasAIPublicTransportOutput> {
  return askAtlasAIPublicTransportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'askAtlasAIPublicTransportPrompt',
  input: {schema: AskAtlasAIPublicTransportInputSchema},
  output: {schema: AskAtlasAIPublicTransportOutputSchema},
  prompt: `You are Atlas, an AI travel assistant. A user has just landed at the following current location: {{{currentLocation}}}. They need to reach their destination at {{{destination}}}. Provide the fastest public transport route, estimated fare, and travel time.
`,
});

const askAtlasAIPublicTransportFlow = ai.defineFlow(
  {
    name: 'askAtlasAIPublicTransportFlow',
    inputSchema: AskAtlasAIPublicTransportInputSchema,
    outputSchema: AskAtlasAIPublicTransportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
