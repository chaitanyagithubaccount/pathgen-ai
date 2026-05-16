import { motion } from 'framer-motion'
import { CheckCircle2, Circle, ExternalLink, Wrench } from 'lucide-react'
import { useRoadmap } from '../context/RoadmapContext'
import clsx from 'clsx'

export default function DayCard({ day, roadmapId, index }) {
  const { toggleDayComplete, isDayComplete } = useRoadmap()
  const complete = isDayComplete(roadmapId, day.day)

  const isUrl = (str) => {
    try { return Boolean(new URL(str)) } catch { return false }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className={clsx(
        'card p-5 transition-all duration-200 hover:shadow-md',
        complete && 'opacity-70 bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-900'
      )}
    >
      <div className="flex items-start gap-4">
        {/* Day badge + check */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div className={clsx(
            'w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold',
            complete
              ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
              : 'bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300'
          )}>
            {day.day}
          </div>
          <button
            onClick={() => toggleDayComplete(roadmapId, day.day)}
            className="transition-transform hover:scale-110"
            title={complete ? 'Mark incomplete' : 'Mark complete'}
          >
            {complete
              ? <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              : <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 hover:text-brand-400" />
            }
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className={clsx(
            'font-semibold text-slate-900 dark:text-white mb-1',
            complete && 'line-through text-slate-500 dark:text-slate-500'
          )}>
            {day.topic}
          </h4>

          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
            {day.task}
          </p>

          <div className="flex flex-wrap gap-3">
            {/* Resource */}
            {day.resource && (
              isUrl(day.resource) ? (
                <a
                  href={day.resource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  {day.resource.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
                </a>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                  <ExternalLink className="w-3 h-3" />
                  {day.resource}
                </span>
              )
            )}

            {/* Mini project */}
            {day.miniProject && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-800">
                <Wrench className="w-3 h-3" />
                {day.miniProject}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
