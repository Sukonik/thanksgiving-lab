<p align="center"><img src="assets/favicon.svg" width="96" height="96" alt="Thanksgiving Lab turkey mark"></p>

# 🦃 Thanksgiving Lab

<p align="center">
  <a href="https://sukonik.github.io/thanksgiving-lab/"><img alt="Open Thanksgiving Lab V1" src="https://img.shields.io/badge/🦃_OPEN_THANKSGIVING_LAB-V1.0.0-D97832?style=for-the-badge"></a>
</p>

<p align="center">
  <a href="https://sukonik.github.io/thanksgiving-lab/#food"><img alt="Food Lab" src="https://img.shields.io/badge/🍽️_FOOD_LAB-4C1F14?style=flat-square"></a>
  <a href="https://sukonik.github.io/thanksgiving-lab/#weekend"><img alt="Weekend Planner" src="https://img.shields.io/badge/🏡_WEEKEND-355E3B?style=flat-square"></a>
  <a href="https://sukonik.github.io/thanksgiving-lab/#weather"><img alt="Turkey Weather" src="https://img.shields.io/badge/🌦️_TURKEY_WEATHER-7B4B94?style=flat-square"></a>
  <a href="https://sukonik.github.io/thanksgiving-lab/#notes"><img alt="Quick Notes" src="https://img.shields.io/badge/📝_QUICK_NOTES-B36B32?style=flat-square"></a>
</p>

<p align="center">
  <a href="https://github.com/Sukonik/thanksgiving-lab/issues/12"><img alt="V1 Roadmap" src="https://img.shields.io/badge/🗺️_V1_ROADMAP-Issues-6E4B3A?style=flat-square"></a>
  <a href="https://github.com/Sukonik/thanksgiving-lab/issues"><img alt="Issues" src="https://img.shields.io/badge/💡_ISSUES-Build_Next-8B5A2B?style=flat-square"></a>
  <a href="https://github.com/Sukonik/thanksgiving-lab"><img alt="Source" src="https://img.shields.io/badge/💻_SOURCE-GitHub-181717?style=flat-square&logo=github"></a>
</p>

> **Current website: [Thanksgiving Lab V1.0.0](https://sukonik.github.io/thanksgiving-lab/)** · The newest public release always lives at this address.

**Plan the meal, host the weekend, and keep Thanksgiving enjoyable.**

Thanksgiving Lab is a free, accountless website for organizing Thanksgiving dinner and the surrounding holiday weekend. It brings food planning, hosting logistics, local travel, entertainment, weather, and printable quick notes into one friendly workspace.

> **No signup. No cloud account. Your Thanksgiving plan is a file you own.**

## 🌟 Why this website could be useful

Thanksgiving is rarely just one meal. A host may need to coordinate several days of groceries, cooking, guests, transportation, sleeping arrangements, entertainment, and cleanup.

Thanksgiving Lab is intended to answer practical questions in one place:

- 🛒 What food still needs to be purchased?
- 🍗 What should be prepared today, tomorrow, or just before dinner?
- 🔥 Which dishes compete for the oven?
- 🍽️ How many sit-down meals will happen during the weekend?
- 🛋️ Where will everyone eat, relax, and spend time afterward?
- 🏡 Who is staying at the host's home, a hotel, or an Airbnb?
- 🚆 How is everyone arriving and getting around?
- 🌦️ Will weather affect shopping, travel, outdoor plans, or dinner timing?
- 🎵 What should be playing while people cook, eat, and relax?
- 📝 What does the host need on one printable page?

The goal is a calm Thanksgiving command center that works on a phone in the grocery store, on a tablet in the kitchen, and on a computer while planning.

## 🧪 The Lab family

Thanksgiving Lab is the focused first member of a possible planning family:

| Project | Focus |
|---|---|
| **🦃 Thanksgiving Lab** | Thanksgiving dinner and the full holiday weekend |
| **🎄 Holiday Lab** | Gifts, events, meals, traditions, and seasonal celebrations |
| **🌴 Vacation Lab** | Trips, lodging, itineraries, packing, budgets, and local plans |

The projects can share an accountless packet foundation while keeping their own personality, features, logo, and favicon system.

## 📦 Accountless plan packets

The portable workspace concept is inspired by [Payout Lab](https://github.com/Sukonik/payout-lab).

A Thanksgiving plan can be stored in a small downloadable file, tentatively named a **Thanksgiving Packet**:

```text
Sukonik-Thanksgiving-2026.thanks
```

The packet acts like the account:

- 💾 Continue from a remembered copy on the current device
- 📥 Download the complete plan as a private backup
- 📤 Open the packet on another device without signing in
- 🧬 Track revisions so older and diverging copies are not silently overwritten
- 🧾 Save frozen planning receipts before major changes
- 🔒 Keep data in the browser by default

V1 packets are plain JSON with validation and an integrity checksum. They would **not be encrypted**, so the app must clearly warn users not to store payment cards, identity documents, door codes, or other highly sensitive information.

## 🍽️ Food Lab

The food system should connect planning to action:

- 🛒 Grocery list grouped by store section
- 🥕 Pantry check and ingredients already on hand
- 📋 Thanksgiving menu builder
- 👨‍🍳 Cookbook for saved recipes and family favorites
- ⏱️ Preparation timeline for the week and the day
- 🔥 Oven, stovetop, slow-cooker, grill, and reheating schedule
- 🧊 Make-ahead, refrigerate, freeze, thaw, and resting guidance
- 🥧 Potluck assignments and dietary notes
- 🥡 Leftover plan and take-home containers
- 💵 Food budget with planned and purchased totals

The distinctive feature should be **Oven Traffic Control**: work backward from dinner time, spot appliance conflicts, and suggest a practical cooking order.

## 📝 Quick Notes and printable packets

Inspired by [WYWO](https://github.com/Sukonik/wywo), Thanksgiving Lab should make compact, printable PDF notes rather than forcing users to print the entire app.

Suggested printouts:

- 🛒 Grocery run sheet
- 🍗 Cooking-day timeline
- 🔥 Oven schedule
- 🍽️ Menu card
- 👥 Guest and dietary summary
- 🚗 Arrival and transportation sheet
- 🏠 Overnight-stay plan
- 🧹 Cleanup assignments
- 🥡 Leftover labels and distribution list
- 📦 Full host packet

PDF generation should happen in the browser whenever practical.

## 🏡 Weekend and hosting planner

The planner should cover the whole visit:

- 📅 Select the arrival and departure window
- 🍽️ Count planned breakfasts, lunches, sit-down dinners, and casual meals
- 👥 Track guests, children, dietary needs, and attendance by day
- 🪑 Plan seating, serving areas, and conversation spaces
- 🛋️ Decide where guests can rest after dinner
- 🛏️ Track home stays, nearby hotels, and Airbnb options
- 🚿 Note household capacity without collecting unnecessary personal information
- 🎲 Schedule walks, games, football, parade viewing, and quiet time
- 🧼 Assign setup, dishes, cleanup, and next-morning tasks

Lodging results should begin as saved links and notes. The app should not pretend to book or guarantee availability.

## 🚲 Transportation and local help

A ZIP-code-centered local page can organize:

- 🚲 Bike and walking options
- 🚆 Local transit links
- 🚕 Taxi and rideshare notes
- 🚗 Driving, parking, pickup, and carpool plans
- ✈️ Airport and train arrival information
- 🛒 Grocery stores and pharmacies
- 🏨 Hotels and short-term-stay links
- 🍽️ Restaurants and backup meal options
- 🏥 Urgent local services

The first release should favor dependable official links and user-saved places over a complicated live search backend.

## 🎵 Thanksgiving atmosphere

Thanksgiving planning also includes the mood:

- 🎶 Curated Spotify playlist links
- 🎬 Family movie suggestions
- 📺 Parade and football viewing notes
- 🔥 YouTube fireplace and seasonal ambience links
- 🎲 Games and conversation prompts
- 👧 Children’s activities
- 🌙 Quiet evening options

V1 can curate and save links without requiring Spotify, Google, or YouTube accounts.

## 🌦️ Turkey Weather

Thanksgiving Lab can borrow ideas and weather-data patterns from [ClearSky](https://github.com/Sukonik/weather-app) while giving the experience its own seasonal page.

**Turkey Weather** could include:

- 🦃 Thanksgiving Day weather card
- 🚗 Travel-window conditions
- 🛒 Grocery-run forecast
- 🍂 Outdoor walk and yard setup conditions
- 🌧️ Rain, wind, temperature, and sunset
- 🧥 Simple clothing and hosting reminders
- ☀️ Small weather icons in the main navigation header

Weather should remain helpful context, not crowd out the planning tools.

## 🎨 Brand direction

Thanksgiving Lab should feel warm, practical, and slightly playful rather than like a generic recipe blog.

Early visual direction:

- **Symbol:** a clean turkey, wishbone, covered serving dish, or laboratory-flask hybrid
- **Primary colors:** harvest copper, cranberry, cream, and dark evergreen
- **Interface:** recipe-card warmth combined with a clean planning dashboard
- **Icon style:** bold, readable silhouettes that survive at favicon size
- **Seasonal motion:** subtle steam, falling leaf, or glowing oven accents with reduced-motion support

A later branding package should include:

- Primary logo and simplified mark
- Black, white, and color variants
- Transparent PNG and SVG exports
- Browser favicons
- Apple touch icon
- PWA icons
- Social preview image
- Light and dark header treatments

## 🚧 V1 build target

V1 should prove that the website is genuinely useful before expanding into every holiday feature.

### Core release

1. 📦 Create, remember, save, and open a Thanksgiving Packet
2. 🏠 Thanksgiving weekend dashboard
3. 🍽️ Menu, cookbook, shopping list, and preparation timeline
4. 🔥 Oven Traffic Control
5. 👥 Guests, meals, rest spaces, and overnight stays
6. 🚗 Transportation and ZIP-code local links
7. 📝 WYWO-style printable quick notes and host PDF
8. 🎵 Entertainment and atmosphere collections
9. 🌦️ Turkey Weather page and header icons
10. 📱 Mobile-first GitHub Pages release

## 🗺️ Build sequence

| Phase | Outcome |
|---|---|
| **V1A · Foundation** | Static app shell, navigation, device storage, packets |
| **V1B · Food** | Menu, cookbook, shopping, prep, oven schedule |
| **V1C · Hosting** | Guests, meals, spaces, lodging, transportation |
| **V1D · Useful extras** | PDFs, entertainment, local links, Turkey Weather |
| **V1E · Release** | Accessibility, mobile QA, privacy copy, GitHub Pages |
| **Later · Identity** | Logo, favicon family, PWA icons, themed visual polish |

## 🕰️ Website version history

The main website address always opens the newest release. Older releases remain documented here by permanent commit so the project can be traced and restored.

| Version | Date | Status | Highlights |
|---|---|---|---|
| **V1.0.0** | 2026-11-16 | **Current** | First public website: warm pearlescent command center, four harvest themes, local device saving, checksum-protected `.thanks` packets, Food Lab, weekend logistics, Quick Notes printing, atmosphere links, and live Turkey Weather. |

**Maintenance rule:** when the site changes in a user-visible way, keep the newest live link at the top of this README, move the previous Current entry into this table, and add the new release above it.

## 🔐 Privacy principles

- No signup required
- No analytics or trackers by default
- User plans stay in the browser unless deliberately exported or shared
- The app shows exactly what a packet, PDF, link, or QR code contains
- Sensitive reservation details are excluded from public summaries
- No payment information, identity documents, or access codes
- Device storage is convenient but never described as a backup

## 💡 Project status

Thanksgiving Lab V1.0.0 is live on GitHub Pages. The issue tracker contains the next build slices and acceptance criteria.

Contributions and practical Thanksgiving-hosting ideas are welcome.
