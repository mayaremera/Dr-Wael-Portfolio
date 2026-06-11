import { contactDetails as defaultContactDetails, site as defaultSite } from './content'
import {
  CONTENT_SECTIONS,
  loadSectionPrimary,
  resetSectionPrimary,
  saveSectionPrimary,
} from './contentSync'

export const CONTACT_STORAGE_KEY = 'drwael-contact-content'

function cloneContent(data) {
  return JSON.parse(JSON.stringify(data))
}

export function getDefaultContactContent() {
  return {
    contactDetails: cloneContent(defaultContactDetails),
    directContact: {
      email: defaultSite.email,
      phone: defaultSite.phone,
      domain: defaultSite.domain,
    },
  }
}

function mergeWithDefaults(saved) {
  const defaults = getDefaultContactContent()

  return {
    ...defaults,
    ...saved,
    contactDetails: {
      ...defaults.contactDetails,
      ...saved.contactDetails,
      workplace: {
        ...defaults.contactDetails.workplace,
        ...saved.contactDetails?.workplace,
      },
      schedule: saved.contactDetails?.schedule ?? defaults.contactDetails.schedule,
    },
    directContact: {
      ...defaults.directContact,
      ...saved.directContact,
    },
  }
}

export function loadContactContent() {
  return getDefaultContactContent()
}

export async function loadContactContentRemote() {
  return loadSectionPrimary({
    section: CONTENT_SECTIONS.CONTACT,
    storageKey: CONTACT_STORAGE_KEY,
    mergeWithDefaults,
    getDefaults: getDefaultContactContent,
  })
}

export async function saveContactContent(data) {
  return saveSectionPrimary({
    section: CONTENT_SECTIONS.CONTACT,
    storageKey: CONTACT_STORAGE_KEY,
    data,
  })
}

export async function resetContactContent() {
  return resetSectionPrimary({
    section: CONTENT_SECTIONS.CONTACT,
    storageKey: CONTACT_STORAGE_KEY,
  })
}
