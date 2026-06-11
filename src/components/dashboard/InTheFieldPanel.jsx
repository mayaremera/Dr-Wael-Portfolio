import { useMemo, useState } from 'react'
import DashboardItemList from './DashboardItemList'
import EventDatePicker from './EventDatePicker'
import MediaDropzone from './MediaDropzone'
import {
  createActivityId,
  emptyActivityEvent,
  getDefaultDrWaelActivity,
  loadDrWaelActivityRemote,
  resetDrWaelActivity,
  saveDrWaelActivity,
} from '../../data/contentStore'
import { useDashboardSection } from '../../hooks/useDashboardSection'
import DashboardSectionLoader from './DashboardSectionLoader'
import { persistDashboardSection } from './persistDashboardSection'

const fieldClassName =
  'w-full rounded-lg border border-slate-200/90 bg-white px-3 py-2.5 text-sm text-ink outline-none transition-all placeholder:text-ink-muted/50 focus:border-brand/40 focus:ring-2 focus:ring-brand/15'

const labelClassName = 'mb-1.5 block text-[0.65rem] font-semibold tracking-wide text-ink-muted uppercase'

function PanelShell({ eyebrow, title, description, children }) {
  return (
    <div className="animate-fade-up">
      <header className="mb-8">
        <p className="text-xs font-semibold tracking-[0.2em] text-brand uppercase">{eyebrow}</p>
        <h1 className="mt-2 font-serif text-3xl text-ink md:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted md:text-base">{description}</p>
      </header>
      {children}
    </div>
  )
}

function getEventStatus(activity, eventId) {
  if (activity.upcoming.some((item) => item.id === eventId)) return 'upcoming'
  if (activity.recent.some((item) => item.id === eventId)) return 'recent'
  return 'upcoming'
}

function EventPreview({ event, isUpcoming }) {
  const mediaSrc = event.video || event.image

  return (
    <div className="flex gap-3">
      <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200/80">
        {mediaSrc ? (
          event.video ? (
            <video src={event.video} className="h-full w-full object-cover" muted playsInline />
          ) : (
            <img src={event.image} alt="" className="h-full w-full object-cover" />
          )
        ) : (
          <div className="flex h-full items-center justify-center text-[0.6rem] text-ink-muted">No media</div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-brand-muted px-2 py-0.5 text-[0.6rem] font-semibold tracking-wide text-brand uppercase">
            {event.type || 'Event'}
          </span>
          {isUpcoming ? (
            <span className="rounded-full bg-accent px-2 py-0.5 text-[0.6rem] font-semibold tracking-wide text-white uppercase">
              Upcoming
            </span>
          ) : null}
        </div>
        <p className="mt-1 truncate font-medium text-ink">{event.title || 'Untitled event'}</p>
        <p className="mt-1 text-xs text-ink-muted">
          {event.date}
          {event.period ? ` · ${event.period}` : ''}
        </p>
        <p className="truncate text-xs text-ink-muted">{event.location}</p>
      </div>
    </div>
  )
}

function EventEditor({ initialEvent, initialStatus = 'upcoming', onSave, onCancel }) {
  const [event, setEvent] = useState({
    ...emptyActivityEvent,
    ...initialEvent,
  })
  const [status, setStatus] = useState(initialStatus)

  const updateField = (field, value) => {
    setEvent((current) => ({ ...current, [field]: value }))
  }

  const handleMediaChange = ({ image, video }) => {
    setEvent((current) => ({ ...current, image, video }))
  }

  const handleDateChange = ({ date, period }) => {
    setEvent((current) => ({ ...current, date, period }))
  }

  const handleSubmit = (submitEvent) => {
    submitEvent.preventDefault()

    if (!event.date || !event.period) return

    const payload = {
      ...event,
      id: event.id || createActivityId(event.title),
    }

    onSave(payload, status)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-brand/20 bg-brand-muted/30 p-5 shadow-sm"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-serif text-xl text-ink">{event.id ? 'Edit event' : 'New event'}</h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-semibold tracking-wide text-ink-muted uppercase hover:text-brand"
        >
          Cancel
        </button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClassName}>Status</label>
          <div className="flex gap-2">
            {[
              { id: 'upcoming', label: 'Upcoming' },
              { id: 'recent', label: 'Recent' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setStatus(option.id)}
                className={`rounded-lg px-4 py-2 text-xs font-semibold tracking-wide uppercase transition-colors ${
                  status === option.id
                    ? option.id === 'upcoming'
                      ? 'bg-accent text-white'
                      : 'bg-brand text-white'
                    : 'bg-white text-ink-muted ring-1 ring-slate-200 hover:text-brand'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className={labelClassName}>Date</label>
          <EventDatePicker
            key={`${event.id || 'new'}-${event.date}-${event.period}`}
            date={event.date}
            period={event.period}
            onChange={handleDateChange}
          />
        </div>
        <div>
          <label className={labelClassName}>Type</label>
          <input
            className={fieldClassName}
            value={event.type}
            onChange={(e) => updateField('type', e.target.value)}
            placeholder="Conference"
            required
          />
        </div>
        <div>
          <label className={labelClassName}>Location</label>
          <input
            className={fieldClassName}
            value={event.location}
            onChange={(e) => updateField('location', e.target.value)}
            placeholder="Riyadh"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClassName}>Title</label>
          <input
            className={fieldClassName}
            value={event.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Event title"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClassName}>Description note</label>
          <textarea
            className={`${fieldClassName} min-h-24 resize-y`}
            value={event.note}
            onChange={(e) => updateField('note', e.target.value)}
            placeholder="Short description shown on hover"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClassName}>Image alt text</label>
          <input
            className={fieldClassName}
            value={event.imageAlt}
            onChange={(e) => updateField('imageAlt', e.target.value)}
            placeholder="Describe the event image"
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClassName}>Photo or video</label>
          <MediaDropzone
            image={event.image}
            video={event.video}
            onChange={handleMediaChange}
            onClear={() => handleMediaChange({ image: '', video: '' })}
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:bg-brand-light"
        >
          Save event
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-200 px-5 py-2.5 text-xs font-semibold tracking-wide text-ink-muted uppercase transition-colors hover:border-brand/25 hover:text-brand"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default function InTheFieldPanel() {
  const { content: activity, setContent: setActivity, loading, loadError } = useDashboardSection(
    getDefaultDrWaelActivity,
    loadDrWaelActivityRemote,
  )
  const [editingId, setEditingId] = useState(null)
  const [savedMessage, setSavedMessage] = useState('')
  const [saveError, setSaveError] = useState('')

  const allEvents = useMemo(
    () => [
      ...activity.upcoming.map((event) => ({ ...event, status: 'upcoming' })),
      ...activity.recent.map((event) => ({ ...event, status: 'recent' })),
    ],
    [activity],
  )

  const persist = (nextActivity, message = 'Changes saved.') => {
    persistDashboardSection({
      saveFn: saveDrWaelActivity,
      nextContent: nextActivity,
      setContent: setActivity,
      setSaveError,
      setSavedMessage,
      message,
      storageErrorMessage: 'Could not save — media may be too large. Try a smaller file.',
    })
  }

  const updateMeta = (field, value) => {
    setActivity((current) => ({ ...current, [field]: value }))
  }

  const saveMeta = () => {
    persist(activity)
  }

  const handleSaveEvent = (event, status) => {
    const sourceStatus = event.id ? getEventStatus(activity, event.id) : null

    let nextUpcoming = activity.upcoming.filter((item) => item.id !== event.id)
    let nextRecent = activity.recent.filter((item) => item.id !== event.id)

    if (status === 'upcoming') {
      nextUpcoming = [event, ...nextUpcoming]
    } else {
      nextRecent = [event, ...nextRecent]
    }

    const exists = Boolean(sourceStatus)
    const nextActivity = { ...activity, upcoming: nextUpcoming, recent: nextRecent }

    persist(
      nextActivity,
      exists && sourceStatus !== status ? 'Event moved and saved.' : exists ? 'Event updated.' : 'Event created.',
    )
    setEditingId(null)
  }

  const handleDeleteEvent = (eventId) => {
    const nextActivity = {
      ...activity,
      upcoming: activity.upcoming.filter((item) => item.id !== eventId),
      recent: activity.recent.filter((item) => item.id !== eventId),
    }

    persist(nextActivity, 'Event deleted.')
    if (editingId === eventId) setEditingId(null)
  }

  const handleReset = () => {
    if (!window.confirm('Reset all In the Field content back to the original defaults?')) return

    resetDrWaelActivity()
    setActivity(getDefaultDrWaelActivity())
    setEditingId(null)
    setSaveError('')
    setSavedMessage('Reset to default content.')
    window.setTimeout(() => setSavedMessage(''), 2500)
  }

  return (
    <PanelShell
      eyebrow="In the Field"
      title="Professional activity"
      description="Create, edit, and delete event cards for the live In the Field page. Saves go to Supabase and update the website for all visitors."
    >
      <DashboardSectionLoader loading={loading} loadError={loadError} />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <a
          href="/in-the-field"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-brand transition-colors hover:text-brand-light"
        >
          Preview live page →
        </a>
        <div className="flex flex-wrap items-center gap-2">
          {saveError ? (
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent-hover">{saveError}</span>
          ) : null}
          {savedMessage ? (
            <span className="rounded-full bg-brand-muted px-3 py-1 text-xs font-semibold text-brand">{savedMessage}</span>
          ) : null}
        </div>
      </div>

      <section className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-brand/5">
        <h2 className="font-serif text-xl text-ink">Section header</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClassName}>Label</label>
            <input className={fieldClassName} value={activity.label} onChange={(e) => updateMeta('label', e.target.value)} />
          </div>
          <div>
            <label className={labelClassName}>Title</label>
            <input className={fieldClassName} value={activity.title} onChange={(e) => updateMeta('title', e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClassName}>Description</label>
            <textarea
              className={`${fieldClassName} min-h-24 resize-y`}
              value={activity.description}
              onChange={(e) => updateMeta('description', e.target.value)}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={saveMeta}
          className="mt-4 rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:bg-brand-light"
        >
          Save header
        </button>
      </section>

      <div className="mt-6">
        <DashboardItemList
          title="Events"
          countLabel={`${allEvents.length} event${allEvents.length === 1 ? '' : 's'} · upcoming shown in orange`}
          items={allEvents}
          editingId={editingId}
          onAdd={() => setEditingId('new')}
          onEdit={setEditingId}
          onDelete={handleDeleteEvent}
          getItemId={(event) => event.id}
          addLabel="Add event"
          emptyMessage="No events yet. Add your first one."
          renderItem={(event) => {
            const isUpcoming = event.status === 'upcoming'

            return (
              <article
                className={`overflow-hidden rounded-lg border bg-surface-alt/60 ${
                  isUpcoming ? 'border-accent/30' : 'border-slate-200/80'
                }`}
              >
                <div className={`h-1 ${isUpcoming ? 'bg-accent' : 'bg-brand'}`} aria-hidden="true" />
                <div className="p-4">
                  {editingId === event.id ? (
                    <EventEditor
                      initialEvent={event}
                      initialStatus={event.status}
                      onSave={handleSaveEvent}
                      onCancel={() => setEditingId(null)}
                    />
                  ) : (
                    <>
                      <EventPreview event={event} isUpcoming={isUpcoming} />
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingId(event.id)}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold tracking-wide text-brand uppercase transition-colors hover:border-brand/25"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteEvent(event.id)}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold tracking-wide text-accent-hover uppercase transition-colors hover:border-accent/30"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </article>
            )
          }}
          renderEditor={(item) =>
            item === 'new' ? (
              <EventEditor initialEvent={emptyActivityEvent} onSave={handleSaveEvent} onCancel={() => setEditingId(null)} />
            ) : null
          }
        />
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={handleReset}
          className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold tracking-wide text-ink-muted uppercase transition-colors hover:border-accent/30 hover:text-accent-hover"
        >
          Reset to defaults
        </button>
      </div>
    </PanelShell>
  )
}
