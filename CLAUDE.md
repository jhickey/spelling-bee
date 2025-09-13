# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a Spelling Bee word game replica that fetches actual NYT letters and allows users to find words using seven given letters (one center letter that must be used in all words). The game tracks user progress, points, and rankings with persistent sessions stored in PostgreSQL via Prisma ORM.

## Key Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run start` - Run database migrations and start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run Jest tests in watch mode
- `npm run db:migrate` - Run Prisma database migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:studio` - Open Prisma Studio for database management
- `npm run sync-game` - Sync game data (fetches from NYT)

## Architecture

### State Management
- **Zustand** store (`src/useStore/index.ts`) manages all game state including:
  - Game data (letters, answers, pangrams, user progress)
  - Found words and user points
  - Hints system (remaining words by starting letter)
  - Ranking levels that unlock additional hints

### Database Layer
- **PostgreSQL** database with **Prisma ORM** (`src/utils/database.ts`)
- Three main models: `Game` (daily puzzles), `Session` (user progress), `User` (accounts)
- Schema defined in `prisma/schema.prisma` with type-safe client generation
- Database migrations handled by Prisma (`npm run db:migrate`)

### Next.js Structure
- **SSR authentication** on main page (`pages/index.tsx`) using `authPage` utility
- Game data pre-loaded server-side from database
- API routes in `pages/api/` for session persistence

### Game Logic
- Core game utilities in `src/utils/game.ts` handle:
  - Point calculation (4-letter words = 1pt, longer = length, pangrams = length + 7)
  - Ranking system (8 levels from Beginner to Queen Bee)
  - Hints generation (word counts by starting letter and length)

### Component Structure
- Main game component (`src/components/Game/index.tsx`)
- Hexagonal letter layout (`src/components/Game/Hexagon.tsx`, `src/components/Game/Letters.tsx`)
- Hints system with progressive revelation based on ranking
- User progress tracking with confetti for pangrams

## Tech Stack
- Next.js with TypeScript
- Zustand for state management
- PostgreSQL with Prisma ORM
- Tailwind CSS for styling
- Jest for testing
- Material UI components

## Data Flow
1. Server-side: Fetch latest game data and user session from PostgreSQL via Prisma
2. Client-side: Initialize Zustand store with server data  
3. User interactions update store and POST to `/api/session` 
4. Hints unlock progressively as user achieves higher rankings

## Environment Setup
- Requires `DATABASE_URL` environment variable for PostgreSQL connection
- Run `npm run db:migrate` to set up database schema
- Use `npm run db:studio` to inspect database during development