/** Public Web3Forms key for info@drwaeldk.com — safe to expose client-side per Web3Forms docs. */
export const WEB3FORMS_ACCESS_KEY =
  import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim() || 'b288f59a-ff8c-4567-b24d-0ab13a694ec9'

export const CONTACT_RECIPIENT_EMAIL = 'info@drwaeldk.com'

export async function submitContactForm({ firstName, lastName, email, subject, message }) {
  const fullName = `${firstName.trim()} ${lastName.trim()}`.trim()
  const trimmedEmail = email.trim()
  const trimmedSubject = subject.trim()
  const trimmedMessage = message.trim()

  const payload = new FormData()
  payload.append('access_key', WEB3FORMS_ACCESS_KEY)
  payload.append('subject', `[Dr. Wael Website] ${trimmedSubject}`)
  payload.append('from_name', 'Dr. Wael Website')
  payload.append('name', fullName)
  payload.append('email', trimmedEmail)
  payload.append('replyto', trimmedEmail)
  payload.append('message', trimmedMessage)

  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: payload,
  })

  let result = {}
  try {
    result = await response.json()
  } catch {
    throw new Error('Unexpected response from email service. Please try again or email us directly.')
  }

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Unable to send your message. Please try again or email us directly.')
  }

  return result
}
