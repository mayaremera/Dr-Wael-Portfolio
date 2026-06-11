import { isSupabaseConfigured } from '../../lib/supabase'

export async function persistDashboardSection({
  saveFn,
  nextContent,
  setContent,
  setSaveError,
  setSavedMessage,
  message = 'Changes saved.',
  storageErrorMessage = 'Could not save to Supabase. Check your connection and sign-in.',
}) {
  try {
    const result = await saveFn(nextContent)
    setContent(nextContent)
    setSaveError('')

    let statusMessage = message
    if (result?.synced) {
      statusMessage = `${message} Saved to Supabase.`
    } else if (isSupabaseConfigured) {
      throw new Error('Save did not reach Supabase.')
    } else {
      statusMessage = `${message} Saved locally (Supabase not configured).`
    }

    setSavedMessage(statusMessage)
    window.setTimeout(() => setSavedMessage(''), 3000)
  } catch (error) {
    setSaveError(error?.message || storageErrorMessage)
  }
}
