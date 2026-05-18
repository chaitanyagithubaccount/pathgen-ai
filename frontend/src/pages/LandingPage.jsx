import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Map, Target, Clock, CheckCircle2, ArrowRight, Moon, Sun, Zap, BookOpen, Trophy } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useRoadmap } from '../context/RoadmapContext'

const features = [
  { icon: Sparkles, title: 'AI-Powered Roadmap', desc: 'Google Gemini generates a fully personalized day-by-day learning plan tailored to your level and goals.' },
  { icon: Map, title: '30-Day Structure', desc: 'Organized into weekly milestones with daily tasks, topics, and free resources to keep you on track.' },
  { icon: Target, title: 'Mini Projects', desc: 'Hands-on projects every week so you build real skills, not just theory.' },
  { icon: Clock, title: 'Progress Tracking', desc: 'Mark days complete, track your streak, and visualize your learning journey.' },
]

const skills = ['Java', 'React', 'Python', 'Machine Learning', 'DevOps', 'Spring Boot', 'Data Analytics', 'Cloud AWS']

export default function LandingPage() {
  const navigate = useNavigate()
  const { isDark, toggle } = useTheme()
  const { history, setCurrentRoadmap } = useRoadmap()

  const handleSkillChipClick = (skill) => {
    const existing = history.find(r => r.skill?.toLowerCase() === skill.toLowerCase())
    if (existing) {
      // Already have a roadmap for this skill — load it directly
      setCurrentRoadmap(existing)
      navigate('/dashboard')
    } else {
      // New skill — go to dashboard with skill pre-filled in form
      navigate(`/dashboard?skill=${encodeURIComponent(skill)}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shadow-md">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-slate-900 dark:text-white">PathGen AI</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            Dashboard
          </button>
          <button
            onClick={toggle}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 text-sm font-semibold border border-brand-200 dark:border-brand-800">
              <Sparkles className="w-3.5 h-3.5" />
              Powered by Google Gemini AI
            </span>
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-semibold border border-amber-200 dark:border-amber-800">
              #IITPatnaCapstone
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
            Your Personalized<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-purple-600">
              30-Day Learning Path
            </span>
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Enter any skill — Java, AI, React, DevOps, and more — and get an AI-crafted,
            day-by-day roadmap with resources, mini-projects, and milestones. Built for learners.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/dashboard')}
              className="btn-primary flex items-center justify-center gap-2 text-base"
            >
              Generate My Learning Path
              <ArrowRight className="w-4 h-4" />
            </motion.button>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-secondary flex items-center justify-center gap-2 text-base"
            >
              <BookOpen className="w-4 h-4" />
              View Demo Roadmap
            </button>
          </div>
        </motion.div>

        {/* Floating skill chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-2 mt-12"
        >
          {skills.map((s, i) => (
            <span
              key={s}
              className="px-3 py-1.5 rounded-full text-sm font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 shadow-sm cursor-pointer hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              onClick={() => handleSkillChipClick(s)}
            >
              {s}
            </span>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="card p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="w-11 h-11 rounded-xl bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Stats banner */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="card p-8 bg-gradient-to-r from-brand-600 to-purple-600 border-0 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { stat: '30', label: 'Days Structured Plan', icon: Map },
              { stat: '4+', label: 'Weekly Milestones', icon: Trophy },
              { stat: '100%', label: 'Free Resources', icon: CheckCircle2 },
            ].map(({ stat, label, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <Icon className="w-6 h-6 opacity-80" />
                <span className="text-4xl font-extrabold">{stat}</span>
                <span className="text-sm opacity-80">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 md:px-12 py-8 border-t border-slate-100 dark:border-slate-800 text-center text-sm text-slate-500 dark:text-slate-500">
        Built for IIT Patna Generative AI Capstone Sprint 2026 · PathGen AI
      </footer>
    </div>
  )
}
