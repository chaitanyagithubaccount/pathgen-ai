import { motion } from 'framer-motion'
import clsx from 'clsx'

export default function ProgressBar({ completed, total, label, className }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  const color =
    pct === 100 ? 'bg-emerald-500' :
    pct >= 60  ? 'bg-brand-500'   :
    pct >= 30  ? 'bg-amber-500'   : 'bg-slate-300 dark:bg-slate-600'

  return (
    <div className={clsx('w-full', className)}>
      <div className="flex items-center justify-between mb-1.5 text-sm">
        {label && <span className="font-medium text-slate-700 dark:text-slate-300">{label}</span>}
        <span className={clsx('font-semibold ml-auto', pct === 100 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400')}>
          {pct}%
        </span>
      </div>
      <div className="h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className={clsx('h-full rounded-full', color)}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
        {completed} of {total} days completed
      </p>
    </div>
  )
}
