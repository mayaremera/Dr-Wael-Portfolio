import { loadAboutContent, loadAboutContentRemote } from '../data/aboutContentStore'
import { useContentSection } from './useContentSection'

export function useAboutContent() {
  const { content } = useContentSection(loadAboutContent, loadAboutContentRemote)
  return content
}
