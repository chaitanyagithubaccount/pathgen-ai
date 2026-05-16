import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6">
      <div className="relative">
        <motion.div
          className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center shadow-lg"
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <Sparkles className="w-8 h-8 text-white" />
        </motion.div>
        <motion.div
          className="absolute inset-0 rounded-2xl border-4 border-brand-300 dark:border-brand-700"
          animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        />
      </div>
      <div className="text-center">
        <p className="font-semibold text-slate-700 dark:text-slate-200 text-lg">
          Gemini AI is thinking...
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Crafting your personalized 30-day roadmap
        </p>
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-brand-500"
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  )
}
