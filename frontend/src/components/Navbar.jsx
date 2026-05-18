import { useNavigate } from 'react-router-dom'
import { Moon, Sun, Zap, Home, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'

export default function Navbar({ onMenuToggle, menuOpen }) {
  const { isDark, toggle } = useTheme()
  const navigate = useNavigate()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between px-4 md:px-6 h-16">
        {/* Left: menu + logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors md:hidden"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shadow-sm">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white hidden sm:inline">PathGen AI</span>
          </button>
        </div>

        {/* Centre: capstone tag */}
        <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-brand-500 to-purple-600 text-white text-xs font-semibold shadow-sm">
          #IITPatnaCapstone
        </span>

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Home"
          >
            <Home className="w-4 h-4" />
          </button>
          <button
            onClick={toggle}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  )
}
