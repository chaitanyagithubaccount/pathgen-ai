import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 90000, // 90s – Gemini can be slow
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.response.use(
  res => res,
  err => {
    const msg = err.response?.data?.error || err.message || 'Network error'
    return Promise.reject(new Error(msg))
  }
)

export const api = {
  generateRoadmap: (payload) =>
    client.post('/api/generate-roadmap', payload).then(r => r.data),

  health: () =>
    client.get('/api/health').then(r => r.data),

  saveProgress: (payload) =>
    client.post('/api/save-progress', payload).then(r => r.data),
}
