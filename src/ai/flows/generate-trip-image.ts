'use server';
/**
 * @fileOverview An AI agent that generates a unique, artistic image for a trip.
 *
 * - generateTripImage - A function that takes trip details and returns an image data URI.
 * - GenerateTripImageInput - The input type for the generateTripImage function.
 * - GenerateTripImageOutput - The return type for the generateTripImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTripImageInputSchema = z.object({
  title: z.string().describe('The title of the trip, e.g., "Summer in Scandinavia".'),
  destination: z.string().describe('The primary destination or region of the trip.'),
  details: z.string().describe('Additional details about the trip, like activities, hotels, or cultural notes.')
});
export type GenerateTripImageInput = z.infer<typeof GenerateTripImageInputSchema>;

const GenerateTripImageOutputSchema = z.object({
  imageDataUri: z.string().describe("The generated image as a data URI, including a MIME type and Base64 encoding. Format: 'data:image/png;base64,<encoded_data>'."),
});
export type GenerateTripImageOutput = z.infer<typeof GenerateTripImageOutputSchema>;

export async function generateTripImage(input: GenerateTripImageInput): Promise<GenerateTripImageOutput> {
  return generateTripImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTripImagePrompt',
  input: {schema: GenerateTripImageInputSchema},
  prompt: `Generate an artistic, visually appealing image for a trip.
  The image should be in a modern, illustrative style, suitable for a travel app.
  Do not include any text in the image.

  Trip Title: {{{title}}}
  Primary Destination: {{{destination}}}
  Details: {{{details}}}

  Based on these details, create an image that captures the essence of the trip, incorporating elements of the local culture, landmarks, and overall vibe.
  `,
});

const generateTripImageFlow = ai.defineFlow(
  {
    name: 'generateTripImageFlow',
    inputSchema: GenerateTripImageInputSchema,
    outputSchema: GenerateTripImageOutputSchema,
  },
  async (input) => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: (await prompt(input)).prompt!,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media || !media.url) {
      throw new Error('Image generation failed to produce an image.');
    }

    return { imageDataUri: media.url };
  }
);
