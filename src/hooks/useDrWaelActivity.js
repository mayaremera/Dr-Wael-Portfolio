import { useEffect, useState } from 'react'
import { CONTENT_UPDATED_EVENT, loadDrWaelActivity } from '../data/contentStore'

export function useDrWaelActivity() {
  const [activity, setActivity] = useState(loadDrWaelActivity)

  useEffect(() => {
    const refresh = () => setActivity(loadDrWaelActivity())

    window.addEventListener(CONTENT_UPDATED_EVENT, refresh)
    window.addEventListener('storage', refresh)

    return () => {
      window.removeEventListener(CONTENT_UPDATED_EVENT, refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  return activity
}
