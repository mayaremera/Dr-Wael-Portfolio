import { loadDrWaelActivity, loadDrWaelActivityRemote, resolveInTheFieldDisplayOrder } from '../data/contentStore'
import { CONTENT_SECTIONS } from '../data/contentSync'
import { useContentSection } from './useContentSection'

export function useDrWaelActivity() {
  const { content, isRemoteLoaded } = useContentSection(
    loadDrWaelActivity,
    loadDrWaelActivityRemote,
    CONTENT_SECTIONS.ACTIVITY,
  )

  const isReady = isRemoteLoaded && content != null

  return {
    isReady,
    activity: content,
    resolvedInTheFieldEvents: resolveInTheFieldDisplayOrder(content),
  }
}
