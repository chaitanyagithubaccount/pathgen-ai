import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, BookOpen, Trophy, Calendar, AlertCircle, RotateCcw } from 'lucide-react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import RoadmapForm from '../components/RoadmapForm'
import WeekCard from '../components/WeekCard'
import ProgressBar from '../components/ProgressBar'
import LoadingSpinner from '../components/LoadingSpinner'
import ExportButton from '../components/ExportButton'
import ShareButton from '../components/ShareButton'
import { useRoadmap } from '../context/RoadmapContext'
import clsx from 'clsx'

export default function Dashboard() {
  const { currentRoadmap, isLoading, loadingDays, error, setCurrentRoadmap, getCompletedCount } = useRoadmap()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showForm, setShowForm] = useState(!currentRoadmap)

  const totalDays = currentRoadmap?.weeks?.reduce((acc, w) => acc + (w.days?.length || 0), 0) || 0
  const completed = currentRoadmap ? getCompletedCount(currentRoadmap.id, totalDays) : 0

  useEffect(() => {
    if (currentRoadmap) setShowForm(false)
  }, [currentRoadmap])

  const handleNewRoadmap = () => {
    setShowForm(true)
    setSidebarOpen(false)
  }

  const handleLoadHistory = () => {
    setShowForm(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar
        onMenuToggle={() => setSidebarOpen(o => !o)}
        menuOpen={sidebarOpen}
      />

      <div className="flex pt-16">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onNewRoadmap={handleNewRoadmap}
        />

        {/* Main content */}
        <main className="flex-1 min-w-0 p-6 md:p-8">
          {/* Loading state */}
          {isLoading && <LoadingSpinner days={loadingDays} />}

          {/* Error state */}
          {!isLoading && error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto mb-6"
            >
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-5 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-700 dark:text-red-300">Generation Failed</p>
                  <p className="text-sm text-red-600 dark:text-red-400 mt-0.5">{error}</p>
                  <p className="text-xs text-red-500 dark:text-red-500 mt-2">
                    Make sure your backend is running and the GEMINI_API_KEY is set correctly.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Form view */}
          {!isLoading && (showForm || !currentRoadmap) && (
            <AnimatePresence mode="wait">
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <RoadmapForm />
              </motion.div>
            </AnimatePresence>
          )}

          {/* Roadmap view */}
          {!isLoading && !showForm && currentRoadmap && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentRoadmap.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-4xl mx-auto space-y-6"
              >
                {/* Roadmap header */}
                <div className="card p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="badge bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300">
                          <BookOpen className="w-3 h-3" />
                          {currentRoadmap.skill}
                        </span>
                        <span className="badge bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                          {currentRoadmap.level}
                        </span>
                        <span className="badge bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                          <Calendar className="w-3 h-3" />
                          {currentRoadmap.durationDays} days
                        </span>
                        <span className="badge bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                          <Trophy className="w-3 h-3" />
                          {currentRoadmap.dailyHours}h/day
                        </span>
                      </div>

                      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                        {currentRoadmap.title}
                      </h1>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Generated on {new Date(currentRoadmap.generatedAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        })}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 shrink-0">
                      <button
                        onClick={handleNewRoadmap}
                        className="btn-secondary flex items-center gap-2 text-sm"
                      >
                        <RotateCcw className="w-4 h-4" />
                        New
                      </button>
                      <ShareButton roadmap={currentRoadmap} />
                      <ExportButton roadmap={currentRoadmap} />
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-700">
                    <ProgressBar
                      completed={completed}
                      total={totalDays}
                      label="Overall Progress"
                    />
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Days', value: totalDays, icon: Calendar, color: 'text-brand-600 dark:text-brand-400' },
                    { label: 'Completed', value: completed, icon: Trophy, color: 'text-emerald-600 dark:text-emerald-400' },
                    { label: 'Remaining', value: totalDays - completed, icon: LayoutDashboard, color: 'text-amber-600 dark:text-amber-400' },
                    { label: 'Weeks', value: currentRoadmap.weeks?.length || 0, icon: BookOpen, color: 'text-purple-600 dark:text-purple-400' },
                  ].map(stat => (
                    <div key={stat.label} className="card p-4 text-center">
                      <stat.icon className={clsx('w-5 h-5 mx-auto mb-2', stat.color)} />
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Weekly roadmap */}
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <LayoutDashboard className="w-5 h-5 text-brand-500" />
                    Your Learning Roadmap
                  </h2>
                  {currentRoadmap.weeks?.map((week, i) => (
                    <WeekCard
                      key={week.week}
                      week={week}
                      roadmapId={currentRoadmap.id}
                      defaultOpen={i === 0}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>
    </div>
  )
}
