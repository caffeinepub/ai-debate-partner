# AI Debate Partner

## Current State
New project - no existing codebase.

## Requested Changes (Diff)

### Add
- **User Authentication**: Internet Identity (passkey-based) authentication with guest mode support
- **Home Screen**: Topic input, suggested debate topics, debate mode selection (Casual, Competitive, Exam Preparation)
- **Side Selection**: Allow users to choose Support or Oppose, AI takes opposite side
- **Real-time Chat Debate Interface**: Chat UI with user and AI messages, typing indicators, argument highlighting
- **AI Debate Engine**: Backend integration with AI to generate intelligent counter-arguments based on topic, user position, and conversation context
- **Response Length Settings**: Three levels - Short (2-3 lines), Medium (paragraph), Detailed (structured argument)
- **Debate Scoring System**: Post-debate analysis with Logical Strength, Confidence, Clarity scores and improvement suggestions
- **Performance Dashboard**: Track total debates, win rate, strongest/weakest categories
- **Topic Categories**: Politics, Technology, Education, Ethics, Business, Entertainment, Custom
- **Exam Mode**: UPSC-style topics with time limits and structured guidance
- **Debate History**: Save debate transcripts, export as PDF/image, share functionality
- **Content Moderation**: Filter inappropriate content and extreme language

### Modify
N/A (new project)

### Remove
N/A (new project)

## Implementation Plan

### Backend (Motoko)
1. **User Management**
   - User profile storage with debate history
   - Guest mode session tracking
   - User statistics (total debates, scores, categories)

2. **Debate Session Management**
   - Create debate session with topic, user side, AI side, mode, response length
   - Store debate turns (user arguments, AI counter-arguments)
   - End debate and calculate scores
   - Retrieve debate history and transcripts

3. **AI Integration**
   - HTTP outcalls to AI service for generating counter-arguments
   - Context-aware responses based on debate history
   - Adjust response length and complexity based on mode
   - Content moderation filter integration

4. **Scoring Engine**
   - Analyze debate quality (logical strength, confidence, clarity)
   - Generate improvement suggestions
   - Calculate win rate and performance metrics

5. **Topic Management**
   - Predefined topic suggestions by category
   - Trending topics
   - Custom topic validation

### Frontend (React + TypeScript + Tailwind)
1. **Authentication Pages**
   - Login page with Internet Identity integration
   - Guest mode option
   - User profile setup

2. **Home Dashboard**
   - Topic input field with autocomplete
   - Trending topic cards
   - Category selection
   - Debate mode selector (Casual/Competitive/Exam)
   - Response length preference

3. **Side Selection Screen**
   - Visual card-based selection (Support vs Oppose)
   - Topic summary display
   - AI side indicator

4. **Debate Chat Interface**
   - WhatsApp-style chat UI
   - User messages (right-aligned, blue)
   - AI messages (left-aligned, cyan accent)
   - Bold highlighting for key arguments
   - Typing indicator when AI is responding
   - Debate timer for Exam mode
   - End debate button

5. **Post-Debate Scoring Screen**
   - Score breakdown with visual meters
   - AI-generated improvement suggestions
   - Save/Export/Share options
   - Start new debate CTA

6. **Performance Dashboard**
   - Statistics cards (total debates, win rate)
   - Category strength chart
   - Recent debates list
   - Historical trend graphs

7. **Debate History**
   - List of past debates with topic and date
   - View full transcript
   - Export as PDF or share as image
   - Delete debate option

## UX Notes
- **Theme**: Dark theme with deep blue primary (#1e3a8a) and neon cyan accent (#06b6d4)
- **Typography**: Modern sans-serif (Inter or similar)
- **Animations**: Smooth message transitions, fade-ins for new debates, subtle hover effects
- **Mobile-First**: Responsive design optimized for phone screens
- **Accessibility**: Keyboard navigation, screen reader support, high contrast text
- **Progressive Disclosure**: Guest users see upgrade prompts after 5 debates
- **Error Handling**: Graceful fallbacks if AI service is slow or unavailable
- **Performance**: Lazy load debate history, optimize chat rendering for long debates
