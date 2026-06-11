import { loadDrWaelActivity, loadDrWaelActivityRemote } from '../data/contentStore'
import { useContentSection } from './useContentSection'

export function useDrWaelActivity() {
  const { content } = useContentSection(loadDrWaelActivity, loadDrWaelActivityRemote)
  return content
}
