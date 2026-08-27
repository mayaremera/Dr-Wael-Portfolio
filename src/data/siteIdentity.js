/** Current official site identity — used by content, SEO, and prerender. */

export const SITE_DOMAIN = 'drwaeldk.com'
export const SITE_URL = `https://${SITE_DOMAIN}`
export const SITE_EMAIL = 'info@drwaeldk.com'
export const SITE_PHONE = '+1 321-509-6224'
export const SITE_NAME = 'Dr. Wael A. Al-Dakroury'
export const SITE_JOB_TITLE =
  'Consultant Bilingual Speech Language Pathologist & Associate Professor in Speech Language Pathology'
export const SITE_IMAGE_PATH = '/images/dr-wael.jpeg'

export const SITE_LANGUAGES = ['English', 'Arabic', 'Spanish']

export const SITE_SOCIAL = {
  facebook: 'https://www.facebook.com/share/18yWpgqVwW/?mibextid=wwXIfr',
  threads: 'https://www.threads.com/@dr.waelaldakroury?invite=0',
  linkedin: 'https://www.linkedin.com/in/waelslp?utm_source=share_via&utm_content=profile&utm_medium=member_ios',
  twitter: 'https://x.com/waelslp?s=11&t=dyMPABoxYnqU0IAoWfilIQ',
}

export const SITE_ACADEMIC = {
  googleScholar: 'https://scholar.google.com/citations?user=EEoUMHMAAAAJ&hl=en',
  researchGate: 'https://www.researchgate.net/profile/Wael-Aldakroury?ev=hdr_xprf',
  orcid: 'https://orcid.org/0000-0003-3158-6414',
  orcidId: '0000-0003-3158-6414',
}

export function toTelHref(phone = SITE_PHONE) {
  const digits = String(phone).replace(/[^\d+]/g, '')
  return digits.startsWith('+') ? digits : `+${digits}`
}
