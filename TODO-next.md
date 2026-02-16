# Ully Coffee — Next Steps

## Current State
- 3-tab app: Home / AI / Profile
- AI tab handles chat, camera scan, dial-in, troubleshoot
- Onboarding is 2 steps (location + favorite shops)
- Privacy policy, AI disclosure, permission strings done
- Domain: ullycoffee.com, email: support@ullycoffee.com
- Cleaned up: equipment system, diagnostic screen, result screen

---

## Priority 1: App Store Readiness

### 1. Wire up NewsService to Home screen
- NewsService exists but isn't connected to anything
- Home screen needs content — currently what does it show?
- Could display coffee news, tips, or curated content from baristas

### 2. App Icon & Splash Screen
- Current splash is just a background color (#F5F0EB)
- Need a proper app icon using the coffee flower design
- Splash screen should show the flower + "Ully" text

### 3. App Store Metadata
- Screenshots (6.7" and 5.5" sizes)
- App description, keywords, category
- Privacy nutrition labels (Apple requires these)
- Support URL: ullycoffee.com
- Set up support@ullycoffee.com forwarding

---

## Priority 2: Polish & UX

### 4. Voice input (mic button)
- Mic button exists on AI screen but toggleMic just toggles state
- Wire up expo-speech-recognition to actually transcribe voice

### 5. Loading & empty states
- Home screen empty state if no content
- Better error handling across the app

### 6. Delete account flow
- Privacy policy mentions "delete your account by contacting us"
- Apple requires in-app account deletion — add to Settings

---

## Priority 3: Nice to Have

### 7. Barista follow system content
- Recent commit added baristas as curated artists with follow system
- Make sure this flows well on the Home screen

### 8. Push notifications setup
- Settings has "Coming soon" placeholder
- Decide what notifications make sense (new barista content, tips)

### 9. Dark mode
- Currently light only — low priority but good for v1.1
