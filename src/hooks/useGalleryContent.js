import { loadGalleryContent, loadGalleryContentRemote } from '../data/galleryContentStore'
import { useContentSection } from './useContentSection'

export function useGalleryContent() {
  const { content } = useContentSection(loadGalleryContent, loadGalleryContentRemote)
  return content
}
