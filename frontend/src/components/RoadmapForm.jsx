import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Loader2, ChevronDown } from 'lucide-react'
import { api } from '../services/api'
import { useRoadmap } from '../context/RoadmapContext'
import toast from 'react-hot-toast'

const LEVELS = ['Beginner', 'Intermediate', 'Advanced']
const HOURS = [1, 2, 3, 4, 5, 6]
const SKILL_SUGGESTIONS = [
  'Java', 'Python', 'React', 'Spring Boot', 'Machine Learning',
  'Data Analytics', 'DevOps', 'AWS Cloud', 'Docker & Kubernetes',
  'Node.js', 'TypeScript', 'System Design'
]

export default function RoadmapForm() {
  const { saveRoadmap, setIsLoading, setError } = useRoadmap()

  const [form, setForm] = useState({
    skill: '',
    level: 'Beginner',
    dailyHours: 2,
    durationDays: 30,
    learningGoal: '',
  })
  const [loading, setLoading] = useState(false)

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.skill.trim()) { toast.error('Please enter a skill to learn'); return }

    setLoading(true)
    setIsLoading(true)
    setError(null)

    const toastId = toast.loading('Gemini AI is crafting your roadmap...')

    try {
      const roadmap = await api.generateRoadmap({
        skill: form.skill.trim(),
        level: form.level.toUpperCase(),
        dailyHours: Number(form.dailyHours),
        durationDays: Number(form.durationDays),
        learningGoal: form.learningGoal.trim(),
      })
      saveRoadmap(roadmap)
      toast.success('Roadmap generated!', { id: toastId })
    } catch (err) {
      const msg = err.message || 'Failed to generate roadmap'
      setError(msg)
      toast.error(msg, { id: toastId })
    } finally {
      setLoading(false)
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto"
    >
      <div className="card p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Generate Your Roadmap</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Fill in the details below and let Gemini AI build your personalized plan.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Skill */}
          <div>
            <label className="label">What skill do you want to learn? *</label>
            <input
              className="input"
              placeholder="e.g. Java, React, Machine Learning, DevOps..."
              value={form.skill}
              onChange={e => set('skill', e.target.value)}
              disabled={loading}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {SKILL_SUGGESTIONS.slice(0, 6).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => set('skill', s)}
                  className="px-2.5 py-1 text-xs rounded-full border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Level */}
          <div>
            <label className="label">Current Level</label>
            <div className="grid grid-cols-3 gap-3">
              {LEVELS.map(l => (
                <button
                  key={l}
                  type="button"
                  onClick={() => set('level', l)}
                  disabled={loading}
                  className={`py-2.5 rounded-xl text-sm font-medium border transition-all duration-150 ${
                    form.level === l
                      ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                      : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-brand-400'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Daily hours + Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Daily Study Time</label>
              <div className="relative">
                <select
                  className="input appearance-none pr-8"
                  value={form.dailyHours}
                  onChange={e => set('dailyHours', e.target.value)}
                  disabled={loading}
                >
                  {HOURS.map(h => (
                    <option key={h} value={h}>{h} hour{h > 1 ? 's' : ''}/day</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="label">Duration</label>
              <div className="relative">
                <select
                  className="input appearance-none pr-8"
                  value={form.durationDays}
                  onChange={e => set('durationDays', e.target.value)}
                  disabled={loading}
                >
                  {[7, 14, 21, 28, 30].map(d => (
                    <option key={d} value={d}>{d} days</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Learning Goal */}
          <div>
            <label className="label">Learning Goal <span className="text-slate-400">(optional)</span></label>
            <textarea
              className="input resize-none"
              rows={3}
              placeholder="e.g. Build a REST API with Spring Boot and deploy it to AWS..."
              value={form.learningGoal}
              onChange={e => set('learningGoal', e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: loading ? 1 : 0.99 }}
            className="btn-primary w-full flex items-center justify-center gap-2 text-base disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating your roadmap...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate My Learning Path
              </>
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  )
}
