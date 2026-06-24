import { CONTENT_SECTIONS } from '../data/contentSync'
import { loadServicesContent, loadServicesContentRemote } from '../data/servicesContentStore'
import { useContentSection } from './useContentSection'

export function useServicesContent() {
  const { content, isRemoteLoaded } = useContentSection(
    loadServicesContent,
    loadServicesContentRemote,
    CONTENT_SECTIONS.SERVICES,
  )

  const isReady = isRemoteLoaded && content != null

  return {
    isReady,
    content,
    speechLanguageServices: content?.speechLanguageServices,
    therapyConcepts: content?.therapyConcepts ?? [],
    casesWeServe: content?.casesWeServe,
    clinicalSpecializations: content?.clinicalSpecializations ?? [],
    testimonialsSection: content?.testimonialsSection,
    testimonials: content?.testimonials ?? [],
  }
}
