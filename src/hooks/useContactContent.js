import { loadContactContent, loadContactContentRemote } from '../data/contactContentStore'
import { CONTENT_SECTIONS } from '../data/contentSync'
import { useContentSection } from './useContentSection'

export function useContactContent() {
  const { content, isRemoteLoaded } = useContentSection(
    loadContactContent,
    loadContactContentRemote,
    CONTENT_SECTIONS.CONTACT,
  )

  const isReady = isRemoteLoaded && content != null

  return {
    isReady,
    content,
    contactSection: content?.contactSection,
    contactDetails: content?.contactDetails,
    directContact: content?.directContact,
  }
}
