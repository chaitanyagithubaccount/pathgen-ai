import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ThemeProvider } from './context/ThemeContext'
import { RoadmapProvider } from './context/RoadmapContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <RoadmapProvider>
          <App />
        </RoadmapProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
