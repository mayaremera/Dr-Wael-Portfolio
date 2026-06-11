import { loadContactContent, loadContactContentRemote } from '../data/contactContentStore'
import { useContentSection } from './useContentSection'

export function useContactContent() {
  const { content } = useContentSection(loadContactContent, loadContactContentRemote)
  return content
}
