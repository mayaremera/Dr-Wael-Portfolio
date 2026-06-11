import { getDefaultAboutContent } from './aboutContentStore'
import { getDefaultContactContent } from './contactContentStore'
import { CONTENT_SECTIONS, listRemoteSections, saveRemoteSection } from './contentSync'
import { getDefaultDrWaelActivity } from './contentStore'
import { getDefaultGalleryContent } from './galleryContentStore'
import { getDefaultServicesContent } from './servicesContentStore'

export const SEED_SECTIONS = [
  { section: CONTENT_SECTIONS.ACTIVITY, label: 'In the Field', getDefaults: getDefaultDrWaelActivity },
  { section: CONTENT_SECTIONS.SERVICES, label: 'Services', getDefaults: getDefaultServicesContent },
  { section: CONTENT_SECTIONS.GALLERY, label: 'Gallery', getDefaults: getDefaultGalleryContent },
  { section: CONTENT_SECTIONS.ABOUT, label: 'About Me', getDefaults: getDefaultAboutContent },
  { section: CONTENT_SECTIONS.CONTACT, label: 'Contact', getDefaults: getDefaultContactContent },
]

export async function seedAllSectionsToSupabase({ overwrite = false } = {}) {
  const existing = await listRemoteSections()
  const existingSections = new Set(existing.map((row) => row.section))
  const seeded = []
  const skipped = []

  for (const entry of SEED_SECTIONS) {
    if (!overwrite && existingSections.has(entry.section)) {
      skipped.push(entry.label)
      continue
    }

    const result = await saveRemoteSection(entry.section, entry.getDefaults())
    if (!result.synced) {
      throw new Error('Sign in to Supabase before publishing default content.')
    }

    seeded.push(entry.label)
  }

  return { seeded, skipped }
}
