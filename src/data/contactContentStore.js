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
    contactSection: {
      label: 'Contact & Appointment',
      title: "Let's start the conversation",
      intro:
        'Parents, colleagues, and institutions are welcome. Reach out to book a session or ask a question.',
    },
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
  const { professionalServices: _removed, ...savedRest } = saved ?? {}

  return {
    ...defaults,
    ...savedRest,
    contactSection: {
      ...defaults.contactSection,
      ...savedRest.contactSection,
    },
    contactDetails: {
      ...defaults.contactDetails,
      ...savedRest.contactDetails,
      workplace: {
        ...defaults.contactDetails.workplace,
        ...savedRest.contactDetails?.workplace,
      },
      schedule: savedRest.contactDetails?.schedule ?? defaults.contactDetails.schedule,
    },
    directContact: {
      ...defaults.directContact,
      ...savedRest.directContact,
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
  const { professionalServices: _removed, ...payload } = data ?? {}
  return saveSectionPrimary({
    section: CONTENT_SECTIONS.CONTACT,
    storageKey: CONTACT_STORAGE_KEY,
    data: payload,
  })
}

export async function resetContactContent() {
  return resetSectionPrimary({
    section: CONTENT_SECTIONS.CONTACT,
    storageKey: CONTACT_STORAGE_KEY,
  })
}
