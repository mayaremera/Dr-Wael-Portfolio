import { createRoot } from 'react-dom/client'
import { clearLegacyLocalCaches } from './data/contentSync'
import './index.css'
import App from './App.jsx'

clearLegacyLocalCaches()

createRoot(document.getElementById('root')).render(<App />)
