# PathGen AI – Personalized Learning Path Generator

> **IIT Patna Generative AI Capstone Sprint 2026**

PathGen AI uses Google Gemini to generate a fully personalized, day-by-day 30-day learning roadmap for any skill — Java, React, Machine Learning, DevOps, and more. Enter your skill, level, and daily availability, and get a structured plan with topics, tasks, free resources, and mini-projects — instantly.

---

## Screenshots

> _Add screenshots to `docs/screenshots/` after running the app._

| Landing Page | Roadmap Form | Dashboard View |
|---|---|---|
| `docs/screenshots/landing.png` | `docs/screenshots/form.png` | `docs/screenshots/dashboard.png` |

---

## Features

- **AI Roadmap Generation** – Google Gemini creates a structured week-by-week, day-by-day plan
- **Personalization** – Tailored to your skill level, daily time budget, and learning goal
- **Progress Tracking** – Mark days complete, visual progress bar
- **PDF Export** – Download your roadmap as a formatted PDF
- **Copy to Clipboard** – Share your roadmap as plain text
- **History** – Last 10 roadmaps saved in localStorage
- **Dark / Light Mode** – System-aware with manual toggle
- **Responsive Design** – Works on mobile and desktop
- **Week Cards** – Collapsible weekly milestones with motivational messages

---

## Architecture

```
┌─────────────────────┐     REST API      ┌──────────────────────┐     WebClient    ┌─────────────────┐
│   React Frontend    │ ─────────────────▶ │  Spring Boot Backend │ ───────────────▶ │  Gemini API     │
│   Vite + Tailwind   │ ◀───────────────── │  Java 21             │ ◀─────────────── │  (Free Tier)    │
│   Framer Motion     │    JSON Roadmap    │  Port 8080           │   JSON Response  └─────────────────┘
│   Port 3000         │                   └──────────────────────┘
└─────────────────────┘
         │
    localStorage
    (History + Progress)
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TailwindCSS, Framer Motion, Lucide Icons |
| Backend | Spring Boot 3, Java 21, WebClient, Lombok |
| AI | Google Gemini 1.5 Flash (free tier) |
| Export | jsPDF |
| Storage | Browser localStorage |

---

## Project Structure

```
iitPatna-Project/
├── frontend/                  # React + Vite app
│   ├── src/
│   │   ├── pages/             # LandingPage, Dashboard
│   │   ├── components/        # Navbar, Sidebar, RoadmapForm, WeekCard, DayCard, ...
│   │   ├── context/           # ThemeContext, RoadmapContext
│   │   ├── services/          # Axios API client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
│
├── backend/                   # Spring Boot app
│   ├── src/main/java/com/pathgen/api/
│   │   ├── controller/        # RoadmapController
│   │   ├── service/           # RoadmapService, GeminiService
│   │   ├── dto/               # Request/Response DTOs
│   │   ├── config/            # CorsConfig, WebClientConfig
│   │   └── exception/         # GlobalExceptionHandler
│   ├── src/main/resources/
│   │   └── application.yml
│   ├── pom.xml
│   └── .env.example
│
├── docs/
│   ├── IDEA_DOCUMENT.md
│   ├── DOCUMENTATION.md
│   ├── DEMO_SCRIPT.md
│   └── BUILD_IN_PUBLIC.md
│
└── README.md
```

---

## Setup & Local Development

### Prerequisites

- Node.js 18+ and npm
- Java 21 and Maven 3.9+
- A free [Google Gemini API key](https://aistudio.google.com/app/apikey)

---

### 1. Clone & Setup

```bash
git clone <your-repo-url>
cd iitPatna-Project
```

---

### 2. Backend Setup

```bash
cd backend

# Copy env file and add your key
cp .env.example .env
# Edit .env and set: GEMINI_API_KEY=your_key_here

# Run (PowerShell/Windows)
$env:GEMINI_API_KEY="your_key_here"
./mvnw spring-boot:run

# Run (Linux/Mac)
export GEMINI_API_KEY="your_key_here"
./mvnw spring-boot:run
```

Backend starts on **http://localhost:8080**

Test it: `curl http://localhost:8080/api/health`

---

### 3. Frontend Setup

```bash
cd frontend

npm install

# Copy env (optional – defaults to localhost:8080)
cp .env.example .env

npm run dev
```

Frontend starts on **http://localhost:3000**

---

## API Reference

### POST `/api/generate-roadmap`

Generate a personalized AI learning roadmap.

**Request:**
```json
{
  "skill": "Spring Boot",
  "level": "BEGINNER",
  "dailyHours": 2,
  "durationDays": 30,
  "learningGoal": "Build and deploy a REST API"
}
```

**Response:**
```json
{
  "id": "uuid",
  "title": "30-Day Spring Boot Mastery Roadmap",
  "skill": "Spring Boot",
  "level": "BEGINNER",
  "durationDays": 30,
  "dailyHours": 2,
  "generatedAt": "2026-05-16T10:30:00",
  "weeks": [
    {
      "week": 1,
      "goal": "Set up environment and understand Spring Boot basics",
      "motivationalMessage": "Every expert was once a beginner.",
      "days": [
        {
          "day": 1,
          "topic": "Introduction to Spring Boot",
          "task": "Install JDK 21, Maven, and IntelliJ IDEA. Create your first Spring Boot project using Spring Initializr.",
          "resource": "https://start.spring.io",
          "miniProject": "Hello World REST endpoint"
        }
      ]
    }
  ]
}
```

### GET `/api/health`

Returns service status.

### POST `/api/save-progress`

Save day completion progress (future DB integration).

```json
{ "roadmapId": "uuid", "dayNumber": 1, "completed": true }
```

---

## Deployment

### Frontend → Vercel

```bash
cd frontend
npm run build

# Via Vercel CLI
npx vercel --prod

# OR import the /frontend folder in Vercel dashboard
# Set environment variable: VITE_API_URL=https://your-backend.onrender.com
```

### Backend → Render

1. Go to [render.com](https://render.com) → New Web Service
2. Connect your repository, set root to `/backend`
3. Build command: `mvn clean package -DskipTests`
4. Start command: `java -jar target/pathgen-api-1.0.0.jar`
5. Add environment variable: `GEMINI_API_KEY=your_key`
6. Add `CORS_ALLOWED_ORIGIN=https://your-frontend.vercel.app`

---

## Environment Variables

| Variable | Where | Description |
|----------|-------|-------------|
| `GEMINI_API_KEY` | Backend | Your Google Gemini API key (required) |
| `SERVER_PORT` | Backend | Port (default: 8080) |
| `CORS_ALLOWED_ORIGIN` | Backend | Frontend URL for CORS |
| `VITE_API_URL` | Frontend | Backend URL (default: http://localhost:8080) |

---

## Contributing

This project was built for the IIT Patna Generative AI Capstone Sprint 2026. PRs and feedback welcome.

---

## License

MIT
