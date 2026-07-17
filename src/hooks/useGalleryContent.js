import { CONTENT_SECTIONS } from '../data/contentSync'
import {
  loadGalleryContent,
  loadGalleryContentRemote,
  resolveMediaGalleryDisplayOrder,
  resolveVideoLibraryDisplayOrder,
} from '../data/galleryContentStore'
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
    featuredVideo2: content?.featuredVideo2,
    promoVideo: content?.promoVideo,
    videoLibrary: content?.videoLibrary,
    mediaGallery: content?.mediaGallery,
    resolvedMediaGalleryItems: resolveMediaGalleryDisplayOrder(
      content?.mediaGallery?.items ?? [],
      content?.mediaGallery?.featuredIds,
    ),
    resolvedVideoLibraryItems: resolveVideoLibraryDisplayOrder(
      content?.videoLibrary?.items ?? [],
      content?.videoLibrary?.featuredIds,
    ),
  }
}
