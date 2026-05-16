import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Target, Quote } from 'lucide-react'
import DayCard from './DayCard'
import clsx from 'clsx'

const WEEK_COLORS = [
  'from-blue-500 to-brand-600',
  'from-purple-500 to-pink-500',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-500',
  'from-rose-500 to-red-600',
]

export default function WeekCard({ week, roadmapId, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  const color = WEEK_COLORS[(week.week - 1) % WEEK_COLORS.length]

  return (
    <div className="card overflow-hidden">
      {/* Week header */}
      <button
        className="w-full text-left"
        onClick={() => setOpen(o => !o)}
      >
        <div className={clsx('bg-gradient-to-r p-5', color)}>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-white/70 text-xs font-semibold uppercase tracking-widest">
                Week {week.week}
              </span>
              <h3 className="text-white font-bold text-lg mt-0.5 leading-snug">
                {week.goal}
              </h3>
            </div>
            <motion.div
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="shrink-0 ml-4"
            >
              <ChevronDown className="w-5 h-5 text-white/80" />
            </motion.div>
          </div>
        </div>

        {/* Motivational message */}
        {week.motivationalMessage && (
          <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-700 flex items-start gap-2">
            <Quote className="w-3.5 h-3.5 mt-0.5 shrink-0 text-brand-400" />
            <p className="text-xs text-slate-500 dark:text-slate-400 italic leading-relaxed">
              {week.motivationalMessage}
            </p>
          </div>
        )}
      </button>

      {/* Days */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-3">
              {week.days?.map((day, i) => (
                <DayCard key={day.day} day={day} roadmapId={roadmapId} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
