# PathGen AI – Demo Video Script
### 3–5 Minute Narration | IIT Patna Generative AI Capstone Sprint 2026

---

## Pre-Demo Checklist

- [ ] Backend running at `localhost:8080` (GEMINI_API_KEY set)
- [ ] Frontend running at `localhost:3000`
- [ ] Browser in light mode, full screen, 1920×1080
- [ ] Previous localStorage cleared for clean state
- [ ] Pre-generated roadmap ready as fallback (in case of Gemini latency)

---

## Script

---

### [0:00 – 0:30] Opening Hook

> *(Show landing page animated hero)*

"Every time I wanted to learn a new skill — Java, React, DevOps — I'd open Google, get overwhelmed by a hundred resources, watch a random YouTube video, lose structure, and give up within two weeks.

The problem wasn't a lack of content. The problem was the absence of a clear, personalized, day-by-day plan.

That's exactly what I built."

**[Action]** Slowly scroll through the landing page, letting the hero text and feature cards animate in.

---

### [0:30 – 1:00] App Introduction

> *(Hover over feature cards)*

"Meet **PathGen AI** — a personalized learning path generator powered by Google Gemini.

You enter any skill — Java, Machine Learning, React, Spring Boot, DevOps — tell it your current level and how much time you have each day, and it generates a complete 30-day roadmap. Day by day. Topic by topic. With free resources and mini-projects for every single day."

**[Action]** Click skill chips — Java, Machine Learning, DevOps — to show they populate the form on the dashboard.

---

### [1:00 – 2:00] Generating a Roadmap

> *(Navigate to dashboard, fill the form)*

"Let me show you this live."

"I'll enter **Spring Boot** as my skill, select **Beginner** — I'm just getting started — I can study **2 hours per day**, and my goal is to build and deploy a REST API."

**[Action]** Fill the form fields slowly, clearly:
- Skill: "Spring Boot"
- Level: Click "Beginner"
- Daily Hours: 2
- Duration: 30 days
- Goal: "Build and deploy a REST API to production"

"And I hit **Generate My Learning Path**."

**[Action]** Click the generate button.

> *(Show loading spinner)*

"Gemini AI is now crafting a completely personalized plan. This takes about 10-15 seconds."

---

### [2:00 – 3:00] Walkthrough the Roadmap

> *(Roadmap appears, animate in)*

"And here it is — a complete **30-Day Spring Boot Mastery Roadmap**, generated specifically for a beginner with 2 hours per day."

**[Action]** Point to the header section.

"At the top — my skill, level, duration, and a live progress bar. As I complete days, this fills up."

**[Action]** Scroll down to Week 1 card — it's already open.

"Week 1 is already expanded. The AI gave this week a specific goal — '*Set up environment and understand Spring Boot basics*' — and even a motivational message."

**[Action]** Click Day 1 card's checkmark.

"Each day has a **topic**, an **actionable task**, a **free resource link**, and a **mini-project**. I can mark days complete right here."

**[Action]** Click Week 2 to expand it.

"Week 2 gets progressively harder — building REST controllers, working with databases. This is real structure, not generic advice."

---

### [3:00 – 3:45] Features Showcase

**[Action]** Click "Copy Roadmap"

"I can copy the entire roadmap as formatted text — paste it anywhere."

**[Action]** Click "Export PDF"

"Or export it as a PDF. The PDF is generated right in the browser — no server, no wait — and it's beautifully formatted with my branding."

**[Action]** Generate a second roadmap — "React" for Intermediate.

"Let me generate a second one — React, Intermediate level."

**[Action]** Show sidebar with both roadmaps in history.

"Both are saved in my history. I can switch between them instantly. Progress is tracked separately for each."

---

### [3:45 – 4:15] Dark Mode + Responsive

**[Action]** Toggle dark mode.

"Full dark mode support, of course."

**[Action]** Resize browser to mobile width.

"And it's fully responsive — every component adapts to mobile. The sidebar becomes a drawer, the cards stack vertically."

---

### [4:15 – 5:00] Architecture + Closing

> *(Optional: brief screen with architecture diagram)*

"Under the hood — a **React + Vite** frontend, a **Spring Boot 3 + Java 21** backend that securely calls the **Google Gemini API**, with progress tracked in localStorage. Deployable to Vercel and Render for free."

"The prompt engineering was the most interesting part — I engineered a strict schema-enforced prompt that makes Gemini return structured JSON every time, making parsing reliable and consistent."

"PathGen AI turns the overwhelm of 'where do I even start' into a concrete 30-day action plan — personalized, structured, and trackable."

"This is my submission for the **IIT Patna Generative AI Capstone Sprint 2026**. Thank you."

**[Action]** End on the dashboard with a completed week marked.

---

## Backup Plan

If Gemini API is slow during demo:
1. Have a pre-generated roadmap already loaded in the app (stored in localStorage)
2. Show the roadmap view directly and skip the generation step
3. Mention: "I'll show you a pre-generated example to save time — the live generation takes about 10-15 seconds"

---

## Screen Recording Tips

- Use OBS Studio or Loom
- Resolution: 1920×1080 or 1280×720
- Cursor: Use a cursor-highlight plugin
- Audio: Record in a quiet room, use a headset microphone
- Edit: Add 0.5s pause after each major action before speaking
