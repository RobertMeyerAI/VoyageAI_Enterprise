'use server';
/**
 * @fileOverview An AI agent that suggests nearby vegan restaurants based on user query and current context.
 *
 * - askAtlasAIVeganRestaurants - A function that handles the vegan restaurant suggestion process.
 * - AskAtlasAIVeganRestaurantsInput - The input type for the askAtlasAIVeganRestaurants function.
 * - AskAtlasAIVeganRestaurantsOutput - The return type for the askAtlasAIVeganRestaurants function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AskAtlasAIVeganRestaurantsInputSchema = z.object({
  city: z.string().describe('The city where the user is located.'),
  time: z.string().describe('The current time in HH:MM format.'),
  query: z.string().describe('The user query, e.g., \'vegan restaurants open after 22:00 within 1 km\'.'),
});
export type AskAtlasAIVeganRestaurantsInput = z.infer<typeof AskAtlasAIVeganRestaurantsInputSchema>;

const AskAtlasAIVeganRestaurantsOutputSchema = z.object({
  restaurants: z.array(
    z.object({
      name: z.string().describe('The name of the restaurant.'),
      address: z.string().describe('The address of the restaurant.'),
      openingHours: z.string().describe('The opening hours of the restaurant.'),
      distance: z.string().describe('The distance to the restaurant from the user.'),
    })
  ).describe('An array of vegan restaurants that match the user query.'),
});
export type AskAtlasAIVeganRestaurantsOutput = z.infer<typeof AskAtlasAIVeganRestaurantsOutputSchema>;

export async function askAtlasAIVeganRestaurants(input: AskAtlasAIVeganRestaurantsInput): Promise<AskAtlasAIVeganRestaurantsOutput> {
  return askAtlasAIVeganRestaurantsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'askAtlasAIVeganRestaurantsPrompt',
  input: {schema: AskAtlasAIVeganRestaurantsInputSchema},
  output: {schema: AskAtlasAIVeganRestaurantsOutputSchema},
  prompt: `You are Atlas, an AI travel assistant. A user is asking for vegan restaurant recommendations in their current location.  Use the information below to formulate your response.

User Location:
City: {{{city}}}
Current Time: {{{time}}}

User Query:
{{{query}}}

Respond with a JSON object containing an array of restaurants that match the query. Each restaurant object should include the name, address, opening hours, and distance.
`,
});

const askAtlasAIVeganRestaurantsFlow = ai.defineFlow(
  {
    name: 'askAtlasAIVeganRestaurantsFlow',
    inputSchema: AskAtlasAIVeganRestaurantsInputSchema,
    outputSchema: AskAtlasAIVeganRestaurantsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
