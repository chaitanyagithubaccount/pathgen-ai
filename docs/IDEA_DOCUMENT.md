# PathGen AI – 1-Pager Idea Document
### IIT Patna Generative AI Capstone Sprint 2026

---

## Problem Statement

Learning a new technical skill in 2026 is harder than ever — not because resources are scarce, but because there are too many. A developer wanting to learn Spring Boot today faces:

- Hundreds of YouTube videos with no structure
- Blog posts ranging from beginner to expert with no clear path
- No personalization — a Beginner and an Intermediate learner get the same search results
- No accountability — no milestones, no daily tasks, no progress tracking

The result? Most learners quit within two weeks. The problem isn't motivation — it's the absence of a clear, personalized, actionable roadmap.

---

## Solution

**PathGen AI** generates a fully personalized, day-by-day 30-day learning roadmap using Google Gemini — in under 30 seconds.

A user enters:
- The skill they want to learn (Java, React, DevOps, AI, etc.)
- Their current level (Beginner / Intermediate / Advanced)
- How many hours they can study per day
- Their specific learning goal

Gemini AI produces a structured roadmap with:
- A topic and specific actionable task for every single day
- Free resource links for each day
- Mini hands-on projects to reinforce learning
- Weekly milestones and motivational messages
- A progress tracker to mark days complete

---

## Features

| Feature | Description |
|---------|-------------|
| AI Roadmap Generation | Gemini creates a 30-day day-wise structured plan |
| Personalization | Level-aware, goal-aware, time-aware |
| Progress Tracking | Mark days complete, visual progress bar |
| PDF Export | Download roadmap as a formatted PDF |
| Copy to Clipboard | Share roadmap as plain text |
| History | Last 10 roadmaps saved in localStorage |
| Dark / Light Mode | System-aware with manual toggle |
| Responsive UI | Mobile + Desktop |

---

## Tech Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| Frontend | React + Vite + TailwindCSS | Fast, modern, production-ready |
| Animations | Framer Motion + Lucide Icons | Smooth, professional UX |
| Backend | Spring Boot 3 + Java 21 | Enterprise-grade, type-safe |
| HTTP Client | Spring WebClient | Reactive, non-blocking Gemini calls |
| AI | Google Gemini 1.5 Flash | Free tier, fast, excellent JSON generation |
| Export | jsPDF | Client-side PDF with no server needed |
| Storage | Browser localStorage | Zero infra cost, instant |
| Frontend Deploy | Vercel | Free, automatic from GitHub |
| Backend Deploy | Render / Railway | Free tier, Spring Boot support |

---

## Architecture

```
User Browser
    │
    ▼
React Frontend (Vercel)
    │  POST /api/generate-roadmap
    ▼
Spring Boot Backend (Render)
    │  WebClient HTTP call
    ▼
Google Gemini 1.5 Flash API
    │  Structured JSON response
    ▼
Spring Boot parses + enriches
    │  JSON roadmap
    ▼
React renders WeekCards + DayCards
    │
    ▼
localStorage (history + progress)
```

---

## Prompt Engineering Strategy

The system uses a carefully crafted prompt that:

1. Defines Gemini's role: "You are an expert learning coach"
2. Passes all user parameters (skill, level, hours, goal)
3. Specifies exact output JSON schema to enforce structure
4. Sets rules (free resources, progressive difficulty, real URLs)
5. Requests `responseMimeType: "application/json"` so Gemini returns clean JSON
6. Backend strips any markdown code fences as a safety fallback

---

## Expected Outcome

- A learner can go from "I want to learn X" to a structured 30-day plan in under 60 seconds
- The plan is actually personalized — a Beginner and an Advanced learner get fundamentally different roadmaps
- Day-wise tasks are completable within the specified daily time budget
- Resources are real, free, and high-quality (official docs, YouTube, freeCodeCamp)
- Progress tracking creates accountability without requiring account creation

---

## Future Scope

| Feature | Description |
|---------|-------------|
| Authentication | Google OAuth for multi-device sync |
| Supabase/PostgreSQL | Persistent history across devices |
| AI Coach | Daily motivational check-ins via Gemini |
| Community Roadmaps | Share and fork others' roadmaps |
| Streak System | Gamified daily streak tracking |
| Mobile App | React Native wrapper |
| Voice Walkthrough | Text-to-speech daily briefings |
| Calendar Export | Sync roadmap to Google Calendar |

---

*Built by: [Your Name] | IIT Patna Generative AI Capstone Sprint 2026*
