# TEDxLafia

Official web platform for TEDxLafia, an independently organized TED event in Lafia, Nasarawa State, Nigeria, operating under license from TED. The platform showcases event schedules, speaker profiles, partner collaborations, registration details, and editorial content adhering to TED branding guidelines and high-end digital design standards.

---

## Table of Contents

- [Overview](#overview)
- [Design Philosophy and Aesthetics](#design-philosophy-and-aesthetics)
  - [Color System](#color-system)
  - [Typography](#typography)
  - [Grid and Editorial Layout](#grid-and-editorial-layout)
- [Architecture and Tech Stack](#architecture-and-tech-stack)
  - [Frontend and Framework](#frontend-and-framework)
  - [Routing and Layout](#routing-and-layout)
  - [State Management and Data Layer](#state-management-and-data-layer)
  - [Backend and Database](#backend-and-database)
- [Project Structure](#project-structure)
- [Route Hierarchy](#route-hierarchy)
- [Component Architecture](#component-architecture)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development Server](#development-server)
  - [Production Build and Preview](#production-build-and-preview)
- [Code Quality and Formatting](#code-quality-and-formatting)
- [Deployment](#deployment)
- [License and Attribution](#license-and-attribution)

---

## Overview

TEDxLafia brings together innovators, thinkers, creators, and leaders from Nasarawa State and beyond to share ideas worth spreading. The web platform serves as the digital front door for attendees, speakers, sponsors, and media partners.

Key features include:
- Curated Landing and Teaser Experience: Dynamic visual presentation for upcoming event cycles.
- Speaker Directory: Detailed roster of speakers, bios, and talk topics.
- Event Programming: Venue directions, agenda timelines, and session breakdowns.
- Partnership Showcases: Categorized sponsor tiers and backer acknowledgments.
- Registration and Newsletter Intake: Integrated workflows for attendee engagement and updates.
- Accessible and Performant Engineering: Optimized asset delivery, server-side rendering support, and mobile responsiveness.

---

## Design Philosophy and Aesthetics

The visual identity pairs TED's iconic red-and-black contrast with editorial minimalism inspired by high-fashion print layouts.

### Color System

The palette revolves around rigorous contrast, using custom CSS custom properties defined in OKLCH:

- Primary Red: `#E62E2D` (`--color-primary`) - The signature TED red used for emphasis, active states, and focal elements.
- Primary Deep: `--color-primary-deep` - Subdued wine/maroon tone for shadows, ambient backdrops, and gradient highlights.
- Ink / Dark: `--color-ink` / `--foreground` - Near-black editorial tone used for typography, heavy contrast sections, and footer backdrops.
- Secondary / Background: `#FFFFFF` / `--background` - Crisp white foundation providing whitespace.
- Cream and Gold: `--color-cream`, `--color-gold` - Warm secondary accents for badges, borders, and hairline separators.

### Typography

Typography is loaded directly from Google Fonts:
- Display / Headlines: `Cormorant Garamond` (weights 300, 400, 500) - High-contrast serif providing editorial gravitas for hero statements and section titles.
- Body / Interface: `Jost` (weights 300, 400, 500, 600) - Geometric sans-serif ensuring legible UI elements, metadata tags, and body paragraphs.

### Grid and Editorial Layout

- Consistent hairline dividers and CSS grid backdrops (`grid-bg`) establish structure across all screen sizes.
- Monospace-styled eyebrow badges indicate categories and geographical identifiers.
- Micro-interactions powered by Motion (`motion/react`) provide smooth scroll reveals without distracting from content readability.

---

## Architecture and Tech Stack

### Frontend and Framework

- React 19: Modern declarative component model.
- TanStack Start: Fullstack React framework offering server-side rendering (SSR), optimized streaming, and unified client-server boundaries.
- Nitro: Lightweight production server engine generating portable build targets for Cloudflare Workers, Node.js, and edge environments.
- Tailwind CSS v4: Integrated via `@tailwindcss/vite` with theme tokens configured directly through `@theme inline`.
- Motion: Declarative animation primitives for choreographed page reveals and transitions.
- Radix UI: Headless, accessible primitives supporting dialogs, dropdowns, navigation menus, and form controls.
- Sonner: Toast notification dispatch for form submissions and event confirmations.

### Routing and Layout

- TanStack Router: Type-safe, file-based routing located under `src/routes/`.
- Generated Route Tree: Automated routing definitions maintained in `src/routeTree.gen.ts`.
- Adaptive Shell Component: The root route (`src/routes/__root.tsx`) manages HTML head meta tags, script hydration, and conditional layout chrome (e.g., displaying the full global header and footer on content routes while offering an uncluttered presentation on focused teaser views).

### State Management and Data Layer

- TanStack Query v5: Manages server state, background revalidation, query deduplication, and cache lifecycle.
- Pre-fetching: Route loaders pre-load essential query keys before route transitions complete.

### Backend and Database

- Supabase: PostgreSQL database, storage, and authentication.
- Typed Client: Generated database schema bindings in `src/integrations/supabase/types.ts` consumed through `src/integrations/supabase/client.ts`.
- Server Functions: TanStack Start server functions handle sensitive backend operations and secure server-to-database communication.

---

## Project Structure

```text
tedxlafia-style-guide/
├── public/                     # Static assets served at root
│   ├── apple-touch-icon.png    # High-resolution iOS home screen icon
│   ├── coming soon.jpeg        # Event launch poster asset
│   ├── coming-soon.jpeg        # URL-safe alias for teaser image
│   ├── favicon.ico             # TEDxLafia multi-resolution favicon
│   ├── favicon-16x16.png       # 16px browser tab icon
│   ├── favicon-32x32.png       # 32px browser tab icon
│   └── robots.txt              # Search engine indexing directives
├── src/
│   ├── assets/                 # Processed imagery and graphics
│   │   ├── coming-soon.jpeg
│   │   ├── hero-stage.jpg
│   │   ├── join-team.jpg
│   │   └── lafia-aerial.jpg
│   ├── components/
│   │   ├── site/               # Domain-specific TEDx presentation components
│   │   │   ├── Cards.tsx       # Speaker, Partner, and Event cards
│   │   │   ├── Footer.tsx      # Multi-column footer and social links
│   │   │   ├── Header.tsx      # Navigation bar and responsive drawer
│   │   │   ├── NewsletterForm.tsx # Subscription form with feedback toast
│   │   │   ├── PageHero.tsx    # Standardized inner-page hero layout
│   │   │   ├── RegisterBanner.tsx # Call-to-action registration banner
│   │   │   ├── Reveal.tsx      # Motion animation wrappers
│   │   │   └── SectionHeading.tsx # Editorial section headers
│   │   └── ui/                 # Reusable atomic UI components (Radix/Shadcn)
│   ├── integrations/
│   │   └── supabase/           # Database clients, auth middleware, and types
│   │       ├── auth-middleware.ts
│   │       ├── client.server.ts # Server-side Supabase client
│   │       ├── client.ts        # Browser-side Supabase client
│   │       ├── cron-auth.ts     # Webhook/cron secret validation
│   │       └── types.ts         # Autogenerated database type definitions
│   ├── lib/
│   │   ├── queries.ts          # TanStack Query definitions for API data
│   │   ├── site.ts             # Site metadata, navigation links, and social URLs
│   │   └── utils.ts            # ClassName merging and styling helpers
│   ├── routes/                 # File-based routes
│   │   ├── __root.tsx          # Root shell, HTML tags, and layout
│   │   ├── index.tsx           # Home / Launch experience
│   │   ├── about.tsx           # About TEDxLafia and organizers
│   │   ├── contact.tsx         # Inquiries and contact forms
│   │   ├── events.tsx          # Schedule, dates, and venue
│   │   ├── partners.tsx        # Sponsor tiers and partner showcase
│   │   ├── register.tsx        # Attendee registration intake
│   │   └── speakers.tsx        # Speaker roster and presentation topics
│   ├── styles.css              # Global styles, Tailwind v4 imports, and theme tokens
│   └── routeTree.gen.ts        # Generated TanStack route manifest
├── .env                        # Local environment configuration
├── bunfig.toml                 # Package manager configuration
├── components.json             # ShadCN UI configuration
├── eslint.config.js            # Linter rules and TypeScript checks
├── package.json                # Project dependencies and operational scripts
├── tsconfig.json               # TypeScript compiler options
└── vite.config.ts              # Vite and TanStack Start build configuration
```

---

## Route Hierarchy

| Route Path | File Location | Purpose |
| :--- | :--- | :--- |
| `/` | `src/routes/index.tsx` | Main event landing and coming soon teaser |
| `/about` | `src/routes/about.tsx` | Mission, organizer team, and TED licensing notes |
| `/events` | `src/routes/events.tsx` | Event schedule, stage breakdowns, and logistics |
| `/speakers` | `src/routes/speakers.tsx` | Speaker catalog and talk synopsis |
| `/partners` | `src/routes/partners.tsx` | Sponsor acknowledgment and partnership opportunities |
| `/contact` | `src/routes/contact.tsx` | General, media, and partnership inquiry submission |
| `/register` | `src/routes/register.tsx` | Attendee ticket applications and waitlist registration |

---

## Component Architecture

- `Header`: Sticky glassmorphic top navigation bar featuring the official `TEDxLafia` logo, accessibility skip-links, desktop menu anchors, and an animated full-screen mobile menu.
- `Footer`: Editorial dark-themed section containing legal licensing statements, quick navigation, social links (X, Instagram, LinkedIn), and the newsletter subscription widget.
- `PageHero`: Standardized hero section for secondary pages, displaying category eyebrows, Cormorant Garamond headings, and supporting descriptions.
- `Reveal`: Scroll-triggered entrance animations utilizing cubic bezier easing curves for natural transitions.
- `Cards`:
  - `SpeakerCard`: Displays speaker portrait, speaker name, institutional title, and presentation subject.
  - `PartnerTile`: Minimalist tile displaying sponsor logo, partnership tier, and optional external link.
  - `EventCard`: Highlights event date, stage title, theme, and ticket link.

---

## Environment Variables

Create a `.env` file in the project root directory based on the following keys:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key

# Server-Side Configuration (Optional / Admin access)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Cron and Webhook Security
CRON_SECRET=your-cron-secret
```

---

## Getting Started

### Prerequisites

- Node.js: version 18.18 or later (Node.js 20 or 22 LTS recommended)
- Package Manager: `npm`, `pnpm`, or `bun`

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/osamaabdul/tedxlafia-style-guide.git
cd tedxlafia-style-guide
npm install
```

### Development Server

Start the local development server:

```bash
npm run dev
```

The application will be available at `http://localhost:8080/` (or the next available port indicated by the CLI).

### Production Build and Preview

To generate the optimized production bundle:

```bash
npm run build
```

This compiles client-side assets into `.output/public` and the server application into `.output/server`.

To preview the production build locally:

```bash
npm run preview
```

---

## Code Quality and Formatting

The codebase enforces strict TypeScript typing, ESLint checks, and Prettier code formatting.

- Run code linting:
  ```bash
  npm run lint
  ```
- Format code according to repository standards:
  ```bash
  npm run format
  ```

---

## Deployment

The application is configured to build using Nitro with the Cloudflare module preset by default, but it can be deployed to any hosting service supporting SSR or static deployment:

- Cloudflare Workers / Pages: Deploy using Wrangler and the generated `.output/server/wrangler.json` manifest.
- Vercel / Netlify: Connect repository directly with standard build command `npm run build` and output directory `.output`.
- Node.js Container / Docker: Run the Nitro entry point with `node .output/server/index.mjs`.

---

## License and Attribution

- TEDx events are independently organized under official license from TED Conferences, LLC.
- Content, photography, and brand assets for TEDxLafia are the property of the TEDxLafia organizing committee.
- Codebase source code is maintained for TEDxLafia. All rights reserved.
