import { createRoot } from 'react-dom/client'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { clearLegacyLocalCaches } from './data/contentSync'
import './index.css'
import App from './App.jsx'

clearLegacyLocalCaches()

createRoot(document.getElementById('root')).render(
  <>
    <App />
    <SpeedInsights />
  </>,
)
