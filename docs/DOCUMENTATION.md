# PathGen AI – Technical Documentation
### IIT Patna Generative AI Capstone Sprint 2026

---

## Table of Contents

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

PathGen AI is a full-stack web application that bridges the gap between "wanting to learn a skill" and "having a concrete daily action plan." It uses Google Gemini 1.5 Flash as the AI backbone, Spring Boot as a secure middleware layer, and React as the user-facing interface.

**Why a backend instead of calling Gemini from the frontend?**
- API key security – the Gemini API key never reaches the browser
- Response transformation – the backend validates and enriches the JSON
- Future extensibility – easy to add database, auth, or caching

---

## 2. System Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                         USER JOURNEY                             │
│                                                                  │
│  1. User visits landing page (/)                                 │
│  2. Clicks "Generate My Learning Path" → /dashboard             │
│  3. Fills RoadmapForm (skill, level, hours, goal)                │
│  4. Submits form → POST /api/generate-roadmap                    │
│  5. Spring Boot builds Gemini prompt                             │
│  6. Gemini returns structured JSON roadmap                       │
│  7. Backend parses, enriches, and returns roadmap                │
│  8. React renders WeekCards and DayCards                         │
│  9. User marks days complete (stored in localStorage)            │
│  10. User exports PDF or copies roadmap                          │
│  11. Roadmap saved to history (localStorage)                     │
└──────────────────────────────────────────────────────────────────┘
```

---

## 3. API Flow

### Generate Roadmap

```
Frontend                    Backend                      Gemini API
   │                           │                              │
   │  POST /api/generate-      │                              │
   │  roadmap (JSON body)      │                              │
   │──────────────────────────▶│                              │
   │                           │                              │
   │                           │ @Valid validates request      │
   │                           │ RoadmapService.generateRoadmap│
   │                           │ builds structured prompt     │
   │                           │                              │
   │                           │  POST to Gemini endpoint     │
   │                           │  with API key in URL         │
   │                           │─────────────────────────────▶│
   │                           │                              │
   │                           │       JSON response          │
   │                           │◀─────────────────────────────│
   │                           │                              │
   │                           │ extractTextFromResponse()    │
   │                           │ cleanJsonResponse()          │
   │                           │ objectMapper.readValue()     │
   │                           │ enrich (id, timestamps)      │
   │                           │                              │
   │      RoadmapResponse      │                              │
   │◀──────────────────────────│                              │
   │                           │                              │
   │ saveRoadmap() → context   │                              │
   │ history → localStorage    │                              │
   │ render WeekCards          │                              │
```

### Error Handling Flow

```
GeminiServiceException  →  GlobalExceptionHandler  →  503 + error JSON
Validation error        →  GlobalExceptionHandler  →  400 + field errors
Network timeout         →  Axios interceptor       →  User-friendly message
```

---

## 4. Frontend Architecture

### Component Tree

```
App
├── LandingPage
│   ├── Navbar (with ThemeToggle)
│   ├── HeroSection
│   ├── FeaturesGrid
│   └── StatsBanner
│
└── Dashboard
    ├── Navbar
    ├── Sidebar
    │   ├── NewRoadmapButton
    │   └── HistoryList (from RoadmapContext)
    │
    └── Main Content (conditional rendering)
        ├── LoadingSpinner (when isLoading)
        ├── ErrorBanner (when error)
        ├── RoadmapForm (when no roadmap / showForm)
        │   ├── SkillInput + SuggestionChips
        │   ├── LevelSelector (3-button toggle)
        │   ├── DurationSelectors
        │   └── GoalTextarea
        │
        └── RoadmapView (when roadmap loaded)
            ├── RoadmapHeader (title, badges, actions)
            │   ├── ShareButton
            │   └── ExportButton
            ├── ProgressBar
            ├── StatsRow (4 stat cards)
            └── WeekCards[]
                └── DayCards[] (collapsible per week)
```

### Context Architecture

**ThemeContext** – Manages dark/light mode
- Persists to `localStorage` under `pathgen-theme`
- Auto-detects `prefers-color-scheme`
- Toggles `dark` class on `<html>`

**RoadmapContext** – Central state for all roadmap data
- `currentRoadmap` – The roadmap being viewed
- `history` – Array of past roadmaps (max 10, persisted)
- `progress` – Map of `{roadmapId-dayNumber: boolean}` (persisted)
- `isLoading / error` – UI state
- Methods: `saveRoadmap`, `toggleDayComplete`, `isDayComplete`, `getCompletedCount`, `deleteHistory`

### Routing

| Path | Component | Description |
|------|-----------|-------------|
| `/` | LandingPage | Hero, features, CTA |
| `/dashboard` | Dashboard | Form + roadmap viewer |

---

## 5. Backend Architecture

### Package Structure

```
com.pathgen.api
├── PathGenApplication.java       # Entry point
├── config/
│   ├── CorsConfig.java           # CORS for frontend origins
│   └── WebClientConfig.java      # WebClient bean (10MB buffer)
├── controller/
│   └── RoadmapController.java    # REST endpoints
├── service/
│   ├── RoadmapService.java       # Business logic + prompt building
│   └── GeminiService.java        # Gemini API HTTP client
├── dto/
│   ├── RoadmapRequest.java       # Input validation
│   ├── RoadmapResponse.java      # API response shape
│   ├── WeekDto.java
│   ├── DayDto.java
│   └── ProgressUpdateRequest.java
└── exception/
    ├── GeminiServiceException.java
    └── GlobalExceptionHandler.java
```

### Key Design Decisions

1. **WebClient over RestTemplate** – Non-blocking, modern, required for reactive Spring
2. **`responseMimeType: "application/json"`** – Tells Gemini to return JSON directly, reducing parsing failures
3. **`cleanJsonResponse()`** – Safety net for when Gemini wraps JSON in markdown code fences
4. **`objectMapper.readValue()`** – Strong-type deserialization catches schema mismatches early
5. **UUID roadmap ID** – Generated in backend so frontend has stable keys for localStorage

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
- Resources must be real, free, and relevant
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
| Rules section | Constrains resource quality and project realism |
| Parameter injection (level, hours) | Personalizes difficulty and scope |

### Failure Recovery

1. `cleanJsonResponse()` strips markdown fences if Gemini ignores the instruction
2. `objectMapper.readValue()` throws if JSON schema is wrong → caught as `GeminiServiceException`
3. Frontend shows friendly error with troubleshooting hint
4. Temperature set to 0.7 – creative enough for variety but low enough for structure

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
  "generatedAt": "2026-05-16T10:30:00",
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
          "resource": "https://dev.java/learn/",
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
Each entry is the full RoadmapResponse object — no separate fetch needed to load history.

---

## 9. PDF Export Implementation

The export uses `jsPDF` (pure JS, no server needed):

1. Title section with brand-colored rectangle header
2. Week headers with light-blue background
3. Day boxes with day number badge, topic, task, and resource
4. Auto page-break via `checkNewPage(needed)` helper
5. Footer with page numbers on every page

This approach generates PDFs without `html2canvas` (no DOM capture needed), making it faster and more reliable across browsers.

---

## 10. Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| Gemini returns JSON wrapped in markdown | `cleanJsonResponse()` strips ``` code fences |
| Gemini sometimes changes the JSON schema | Strong-type deserialization catches it immediately |
| API key should not be exposed in browser | All Gemini calls go through Spring Boot backend |
| CORS blocking frontend → backend | `CorsConfig.java` with configurable allowed origins |
| Large responses exceeding default buffer | `maxInMemorySize: 10MB` in WebClientConfig |
| PDF generation for multi-page roadmaps | `checkNewPage()` helper with per-element height estimates |
| Progress lost on page refresh | Progress stored in localStorage via RoadmapContext |
| Dark mode flash on page load | Stored preference applied synchronously in ThemeContext init |

---

## 11. Learnings

1. **Prompt engineering is product engineering** – the structure of the prompt directly determines the quality of the AI output. Vague prompts produce vague roadmaps.

2. **`responseMimeType` is a Gemini superpower** – requesting `"application/json"` as the MIME type dramatically reduces the need for output cleaning.

3. **React Context is sufficient for this scope** – Redux would be overkill. Context + localStorage covers 100% of the use cases here.

4. **Framer Motion's `AnimatePresence`** – essential for smooth route transitions and accordion animations. Without it, switching between form and roadmap views feels abrupt.

5. **jsPDF without html2canvas** – building PDFs programmatically gives full control over layout and is far faster than screenshotting the DOM.

6. **Spring Boot CORS with multiple origins** – the `allowedOrigins()` method accepts wildcards for Vercel/Netlify preview URLs, which simplifies deployment significantly.

---

## 12. Performance Considerations

| Concern | Mitigation |
|---------|-----------|
| Gemini response latency (~5-15s) | Loading spinner + toast message reassures users |
| Large roadmap JSON rendering | Week cards collapsed by default (only Week 1 open) |
| PDF generation for 30-day roadmaps | Pure JS jsPDF is synchronous but fast enough (~200ms) |
| History localStorage size | Capped at 10 roadmaps; each is ~15KB |
| Cold start on Render free tier | Health check endpoint for monitoring |

---

*PathGen AI – IIT Patna Generative AI Capstone Sprint 2026*
