import { CONTENT_SECTIONS } from '../data/contentSync'
import { loadGalleryContent, loadGalleryContentRemote } from '../data/galleryContentStore'
import { useContentSection } from './useContentSection'

export function useGalleryContent() {
  const { content, isRemoteLoaded } = useContentSection(
    loadGalleryContent,
    loadGalleryContentRemote,
    CONTENT_SECTIONS.GALLERY,
  )

  const isReady = isRemoteLoaded && content != null

  return {
    isReady,
    content,
    watchSection: content?.watchSection,
    promoVideo: content?.promoVideo,
    videoLibrary: content?.videoLibrary,
    mediaGallery: content?.mediaGallery,
  }
}
