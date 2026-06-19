import { loadHomeContent, loadHomeContentRemote } from '../data/homeContentStore'
import { useContentSection } from './useContentSection'

export function useHomeContent() {
  const { content } = useContentSection(loadHomeContent, loadHomeContentRemote)
  return content
}
