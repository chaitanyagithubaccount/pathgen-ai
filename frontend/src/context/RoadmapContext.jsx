import { createContext, useContext, useState, useEffect } from 'react'

const RoadmapContext = createContext()

const HISTORY_KEY = 'pathgen-history'
const PROGRESS_KEY = 'pathgen-progress'

export function RoadmapProvider({ children }) {
  const [currentRoadmap, setCurrentRoadmap] = useState(null)
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []
    } catch {
      return []
    }
  })
  const [progress, setProgress] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}
    } catch {
      return {}
    }
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  }, [history])

  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
  }, [progress])

  const saveRoadmap = (roadmap) => {
    setCurrentRoadmap(roadmap)
    setHistory(prev => {
      const filtered = prev.filter(r => r.id !== roadmap.id)
      return [roadmap, ...filtered].slice(0, 10) // keep last 10
    })
  }

  const toggleDayComplete = (roadmapId, dayNumber) => {
    setProgress(prev => {
      const key = `${roadmapId}-${dayNumber}`
      return { ...prev, [key]: !prev[key] }
    })
  }

  const isDayComplete = (roadmapId, dayNumber) => {
    return !!progress[`${roadmapId}-${dayNumber}`]
  }

  const getCompletedCount = (roadmapId, totalDays) => {
    let count = 0
    for (let d = 1; d <= totalDays; d++) {
      if (progress[`${roadmapId}-${d}`]) count++
    }
    return count
  }

  const deleteHistory = (id) => {
    setHistory(prev => prev.filter(r => r.id !== id))
    if (currentRoadmap?.id === id) setCurrentRoadmap(null)
  }

  return (
    <RoadmapContext.Provider value={{
      currentRoadmap, setCurrentRoadmap,
      history,
      isLoading, setIsLoading,
      error, setError,
      saveRoadmap,
      toggleDayComplete,
      isDayComplete,
      getCompletedCount,
      deleteHistory,
    }}>
      {children}
    </RoadmapContext.Provider>
  )
}

export const useRoadmap = () => useContext(RoadmapContext)
