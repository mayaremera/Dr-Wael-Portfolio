import { loadAboutContent, loadAboutContentRemote, resolveCertificateDisplayOrder } from '../data/aboutContentStore'
import { CONTENT_SECTIONS } from '../data/contentSync'
import { useContentSection } from './useContentSection'

export function useAboutContent() {
  const { content, isRemoteLoaded } = useContentSection(
    loadAboutContent,
    loadAboutContentRemote,
    CONTENT_SECTIONS.ABOUT,
  )

  const isReady = isRemoteLoaded && content != null

  return {
    isReady,
    content,
    profileDetails: content?.profileDetails,
    profileImage: content?.profileImage,
    careerImpact: content?.careerImpact,
    academicServices: content?.academicServices,
    certificatesSection: content?.certificatesSection,
    certificates: resolveCertificateDisplayOrder(
      content?.certificates ?? [],
      content?.certificatesFeaturedIds,
    ),
    careerTimelineSection: content?.careerTimelineSection,
    careerTimeline: content?.careerTimeline ?? [],
    refereedPublications: content?.refereedPublications,
  }
}
