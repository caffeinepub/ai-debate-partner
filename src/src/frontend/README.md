# AI Debate Partner Frontend

A React-based debate practice application where users can practice argumentation skills against an AI opponent.

## Features

### 1. **Authentication & User Profiles**
- Internet Identity login integration
- Guest mode with 5-debate limit
- User profile setup on first login
- Persistent user data with role-based access

### 2. **Home Dashboard** (`/`)
- Topic input with trending suggestions
- Category selection (Politics, Technology, Education, Ethics, Business, Entertainment, Custom)
- Debate mode selection (Casual, Competitive, Exam Preparation)
- Response length preference (Short, Medium, Detailed)

### 3. **Side Selection** (`/side-selection`)
- Visual card-based interface
- Choose to Support or Oppose the topic
- Shows AI's opposing side automatically

### 4. **Debate Chat Interface** (`/debate/:debateId`)
- WhatsApp-style chat UI with message animations
- Real-time AI response generation with typing indicator
- Bold text highlighting for key arguments
- Timer for Exam Preparation mode
- End debate functionality

### 5. **Post-Debate Scoring** (`/score/:debateId`)
- Overall performance score (0-100)
- Breakdown: Logical Strength, Confidence, Clarity
- AI-generated improvement tips
- Share and export functionality

### 6. **Performance Dashboard** (`/dashboard`)
- Total debates completed
- Win rate percentage
- Strongest and weakest categories
- Recent debates list with scores

### 7. **Debate History** (`/history`)
- Searchable debate archive
- Filter by category
- View full transcripts in modal
- Review improvement tips

## Design System

### Theme
- **Dark Mode**: Deep space navy background (#0a0f1e)
- **Primary**: Deep blue (#1e3a8a)
- **Accent**: Electric cyan (#06b6d4)
- **Typography**: Space Grotesk for display text

### Key Design Features
- Electric gradient text on branding
- Pulsing glow effects on AI messages
- Smooth slide-up animations on messages
- Progress bars with animated fills
- Card-based layouts throughout

## Tech Stack

- **React 19** with TypeScript
- **TanStack Router** for routing
- **React Query** for state management
- **shadcn/ui** component library
- **Tailwind CSS** with OKLCH color system
- **Internet Computer** backend integration

## File Structure

```
src/frontend/src/
├── pages/
│   ├── HomePage.tsx
│   ├── SideSelectionPage.tsx
│   ├── DebateChatPage.tsx
│   ├── PostDebateScorePage.tsx
│   ├── PerformanceDashboardPage.tsx
│   └── DebateHistoryPage.tsx
├── components/
│   ├── RootLayout.tsx
│   └── ProfileSetupModal.tsx
├── hooks/
│   ├── useQueries.ts (React Query hooks)
│   ├── useActor.ts (Backend actor)
│   └── useInternetIdentity.ts (Auth)
├── App.tsx (Router setup)
├── routeTree.tsx (Route definitions)
└── backend.d.ts (Type definitions)
```

## Development

```bash
# Install dependencies
pnpm install

# Run type checking
pnpm --filter '@caffeine/template-frontend' typescript-check

# Run linter
pnpm --filter '@caffeine/template-frontend' lint

# Build
pnpm --filter '@caffeine/template-frontend' build:skip-bindings
```

## Backend Integration

The app expects these backend methods (defined in `backend.d.ts`):

- `getCallerUserProfile()` - Get current user's profile
- `saveCallerUserProfile(profile)` - Save user profile
- `addToDebateHistory(debate)` - Save completed debate
- `getUserStats(user)` - Get user statistics
- `getCallerUserRole()` - Check if user is guest or authenticated
- `makeHttpOutcall(url)` - Make HTTP requests for AI responses

## Mobile Responsiveness

- Fully responsive design
- Mobile-first approach
- Touch-friendly interactions
- Optimized chat interface for small screens
- Responsive navigation with collapsible menu
