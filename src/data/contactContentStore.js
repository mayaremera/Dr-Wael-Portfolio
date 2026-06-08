import { contactDetails as defaultContactDetails, site as defaultSite } from './content'
import { CONTENT_UPDATED_EVENT } from './contentStore'

const CONTACT_STORAGE_KEY = 'drwael-contact-content'

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
  try {
    const saved = localStorage.getItem(CONTACT_STORAGE_KEY)
    if (saved) {
      return mergeWithDefaults(JSON.parse(saved))
    }
  } catch {
    // fall through
  }

  return getDefaultContactContent()
}

export function saveContactContent(data) {
  try {
    localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    if (error?.name === 'QuotaExceededError') {
      throw new Error('Storage quota exceeded')
    }
    throw error
  }

  window.dispatchEvent(new Event(CONTENT_UPDATED_EVENT))
}

export function resetContactContent() {
  localStorage.removeItem(CONTACT_STORAGE_KEY)
  window.dispatchEvent(new Event(CONTENT_UPDATED_EVENT))
}
