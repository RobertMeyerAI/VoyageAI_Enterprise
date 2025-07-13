import { config } from 'dotenv';
config();

import '@/ai/flows/ask-atlas-ai-public-transport.ts';
import '@/ai/flows/ask-atlas-ai-lounge-access.ts';
import '@/ai/flows/ask-atlas-ai-vegan-restaurants.ts';
import '@/ai/flows/get-live-itinerary-status.ts';
import '@/ai/flows/process-emails-flow.ts';
