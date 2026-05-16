import { motion, AnimatePresence } from 'framer-motion'
import { PlusCircle, History, Trash2, BookOpen, ChevronRight } from 'lucide-react'
import { useRoadmap } from '../context/RoadmapContext'
import clsx from 'clsx'

export default function Sidebar({ open, onClose, onNewRoadmap }) {
  const { history, currentRoadmap, setCurrentRoadmap, deleteHistory, getCompletedCount } = useRoadmap()

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* New Roadmap button */}
      <div className="p-4">
        <button
          onClick={() => { onNewRoadmap(); onClose?.() }}
          className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
        >
          <PlusCircle className="w-4 h-4" />
          New Roadmap
        </button>
      </div>

      {/* History section */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <History className="w-3.5 h-3.5" />
          Recent Roadmaps
        </div>

        {history.length === 0 ? (
          <div className="text-center py-8 text-slate-400 dark:text-slate-500">
            <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No roadmaps yet</p>
            <p className="text-xs mt-1">Generate your first one!</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {history.map(roadmap => {
              const totalDays = roadmap.weeks?.reduce((acc, w) => acc + (w.days?.length || 0), 0) || 0
              const completed = getCompletedCount(roadmap.id, totalDays)
              const isActive = currentRoadmap?.id === roadmap.id

              return (
                <li key={roadmap.id}>
                  <div
                    className={clsx(
                      'group relative rounded-xl p-3 cursor-pointer transition-colors duration-150 border',
                      isActive
                        ? 'bg-brand-50 dark:bg-brand-900/30 border-brand-200 dark:border-brand-800'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
                    )}
                    onClick={() => { setCurrentRoadmap(roadmap); onClose?.() }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className={clsx(
                          'text-sm font-semibold truncate',
                          isActive ? 'text-brand-700 dark:text-brand-300' : 'text-slate-700 dark:text-slate-200'
                        )}>
                          {roadmap.skill}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {roadmap.level} · {totalDays} days
                        </p>
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-slate-400">{completed}/{totalDays} days</span>
                          </div>
                          <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-brand-500 rounded-full transition-all"
                              style={{ width: totalDays ? `${(completed / totalDays) * 100}%` : '0%' }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {isActive && <ChevronRight className="w-3.5 h-3.5 text-brand-500 shrink-0" />}
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteHistory(roadmap.id) }}
                          className="p-1 rounded text-slate-400 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* Footer branding */}
      <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 text-center">
        <p className="text-xs text-slate-400 dark:text-slate-500">IIT Patna Capstone 2026</p>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 h-[calc(100vh-4rem)] sticky top-16 overflow-hidden">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-16 bottom-0 w-72 z-50 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 md:hidden overflow-hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
