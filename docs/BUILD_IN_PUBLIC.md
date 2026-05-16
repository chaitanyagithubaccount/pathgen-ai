# PathGen AI – Build-in-Public Posts
### LinkedIn / Twitter | IIT Patna Generative AI Capstone Sprint 2026

---

## Week 1 Post – Kickoff

---

**LinkedIn / Twitter:**

🚀 Week 1 of the IIT Patna Generative AI Capstone Sprint 2026 — and I'm all in.

I'm building **PathGen AI** — a tool that uses Google Gemini to generate a personalized, day-by-day 30-day learning roadmap for any technical skill.

The problem I'm solving:
❌ Too many resources, zero structure
❌ Generic YouTube playlists with no personalization
❌ No accountability, no milestones
❌ Learners quit within 2 weeks

My solution: enter your skill, level, and daily time — get a structured 30-day plan with daily tasks, free resources, and mini-projects. In under 30 seconds.

**Week 1 done:**
✅ Spring Boot 3 backend with Gemini API integration
✅ Prompt engineering that returns structured JSON every time
✅ React + Vite + TailwindCSS frontend scaffolded
✅ CORS and environment variable setup

The hardest part so far? Prompt engineering. Getting Gemini to return a reliable JSON schema every single time took more iterations than I expected. The secret: `responseMimeType: "application/json"` + strict schema definition in the prompt.

4 weeks. One AI app. Let's go. 🔥

#IITPatnaCapstone #GenerativeAI #GeminiAPI #SpringBoot #React #BuildInPublic

---

## Week 2 Post – First Demo

---

**LinkedIn / Twitter:**

Week 2 update from the IIT Patna Generative AI Capstone Sprint 2026 🛠️

**PathGen AI** is starting to look real. I just generated my first complete 30-day Java learning roadmap using Gemini AI — and honestly, it's better than most paid courses I've seen.

What Gemini generates (in ~12 seconds):
📅 A topic + actionable task for EVERY day
🔗 Real, free resource links (official docs, YouTube, freeCodeCamp)
🔨 A mini-project for each day
🏆 Weekly milestones with motivational messages
📊 Progressive difficulty from day 1 to day 30

**What I built this week:**
✅ Full roadmap form with skill chips, level selector, duration picker
✅ Collapsible WeekCards + DayCards with smooth Framer Motion animations
✅ Mark-day-complete feature with progress tracking
✅ Progress bar with live completion percentage
✅ Dark/light mode with system preference detection

The trickiest bug: Gemini sometimes wraps JSON in markdown code fences (```json ... ```). Fixed with a `cleanJsonResponse()` method that strips fences before parsing.

Drop a skill in the comments — I'll generate a roadmap for it and share it here. 👇

#IITPatnaCapstone #GenerativeAI #GeminiAPI #React #TailwindCSS #BuildInPublic

---

## Week 3 Post – Full Feature Set

---

**LinkedIn / Twitter:**

Week 3 — **PathGen AI** is feature-complete 🎉

Here's the full feature list I shipped this week:

**New this week:**
📄 **PDF Export** — download your roadmap as a beautifully formatted PDF (pure jsPDF, no server needed)
📋 **Copy to Clipboard** — paste your roadmap anywhere as plain text
🕐 **History Panel** — sidebar with last 10 roadmaps, switch between them instantly
🗑️ **Delete history** — clean up old roadmaps from the sidebar
📊 **Stats Dashboard** — total days, completed, remaining, weeks at a glance

**Architecture decision I'm proud of:**
I built the backend (Spring Boot) as a secure middleware layer rather than calling Gemini directly from the frontend. This means:
- The API key never reaches the browser
- Easy to add a database or auth layer later
- Clean separation of concerns

The PDF export was the most satisfying feature to build. No html2canvas, no DOM screenshots — pure programmatic PDF with `jsPDF`. Full control over layout, headers, day cards, and page numbers.

One week left. Demo video and final documentation coming next week.

If you're building something with Gemini AI, let's connect. 🤝

#IITPatnaCapstone #GenerativeAI #GeminiAPI #SpringBoot #Java21 #BuildInPublic

---

## Week 4 Post – Launch & Reflection

---

**LinkedIn / Twitter:**

🏁 Week 4 — **PathGen AI** is live and submitted for the IIT Patna Generative AI Capstone Sprint 2026!

[Demo link] | [GitHub repo]

**What I shipped:**
A full-stack AI web app that generates personalized 30-day learning roadmaps using Google Gemini — in under 30 seconds.

**The stack:**
- ⚛️ React + Vite + TailwindCSS + Framer Motion (Vercel)
- ☕ Spring Boot 3 + Java 21 (Render)
- 🤖 Google Gemini 1.5 Flash API
- 📄 jsPDF for client-side PDF export
- 💾 localStorage for zero-infra history + progress tracking

**Numbers:**
- 30+ files written
- 4 weeks of sprint
- ~15 seconds to generate a complete 30-day roadmap
- 0 paid infrastructure cost (Gemini free tier + Vercel free + Render free)

**The biggest lesson:**
Prompt engineering is product engineering. The quality of AI output is entirely determined by the quality of your prompt. I spent more time on the Gemini prompt than on any other single piece of code.

A strict JSON schema in the prompt + `responseMimeType: "application/json"` + clear rules → reliable, parseable, high-quality output every time.

**What's next:**
- Google OAuth for multi-device sync
- Supabase for persistent history
- AI daily check-ins ("How did Day 3 go?")
- Calendar export to Google Calendar

Thank you to the IIT Patna Capstone team for the opportunity. This sprint taught me more about building AI products in 4 weeks than I learned in the previous year.

If this helped you, give it a ⭐ on GitHub. 🙏

#IITPatnaCapstone #GenerativeAI #GeminiAPI #SpringBoot #React #ShippedIt #BuildInPublic
