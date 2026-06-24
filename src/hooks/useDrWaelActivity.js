import { loadDrWaelActivity, loadDrWaelActivityRemote } from '../data/contentStore'
import { CONTENT_SECTIONS } from '../data/contentSync'
import { useContentSection } from './useContentSection'

export function useDrWaelActivity() {
  const { content, isRemoteLoaded } = useContentSection(
    loadDrWaelActivity,
    loadDrWaelActivityRemote,
    CONTENT_SECTIONS.ACTIVITY,
  )

  return { activity: content, isReady: isRemoteLoaded && content != null }
}
