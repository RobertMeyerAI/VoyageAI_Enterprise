# **App Name**: Atlas Nomad

## Core Features:

- Inbox Scrape & Parse: Secure OAuth connection to user-provided Gmail accounts for hourly polling and extraction of travel-related data.
- Universal Reservation Wallet: Unified timeline displaying flights, cruises, trains, buses, hotels, and other reservations, with granular filtering options.
- Contextual Ground-Transit Layer: Surface real-time public-transport options between arrival nodes and subsequent reservation locations using live GTFS or Rome2Rio/Omio APIs.
- Third-Party Deep-Links & APIs: In-app cards with deep-links to native apps/web (Booking.com, Airbnb, Google Flights, Tripadvisor, etc.) passing context via universal links.
- Live Ops Watcher: Watch for flight status, platform assignments, strikes, weather alerts, and visa expiry timers, pushing actionable alerts.
- Offline Vault: Encrypted local cache of the trip timeline, PDFs, QR codes, e-tickets, maps (via Mapbox offline tiles), and key email bodies.
- Ask Atlas AI Button: AI-powered sheet (powered by ChatGPT tool) opening with the active segment's context. User can query things like public routes, lounge situations, or open vegan restaurants.

## Style Guidelines:

- Primary color: HSL(210, 70%, 50%) – A vibrant, slightly desaturated blue (#3C7EFF) suggesting trust and efficiency, in alignment with clarity, a core design Ethos
- Background color: HSL(210, 20%, 97%) – A light, desaturated blue (#FAFBFD), nearly white, reinforcing a calm environment for the experienced traveler
- Accent color: HSL(180, 60%, 40%) – A contrasting, moderately saturated teal (#22B573), adding emphasis and differentiating key interactive elements from the primary blue. But in consideration of not suggesting Teal when unnecessary, this color can be easily swapped with a muted or darker complimentary shade
- Body and headline font: 'Inter', a grotesque-style sans-serif for its modern, objective, and neutral appearance.
- Code font: 'Source Code Pro' (monospace) for displaying code snippets, if applicable.
- Use SF Symbols for native iOS look, scalability, and adaptability.
- Native SwiftUI with subtle glassmorphism and dark-mode first for a modern look.