# Ully Coffee — Instructional Context

This document provides foundational mandates and architectural context for Gemini CLI when working on the **Ully Coffee** project.

## Project Overview
Ully Coffee is a professional-grade diagnostic assistant for coffee equipment technicians, café owners, and baristas. It leverages AI (Anthropic Claude via Firebase proxy) and computer vision to diagnose machine issues, identify parts, and provide brewing dial-in suggestions.

### Main Technologies
- **Framework:** React Native (Expo SDK 54)
- **Language:** TypeScript (Strict Mode)
- **State Management:** Zustand (Auth & Profile)
- **Data Fetching:** TanStack Query (React Query v5)
- **Backend:** Firebase (Auth, Firestore, Storage, Cloud Functions)
- **AI Integration:** Claude 3.5 Sonnet (Proxied through Firebase Functions for security)
- **UI/UX:** Vanilla React Native StyleSheet, Expo Haptics, Shimmer Skeletons

## Architectural Mandates

### 1. Security & API Safety
- **Zero Direct API Calls:** Never make direct web requests to Anthropic or other third-party LLM providers from the client. All AI communication must go through the `ClaudeService.ts` which uses the `chatWithUlly` Firebase Function.
- **Secret Protection:** API keys must never be hardcoded. Use `Constants.expoConfig?.extra` via `app.config.js` and `.env`.
- **Encrypted Storage:** Use `expo-secure-store` for any sensitive user identifiers or PII. Use `AsyncStorage` only for non-sensitive UI state/cache.

### 2. Type Safety
- **Strict TypeScript:** Maintain 100% type coverage. Core data models are defined in `types/index.ts`. Always use these interfaces (`Recipe`, `Barista`, `Cafe`, `UserProfile`, `ChatMessage`) instead of `any`.
- **Navigation Typing:** Use `RootStackParamList` and `TabParamList` defined in `navigation/AppNavigator.tsx` for all navigation actions.

### 3. State Management Strategy
- **Global UI/Auth State:** Managed via Zustand stores in the `store/` directory (`authStore.ts`, `profileStore.ts`).
- **Server State:** Managed via TanStack Query. Prefer `useQuery` for fetching and `useMutation` with Optimistic UI updates for data modifications (see `BaristaDetailScreen.tsx` for an implementation example).

### 4. Performance & UX
- **Skeleton Loaders:** When adding new list-based screens, implement a corresponding skeleton loader using the `Skeleton` component in `components/SkeletonLoader.tsx`.
- **Tactile Feedback:** Use `expo-haptics` for meaningful user actions (button presses, successful form submissions, AI responses).
- **Error Handling:** Ensure all new root-level components are wrapped or accessible via the `ErrorBoundary.tsx`.

## Key Commands

### Development
- `npm start`: Start Expo Go development server.
- `npm run android`: Run on Android emulator/device.
- `npm run ios`: Run on iOS simulator/device.

### Testing
- `npm test`: Run unit and hook tests using Jest.
- `npm run test:watch`: Run Jest in watch mode.
- `npm run e2e`: Run the full Maestro "Happy Path" E2E suite.

### Infrastructure
- `node scripts/generate-icon.js`: Re-generate high-res branding assets (Icon, Splash) from the SVG blossom design.

## Development Conventions
- **Component Structure:** Prefer functional components with custom hooks for logic extraction.
- **Folder Organization:**
  - `components/`: Modular UI atoms and molecules.
  - `hooks/`: Extracted logic (e.g., `useCamera`, `useUllyChat`).
  - `services/`: API and third-party integrations.
  - `store/`: Zustand global state.
  - `screens/`: Top-level route components.
  - `utils/`: Pure helper functions and constants.
- **Naming:** CamelCase for components/files, camelCase for variables/functions. Always use `.tsx` for React components.
