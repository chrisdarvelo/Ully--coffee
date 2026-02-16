# Ully Coffee — App Store Metadata

## App Name
Ully Coffee

## Subtitle (30 chars max)
AI Coffee Companion

## Category
Primary: Food & Drink
Secondary: Lifestyle

## Description

Ully is a coffee companion for baristas and enthusiasts. Get AI-powered help dialing in espresso, scan equipment parts, save recipes, and stay current with coffee industry news.

**AI-Powered Assistance**
Chat with Ully AI for help with extraction troubleshooting, grinder calibration, water chemistry, and more. Snap a photo of your espresso or equipment and get instant analysis and dial-in suggestions.

**Recipes**
Build your personal recipe library with brew method, dose, yield, and tasting notes. Starter recipes included to get you going.

**Baristas**
Follow curated barista profiles and read their latest blog posts and insights from the specialty coffee world.

**Cafes**
Keep a personal collection of cafes with notes, locations, and what you ordered.

**Daily News**
Stay informed with the latest articles from Perfect Daily Grind, Barista Magazine, and Daily Coffee News — updated daily.

**Privacy First**
No ads, no tracking, no analytics SDKs. Photos are analyzed in real-time and never stored. Chat history stays on your device.

## Keywords (100 chars max)
coffee,espresso,barista,dial-in,extraction,grinder,recipes,latte,brew,AI

## Support URL
https://ullycoffee.com

## Support Email
support@ullycoffee.com

## Marketing URL (optional)
https://ullycoffee.com

---

## Apple Privacy Nutrition Labels

### Data Linked to You

| Data Type | Purpose | Details |
|-----------|---------|---------|
| Email Address | App Functionality | Firebase Auth — account creation and login |
| Other User Content | App Functionality | Profile info (display location, favorite shops), recipes, cafe bookmarks — stored in Firebase linked to account |

### Data Not Linked to You

| Data Type | Purpose | Details |
|-----------|---------|---------|
| Photos or Videos | App Functionality | Sent directly to Anthropic API for real-time analysis; not stored on any server |
| Other User Content | App Functionality | Chat messages with AI — stored locally on device only, never transmitted to our servers |

### Data NOT Collected
- Precise Location
- Coarse Location (user types a city name manually — this is user content, not device location)
- Health & Fitness
- Financial Info
- Contacts
- Browsing History
- Search History
- Identifiers (no device ID, ad ID, etc.)
- Diagnostics
- Usage Data (no analytics SDK)
- Purchases

### Tracking Declaration
**This app does not track users.** No data is shared with data brokers, no ad networks, no analytics platforms.

### Notes for Apple Review
- Date of birth is collected at signup for age verification (13+) but is NOT stored on any server — it is only used client-side to calculate age and is discarded.
- Photos sent to Anthropic API are processed under Anthropic's API terms: inputs are not used for model training and are retained only briefly for trust & safety.
- All user content (recipes, cafes, profile) is stored in Firebase and linked to the authenticated user.
- Chat history is stored in AsyncStorage on-device only.
- No third-party analytics, advertising, or tracking SDKs are used.
- Camera and photo library access are used solely for AI-powered coffee equipment scanning and espresso extraction analysis.

---

## Google Play Store

### Short Description (80 chars max)
AI coffee companion — dial-in espresso, scan parts, save recipes, read news.

### Full Description
(Use the same App Store description above.)

### Category
Food & Drink

### Content Rating
Everyone (no objectionable content)

### Data Safety
- **Data shared with third parties:** Photos shared with Anthropic API for analysis (not stored)
- **Data collected:** Email address, user-created content (profile, recipes, cafes)
- **Security:** Data encrypted in transit (HTTPS), Firebase encryption at rest
- **Data deletion:** Users can request account deletion via support@ullycoffee.com (in-app deletion flow planned)

---

## Screenshots Needed

### iPhone 6.7" (iPhone 14 Pro Max — 1290x2796)
1. Home screen with recipes, news, baristas sections populated
2. AI chat conversation showing coffee help
3. Camera scan view with the scan frame overlay
4. Recipe detail screen with procedural art cover
5. Barista detail screen with blog posts

### iPhone 5.5" (iPhone 8 Plus — 1242x2208)
Same 5 screens at this resolution.

### iPad (optional, if supportsTablet stays true)
Same screens at iPad resolution.

### Android (Play Store — min 2, max 8)
Same screens, taken on Android device/emulator.

---

## support@ullycoffee.com Setup

Options:
1. **Domain email forwarding** — Forward support@ullycoffee.com to your personal email via your domain registrar (Namecheap, Cloudflare, Google Domains, etc.)
2. **Google Workspace** — Full inbox at ~$6/mo
3. **Zoho Mail free tier** — Free custom domain email (1 user)
4. **Cloudflare Email Routing** — Free forwarding if domain is on Cloudflare
