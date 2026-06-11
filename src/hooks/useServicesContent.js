import { loadServicesContent, loadServicesContentRemote } from '../data/servicesContentStore'
import { useContentSection } from './useContentSection'

export function useServicesContent() {
  const { content } = useContentSection(loadServicesContent, loadServicesContentRemote)
  return content
}
