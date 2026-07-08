export const CONTACT_RECIPIENT_EMAIL = 'info@drwaeldk.com'

const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${encodeURIComponent(CONTACT_RECIPIENT_EMAIL)}`

export async function submitContactForm({ firstName, lastName, email, subject, message }) {
  const trimmedFirst = firstName.trim()
  const trimmedLast = lastName.trim()
  const fullName = `${trimmedFirst} ${trimmedLast}`.trim()
  const trimmedEmail = email.trim()
  const inquiryType = subject.trim()
  const trimmedMessage = message.trim()

  const response = await fetch(FORMSUBMIT_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      name: fullName,
      email: trimmedEmail,
      'First Name': trimmedFirst,
      'Last Name': trimmedLast,
      'Inquiry Type': inquiryType,
      Message: trimmedMessage,
      _subject: `Dr. Wael · New appointment · ${fullName} · ${inquiryType}`,
      _replyto: trimmedEmail,
      _template: 'box',
      _captcha: 'false',
    }),
  })

  let result = {}
  try {
    result = await response.json()
  } catch {
    throw new Error('Unexpected response from email service. Please try again or email us directly.')
  }

  const succeeded = result.success === true || result.success === 'true'
  if (!response.ok || !succeeded) {
    throw new Error(result.message || 'Unable to send your message. Please try again or email us directly.')
  }

  return result
}
