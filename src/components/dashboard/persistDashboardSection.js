import { isSupabaseConfigured } from '../../lib/supabase'

const noticeTimeouts = new WeakMap()

function scheduleNoticeClear(setter, delay = 4000) {
  const existing = noticeTimeouts.get(setter)
  if (existing) window.clearTimeout(existing)

  const timeoutId = window.setTimeout(() => {
    setter('')
    noticeTimeouts.delete(setter)
  }, delay)

  noticeTimeouts.set(setter, timeoutId)
}

export async function persistDashboardSection({
  saveFn,
  nextContent,
  previousContent = null,
  setContent,
  setSaveError,
  setSavedMessage,
  setIsSaving,
  message = 'Changes saved.',
  storageErrorMessage = 'Could not save to Supabase. Check your connection and sign-in.',
}) {
  setIsSaving?.(true)
  setSavedMessage('')

  try {
    const result = await saveFn(nextContent)
    setContent(result?.data ?? nextContent)
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
    scheduleNoticeClear(setSavedMessage)
  } catch (error) {
    setSavedMessage('')
    if (previousContent != null) {
      setContent(previousContent)
    }
    const errorMessage = error?.message || storageErrorMessage
    setSaveError(errorMessage)
    scheduleNoticeClear(setSaveError, 5000)
  } finally {
    setIsSaving?.(false)
  }
}
