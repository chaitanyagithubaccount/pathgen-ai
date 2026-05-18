# ⚡ PathGen AI — Technical Documentation

> **IIT Patna Generative AI Capstone Sprint 2026**
>
> PathGen AI eliminates the #1 reason learners quit — no clear plan. You enter a skill, your level, and how many hours a day you can commit; Google Gemini 2.5 Flash returns a structured, week-by-week, day-by-day roadmap with topics, actionable tasks, curated YouTube videos, reference links, and mini projects — all in under 60 seconds. No account required. Progress is tracked locally and persists across sessions.

---

## 👤 About the Builder

| | |
|---|---|
| **Name** | Chaitanya Bharti |
| **Role** | Lead Software Engineer at Wells Fargo |
| **Location** | Bengaluru, Karnataka, India |
| **LinkedIn** | [linkedin.com/in/chaitanya-bharti-044a536a](https://www.linkedin.com/in/chaitanya-bharti-044a536a/) |
| **GitHub** | [github.com/chaitanyagithubaccount](https://github.com/chaitanyagithubaccount/pathgen-ai) |

---

## 🔗 Live Links

| Resource | URL |
|----------|-----|
| 🌐 **Frontend (Live App)** | [pathgen-ai-production-0811.up.railway.app](https://pathgen-ai-production-0811.up.railway.app) |
| ⚙️ **Backend API** | [pathgen-ai-production.up.railway.app](https://pathgen-ai-production.up.railway.app) |
| 📦 **GitHub Repository** | [github.com/chaitanyagithubaccount/pathgen-ai](https://github.com/chaitanyagithubaccount/pathgen-ai) |

---

## 📋 Table of Contents

1. [System Overview](#1-system-overview)
2. [System Flow](#2-system-flow)
3. [API Flow](#3-api-flow)
4. [Frontend Architecture](#4-frontend-architecture)
5. [Backend Architecture](#5-backend-architecture)
6. [Prompt Engineering Strategy](#6-prompt-engineering-strategy)
7. [Data Models](#7-data-models)
8. [State Management](#8-state-management)
9. [PDF Export Implementation](#9-pdf-export-implementation)
10. [Challenges & Solutions](#10-challenges--solutions)
11. [Learnings](#11-learnings)
12. [Performance Considerations](#12-performance-considerations)

---

## 1. System Overview

PathGen AI is a full-stack GenAI web application that bridges the gap between *"wanting to learn a skill"* and *"having a concrete daily action plan."*

It uses **Google Gemini 2.5 Flash** as the AI backbone, **Spring Boot 3** as a secure middleware layer, and **React 18** as the user-facing interface.

### 🏗️ Tech Stack at a Glance

**Frontend**

| Library | Version | Role |
|---|---|---|
| React | 18.2 | UI component framework |
| Vite | 5.1 | Build tool — fast HMR, optimised production bundles |
| Tailwind CSS | 3.4 | Utility-first styling |
| Framer Motion | 11.0 | Page transitions and card animations |
| React Router DOM | 6.22 | Client-side routing (`/` and `/dashboard`) |
| Lucide React | 0.358 | Consistent icon set |
| Axios | 1.6 | HTTP client with 90 s timeout for AI-backed requests |
| jsPDF | 2.5 | Client-side PDF generation — no server cost |
| html2canvas | 1.4 | DOM-to-canvas capture used alongside jsPDF |
| react-hot-toast | 2.4 | Lightweight toast notifications |
| clsx | 2.1 | Conditional className utility |

**Backend**

| Library / Tool | Version | Role |
|---|---|---|
| Java | 17 min / 21 recommended | Language runtime |
| Spring Boot | 3.2.3 | Application framework — embedded Tomcat, auto-config |
| Spring Web (MVC) | — | REST controller layer |
| Spring WebFlux / WebClient | — | Reactive, non-blocking HTTP client for Gemini calls |
| Spring Validation | — | Bean Validation (`@NotBlank`, `@Valid`) on request DTOs |
| Lombok | — | Eliminates getters / setters / builder boilerplate |
| Jackson Databind | — | JSON serialisation and deserialisation |
| Maven | — | Dependency management and build lifecycle |

**AI & Infrastructure**

| Technology | Role |
|---|---|
| Google Gemini 2.5 Flash (`v1beta`) | Roadmap generation — `responseMimeType: application/json` for clean structured output |
| Browser localStorage | Zero-infra progress and history persistence |
| Railway | Unified deployment for both frontend static build and Spring Boot JAR |

### Why a backend instead of calling Gemini from the frontend?

> - **API key security** — the Gemini API key never reaches the browser
> - **Response transformation** — the backend validates, cleans, and enriches the JSON
> - **Future extensibility** — easy to add database, auth, or rate limiting

---

## 2. System Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                         USER JOURNEY                             │
│                                                                  │
│  1. User visits landing page  (/)                                │
│  2. Clicks skill chip or "Generate" → /dashboard                 │
│  3. Fills RoadmapForm  (skill, level, hours, goal)               │
│  4. Submits form  →  POST /api/generate-roadmap                  │
│  5. Spring Boot builds Gemini prompt                             │
│  6. Gemini returns structured JSON roadmap                       │
│  7. Backend parses, enriches resources, and returns roadmap      │
│  8. React renders WeekCards and DayCards                         │
│  9. User marks days complete  (stored in localStorage)           │
│  10. User exports PDF or shares roadmap link                     │
│  11. Roadmap auto-saved to history  (localStorage, max 10)       │
└──────────────────────────────────────────────────────────────────┘
```

---

## 3. API Flow

### Generate Roadmap

```
Frontend                    Backend                      Gemini API
   │                           │                              │
   │  POST /api/generate-      │                              │
   │  roadmap  (JSON body)     │                              │
   │──────────────────────────▶│                              │
   │                           │                              │
   │                           │  @Valid validates request    │
   │                           │  RoadmapService.generate()   │
   │                           │  builds structured prompt    │
   │                           │                              │
   │                           │  POST to Gemini v1beta       │
   │                           │  responseMimeType: json      │
   │                           │─────────────────────────────▶│
   │                           │                              │
   │                           │       JSON response          │
   │                           │◀─────────────────────────────│
   │                           │                              │
   │                           │  cleanJsonResponse()         │
   │                           │  objectMapper.readValue()    │
   │                           │  enrichResourceLinks()       │
   │                           │  assign UUID + timestamp     │
   │                           │                              │
   │      RoadmapResponse      │                              │
   │◀──────────────────────────│                              │
   │                           │                              │
   │  saveRoadmap() → context  │                              │
   │  history → localStorage   │                              │
   │  render WeekCards         │                              │
```

### Error Handling Flow

```
GeminiServiceException  →  GlobalExceptionHandler  →  503 + error JSON
Validation error        →  GlobalExceptionHandler  →  400 + field errors
Network timeout         →  Axios interceptor       →  User-friendly toast
```

---

## 4. Frontend Architecture

### Component Tree

```
App
├── LandingPage
│   ├── Navbar  (with ThemeToggle)
│   ├── HeroSection  (skill chips → smart routing)
│   ├── FeaturesGrid
│   └── StatsBanner
│
└── Dashboard
    ├── Navbar
    ├── Sidebar
    │   ├── NewRoadmapButton
    │   └── HistoryList  (from RoadmapContext)
    │
    └── Main Content  (conditional rendering)
        ├── LoadingSpinner  (when isLoading)
        ├── ErrorBanner  (when error)
        ├── RoadmapForm  (when no roadmap / showForm)
        │   ├── SkillInput + SuggestionChips
        │   ├── LevelSelector  (3-button toggle)
        │   ├── DurationSelectors
        │   └── GoalTextarea
        │
        └── RoadmapView  (when roadmap loaded)
            ├── RoadmapHeader  (title, badges, actions)
            │   ├── ShareButton
            │   └── ExportButton
            ├── ProgressBar
            ├── StatsRow  (4 stat cards)
            └── WeekCards[]
                └── DayCards[]  (YouTube chip + website chip + mini-project chip)
```

### Smart Skill Chip Routing

The landing page chips are context-aware:

| Scenario | Behaviour |
|----------|-----------|
| Skill already in history | Load existing roadmap directly |
| New skill | Navigate to `/dashboard?skill=<name>` — form pre-filled |

### Context Architecture

**ThemeContext** — Manages dark/light mode
- Persists to `localStorage` under `pathgen-theme`
- Auto-detects `prefers-color-scheme`
- Toggles `dark` class on `<html>`

**RoadmapContext** — Central state for all roadmap data
- `currentRoadmap` — The roadmap being viewed
- `history` — Array of past roadmaps (max 10, persisted)
- `progress` — Map of `{roadmapId-dayNumber: boolean}` (persisted)
- `isLoading / error` — UI state
- Methods: `saveRoadmap`, `toggleDayComplete`, `isDayComplete`, `getCompletedCount`, `deleteHistory`

### Routing

| Path | Component | Description |
|------|-----------|-------------|
| `/` | LandingPage | Hero, features, CTA |
| `/dashboard` | Dashboard | Form + roadmap viewer |
| `/dashboard?skill=Java` | Dashboard | Form pre-filled with skill |

---

## 5. Backend Architecture

### Package Structure

```
com.pathgen.api
├── PathGenApplication.java          # Entry point
├── config/
│   ├── CorsConfig.java              # CORS for frontend origins
│   └── WebClientConfig.java         # WebClient bean  (10 MB buffer)
├── controller/
│   └── RoadmapController.java       # REST endpoints
├── service/
│   ├── RoadmapService.java          # Business logic + prompt building
│   └── GeminiService.java           # Gemini API HTTP client
├── dto/
│   ├── RoadmapRequest.java          # Input validation  (@Valid)
│   ├── RoadmapResponse.java         # API response shape
│   ├── WeekDto.java
│   ├── DayDto.java                  # day, topic, task, resource, youtubeUrl, miniProject
│   └── ProgressUpdateRequest.java
└── exception/
    ├── GeminiServiceException.java
    └── GlobalExceptionHandler.java
```

### Key Design Decisions

| Decision | Reason |
|----------|--------|
| **WebClient over RestTemplate** | Non-blocking, modern, required for reactive Spring |
| **`responseMimeType: application/json`** | Forces Gemini to return clean JSON — no markdown fences |
| **`cleanJsonResponse()`** | Safety net for residual markdown wrapping |
| **`enrichResourceLinks()`** | Post-processes response — injects verified YouTube + website URLs |
| **UUID roadmap ID** | Generated in backend so frontend has stable keys for localStorage |

---

## 6. Prompt Engineering Strategy

### Prompt Design Principles

The prompt to Gemini is engineered for **reliability and structure**, not creativity.

```
Role definition → Parameter injection → Schema enforcement → Rules → Output constraint
```

### The Prompt Template

```
You are an expert learning coach. Generate a highly structured {N}-day learning roadmap...

Skill: {skill}
Current Level: {level}
Daily Study Time: {hours} hours
Goal: {goal}

Return ONLY valid JSON matching this exact schema:
{
  "title": "...",
  "weeks": [{ "week": N, "goal": "...", "motivationalMessage": "...", "days": [...] }]
}

Rules:
- Generate exactly {weeks} weeks with {days} days each
- Each day must have unique, progressively harder topics
- Mini-projects must be completable within the daily time budget
- Return ONLY the JSON object, nothing else
```

### Why This Works

| Technique | Effect |
|-----------|--------|
| Role assignment ("expert learning coach") | Primes quality and tone |
| Explicit JSON schema with types | Reduces hallucination of field names |
| `responseMimeType: "application/json"` | Forces clean JSON output |
| "Return ONLY the JSON" instruction | Prevents markdown wrapping |
| Rules section | Constrains project realism |
| Parameter injection (level, hours) | Personalizes difficulty and scope |

### Resource Enrichment Strategy

Gemini is instructed to include resource URLs, but the backend **always overrides** the resource fields after parsing. This ensures 100% working links regardless of what Gemini returns.

```
Gemini JSON parsed  →  enrichResourceLinks()
                        ├── setYoutubeUrl()  from verified YouTube pool
                        └── setResource()   from verified website pool
                             (freecodecamp, geeksforgeeks, w3schools, official docs)
```

---

## 7. Data Models

### RoadmapResponse (Full)

```json
{
  "id": "uuid-string",
  "title": "30-Day Java Mastery Roadmap",
  "skill": "Java",
  "level": "BEGINNER",
  "durationDays": 30,
  "dailyHours": 2,
  "generatedAt": "2026-05-18T10:30:00",
  "weeks": [
    {
      "week": 1,
      "goal": "Understand Java fundamentals and OOP concepts",
      "motivationalMessage": "The journey of a thousand miles begins with a single step.",
      "days": [
        {
          "day": 1,
          "topic": "Java Setup & Hello World",
          "task": "Install JDK 21 and IntelliJ IDEA. Write your first Java program and understand the JVM compilation model.",
          "resource": "https://www.geeksforgeeks.org/java/",
          "youtubeUrl": "https://www.youtube.com/watch?v=eIrMbAQSU34",
          "miniProject": "Build a command-line calculator"
        }
      ]
    }
  ]
}
```

### Progress Storage (localStorage)

```json
{
  "uuid1-1": true,
  "uuid1-2": true,
  "uuid1-3": false
}
```

Key format: `{roadmapId}-{dayNumber}`

---

## 8. State Management

Progress is stored in `RoadmapContext` with a flat key map (`{id}-{day}: bool`).
This avoids nested mutation and makes day lookup O(1).

History is stored as an array, capped at 10, newest-first.
Each entry is the full `RoadmapResponse` object — no separate fetch needed to load a history item.

---

## 9. PDF Export Implementation

The export uses `jsPDF` (pure JS, no server needed):

1. Title section with brand-colored rectangle header
2. Week headers with light-blue background
3. Day boxes with day number badge, topic, task, and resource
4. Auto page-break via `checkNewPage(needed)` helper
5. Footer with page numbers on every page

This approach generates PDFs without `html2canvas` (no DOM capture), making it faster and more reliable across browsers.

---

## 10. Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| Gemini wraps JSON in markdown fences | `cleanJsonResponse()` strips ``` code fences |
| Gemini changes JSON schema | Strong-type deserialization catches it immediately |
| API key must not reach the browser | All Gemini calls go through Spring Boot backend |
| CORS blocking frontend → backend | `CorsConfig.java` with configurable allowed origins |
| Large responses exceed default buffer | `maxInMemorySize: 10MB` in `WebClientConfig` |
| PDF generation for multi-page roadmaps | `checkNewPage()` helper with per-element height estimates |
| Progress lost on page refresh | Progress stored in localStorage via `RoadmapContext` |
| Dark mode flash on page load | Preference applied synchronously in `ThemeContext` init |
| Gemini returns fake/broken resource URLs | `enrichResourceLinks()` unconditionally replaces all resources post-parse |
| Skill chip routing with React StrictMode | Decision logic moved to event source (LandingPage), not consumer (Dashboard) |

---

## 11. Learnings

**1. Prompt engineering is product engineering**
The structure of the prompt directly determines the quality of AI output. Vague prompts produce vague roadmaps. Schema enforcement in the prompt is as important as schema validation in code.

**2. `responseMimeType` is a Gemini superpower**
Requesting `"application/json"` as the MIME type dramatically reduces the need for output cleaning. Switching from v1 → v1beta endpoint to access this feature was a pivotal fix.

**3. Post-process AI output — never trust it blindly**
Gemini would return plausible-looking but broken YouTube URLs. The fix: always override resource fields after JSON parse with a curated, verified pool. The AI handles content; the backend handles reliability.

**4. React Context is sufficient for this scope**
Redux would be overkill. Context + localStorage covers 100% of the use cases here.

**5. React StrictMode double-invokes effects**
A routing bug where skill chips loaded the wrong roadmap was caused by `useEffect` running twice in StrictMode. Fix: move decision logic to the event source (LandingPage click handler), not the consumer (Dashboard effect).

**6. jsPDF without html2canvas**
Building PDFs programmatically gives full control over layout and is far faster than screenshotting the DOM.

---

## 12. Performance Considerations

| Concern | Mitigation |
|---------|-----------|
| Gemini response latency (~5–15s) | Loading spinner + dynamic text reassures users |
| Large roadmap JSON rendering | Week cards collapsed by default — only Week 1 open |
| PDF generation for 30-day roadmaps | Pure JS jsPDF is synchronous but fast (~200ms) |
| History localStorage size | Capped at 10 roadmaps; each is ~15 KB |
| Railway cold start | Health check endpoint; backend stays warm under active use |

---

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/chaitanyagithubaccount/pathgen-ai.git
cd pathgen-ai

# Backend
cd backend
mvn spring-boot:run

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Set `GEMINI_API_KEY` in `application.properties` before running the backend.

---

*Built by **Chaitanya Bharti** · Lead Software Engineer at Wells Fargo · IIT Patna GenAI Capstone Sprint 2026*

*⚡ PathGen AI — [Live App](https://pathgen-ai-production-0811.up.railway.app) · [GitHub](https://github.com/chaitanyagithubaccount/pathgen-ai)*
