import { CONTENT_SECTIONS } from '../data/contentSync'
import { loadHomeContent, loadHomeContentRemote } from '../data/homeContentStore'
import { useContentSection } from './useContentSection'

export function useHomeContent() {
  const { content, isRemoteLoaded } = useContentSection(
    loadHomeContent,
    loadHomeContentRemote,
    CONTENT_SECTIONS.HOME,
  )

  return { content, isReady: isRemoteLoaded && content != null }
}
