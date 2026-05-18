import axios from 'axios'
import mockJavaRoadmap from '../data/mockJavaRoadmap'

// ─── MOCK FLAG ────────────────────────────────────────────────────────────────
// Set to false to re-enable live Gemini calls for Java · 2h · 30d.
const USE_JAVA_MOCK = true
const JAVA_MOCK_DELAY_MS = 3000 // simulates AI generation time
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 90000,
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.response.use(
  res => res,
  err => {
    const msg = err.response?.data?.error || err.message || 'Network error'
    return Promise.reject(new Error(msg))
  }
)

const isJavaMockRequest = (payload) =>
  USE_JAVA_MOCK &&
  payload?.skill?.trim().toLowerCase() === 'java' &&
  payload?.dailyHours === 2 &&
  payload?.durationDays === 30

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const api = {
  generateRoadmap: async (payload) => {
    if (isJavaMockRequest(payload)) {
      console.log(`%c[PathGen Mock] Returning mock Java roadmap (delay: ${JAVA_MOCK_DELAY_MS}ms) — set USE_JAVA_MOCK=false to use live API`, 'color: #f59e0b; font-weight: bold')
      await delay(JAVA_MOCK_DELAY_MS)
      return { ...mockJavaRoadmap, generatedAt: new Date().toISOString() }
    }
    return client.post('/api/generate-roadmap', payload).then(r => r.data)
  },

  health: () =>
    client.get('/api/health').then(r => r.data),

  saveProgress: (payload) =>
    client.post('/api/save-progress', payload).then(r => r.data),
}
