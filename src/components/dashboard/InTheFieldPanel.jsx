import { useMemo, useState } from 'react'
import DashboardItemList from './DashboardItemList'
import EventDatePicker from './EventDatePicker'
import MediaDropzone from './MediaDropzone'
import { useConfirmDelete } from './DeleteConfirmDialog'
import {
  createActivityId,
  emptyActivityEvent,
  emptyGlobeLocation,
  emptyGlobeMilestone,
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

function GlobeLocationPreview({ location }) {
  return (
    <div className="flex gap-3">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-2xl ring-1 ring-slate-200/80">
        {location.flag || '🌍'}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-ink">{location.country || 'Untitled location'}</p>
        <p className="text-xs text-ink-muted">{location.city}</p>
        <p className="mt-1 text-xs text-ink-muted">
          {location.milestones?.length ?? 0} milestone{(location.milestones?.length ?? 0) === 1 ? '' : 's'} ·{' '}
          {Number(location.lat).toFixed(2)}, {Number(location.lng).toFixed(2)}
        </p>
      </div>
    </div>
  )
}

function GlobeMilestoneEditor({ initialMilestone, onSave, onCancel }) {
  const [milestone, setMilestone] = useState({ ...emptyGlobeMilestone, ...initialMilestone })
  const update = (field, value) => setMilestone((current) => ({ ...current, [field]: value }))

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onSave({
          ...milestone,
          id: milestone.id || createActivityId(milestone.title),
          isMilestone: true,
        })
      }}
      className="rounded-lg border border-slate-200/80 bg-white p-4"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClassName}>Period</label>
          <input className={fieldClassName} value={milestone.period} onChange={(e) => update('period', e.target.value)} required />
        </div>
        <div>
          <label className={labelClassName}>Date</label>
          <input className={fieldClassName} value={milestone.date} onChange={(e) => update('date', e.target.value)} required />
        </div>
        <div>
          <label className={labelClassName}>Type</label>
          <input className={fieldClassName} value={milestone.type} onChange={(e) => update('type', e.target.value)} required />
        </div>
        <div>
          <label className={labelClassName}>Location</label>
          <input className={fieldClassName} value={milestone.location} onChange={(e) => update('location', e.target.value)} required />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClassName}>Title</label>
          <input className={fieldClassName} value={milestone.title} onChange={(e) => update('title', e.target.value)} required />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClassName}>Note</label>
          <textarea className={`${fieldClassName} min-h-20 resize-y`} value={milestone.note} onChange={(e) => update('note', e.target.value)} required />
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button type="submit" className="rounded-lg bg-brand px-4 py-2 text-xs font-semibold tracking-wide text-white uppercase">
          Save milestone
        </button>
        <button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold tracking-wide text-ink-muted uppercase">
          Cancel
        </button>
      </div>
    </form>
  )
}

function GlobeLocationEditor({ initialLocation, onSave, onCancel }) {
  const confirmDelete = useConfirmDelete()
  const [location, setLocation] = useState({
    ...emptyGlobeLocation,
    ...initialLocation,
    milestones: initialLocation.milestones ?? [],
  })
  const [editingMilestoneId, setEditingMilestoneId] = useState(null)

  const update = (field, value) => setLocation((current) => ({ ...current, [field]: value }))

  const saveMilestone = (milestone) => {
    setLocation((current) => {
      const exists = current.milestones.some((entry) => entry.id === milestone.id)
      const milestones = exists
        ? current.milestones.map((entry) => (entry.id === milestone.id ? milestone : entry))
        : [milestone, ...current.milestones]

      return { ...current, milestones }
    })
    setEditingMilestoneId(null)
  }

  const deleteMilestone = (id) => {
    setLocation((current) => ({
      ...current,
      milestones: current.milestones.filter((entry) => entry.id !== id),
    }))
    if (editingMilestoneId === id) setEditingMilestoneId(null)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSave({
      ...location,
      id: location.id || createActivityId(location.country),
      lat: Number(location.lat),
      lng: Number(location.lng),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-brand/20 bg-brand-muted/30 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-serif text-xl text-ink">{location.id ? 'Edit globe location' : 'New globe location'}</h3>
        <button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold tracking-wide text-ink-muted uppercase">
          Cancel
        </button>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClassName}>Country</label>
          <input className={fieldClassName} value={location.country} onChange={(e) => update('country', e.target.value)} required />
        </div>
        <div>
          <label className={labelClassName}>City</label>
          <input className={fieldClassName} value={location.city} onChange={(e) => update('city', e.target.value)} required />
        </div>
        <div>
          <label className={labelClassName}>Latitude</label>
          <input className={fieldClassName} type="number" step="any" value={location.lat} onChange={(e) => update('lat', e.target.value)} required />
        </div>
        <div>
          <label className={labelClassName}>Longitude</label>
          <input className={fieldClassName} type="number" step="any" value={location.lng} onChange={(e) => update('lng', e.target.value)} required />
        </div>
        <div>
          <label className={labelClassName}>Flag emoji</label>
          <input className={fieldClassName} value={location.flag} onChange={(e) => update('flag', e.target.value)} placeholder="🇸🇦" />
        </div>
        <div>
          <label className={labelClassName}>Role label</label>
          <input className={fieldClassName} value={location.role} onChange={(e) => update('role', e.target.value)} required />
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-slate-200/80 bg-white/70 p-4">
        <div className="flex items-center justify-between gap-3">
          <h4 className="text-sm font-semibold text-ink">Milestones at this location</h4>
          <button
            type="button"
            onClick={() => setEditingMilestoneId('new')}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold tracking-wide text-brand uppercase"
          >
            Add milestone
          </button>
        </div>

        {editingMilestoneId === 'new' ? (
          <div className="mt-4">
            <GlobeMilestoneEditor
              initialMilestone={emptyGlobeMilestone}
              onSave={saveMilestone}
              onCancel={() => setEditingMilestoneId(null)}
            />
          </div>
        ) : null}

        <div className="mt-4 space-y-3">
          {location.milestones.length === 0 ? (
            <p className="rounded-lg bg-surface-alt px-4 py-5 text-center text-sm text-ink-muted">No milestones yet.</p>
          ) : (
            location.milestones.map((milestone) => (
              <div key={milestone.id} className="rounded-lg border border-slate-200/80 bg-surface-alt/60 p-3">
                {editingMilestoneId === milestone.id ? (
                  <GlobeMilestoneEditor
                    initialMilestone={milestone}
                    onSave={saveMilestone}
                    onCancel={() => setEditingMilestoneId(null)}
                  />
                ) : (
                  <>
                    <p className="text-xs font-semibold text-brand uppercase">{milestone.period} · {milestone.date}</p>
                    <p className="mt-1 font-medium text-ink">{milestone.title}</p>
                    <p className="text-xs text-ink-muted">{milestone.type} · {milestone.location}</p>
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingMilestoneId(milestone.id)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold tracking-wide text-brand uppercase"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          confirmDelete({
                            title: 'Delete this milestone?',
                            message: 'This milestone will be removed from this globe location.',
                            onConfirm: () => deleteMilestone(milestone.id),
                          })
                        }
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold tracking-wide text-accent-hover uppercase"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button type="submit" className="rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase">
          Save location
        </button>
      </div>
    </form>
  )
}

export default function InTheFieldPanel() {
  const confirmDelete = useConfirmDelete()
  const { content: activity, setContent: setActivity, loading, loadError } = useDashboardSection(
    getDefaultDrWaelActivity,
    loadDrWaelActivityRemote,
  )
  const [editingId, setEditingId] = useState(null)
  const [editingGlobeLocationId, setEditingGlobeLocationId] = useState(null)
  const [savedMessage, setSavedMessage] = useState('')
  const [saveError, setSaveError] = useState('')

  const globeLocations = activity.globe?.locations ?? []

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

  const updateGlobeMeta = (field, value) => {
    setActivity((current) => ({
      ...current,
      globe: { ...current.globe, [field]: value },
    }))
  }

  const saveGlobeMeta = () => {
    persist(activity, 'Globe header saved.')
  }

  const saveGlobeLocation = (location) => {
    const locations = globeLocations
    const exists = locations.some((entry) => entry.id === location.id)
    const nextLocations = exists
      ? locations.map((entry) => (entry.id === location.id ? location : entry))
      : [location, ...locations]

    persist(
      {
        ...activity,
        globe: { ...activity.globe, locations: nextLocations },
      },
      exists ? 'Globe location updated.' : 'Globe location created.',
    )
    setEditingGlobeLocationId(null)
  }

  const deleteGlobeLocation = (id) => {
    persist(
      {
        ...activity,
        globe: {
          ...activity.globe,
          locations: globeLocations.filter((entry) => entry.id !== id),
        },
      },
      'Globe location deleted.',
    )
    if (editingGlobeLocationId === id) setEditingGlobeLocationId(null)
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
    setEditingGlobeLocationId(null)
    setSaveError('')
    setSavedMessage('Reset to default content.')
    window.setTimeout(() => setSavedMessage(''), 2500)
  }

  return (
    <PanelShell
      eyebrow="In the Field"
      title="Professional activity"
      description="Create, edit, and delete event cards and globe locations for the live In the Field page. Saves go to Supabase and update the website for all visitors."
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
                          onClick={() =>
                            confirmDelete({
                              title: 'Delete this event?',
                              message: 'This event will be permanently removed from the In the Field page.',
                              onConfirm: () => handleDeleteEvent(event.id),
                            })
                          }
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

      <section className="mt-6 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-brand/5">
        <h2 className="font-serif text-xl text-ink">Earth globe section</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Edit the interactive globe header and the countries/regions shown on the In the Field page.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClassName}>Label</label>
            <input className={fieldClassName} value={activity.globe?.label ?? ''} onChange={(e) => updateGlobeMeta('label', e.target.value)} />
          </div>
          <div>
            <label className={labelClassName}>Title</label>
            <input className={fieldClassName} value={activity.globe?.title ?? ''} onChange={(e) => updateGlobeMeta('title', e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClassName}>Description</label>
            <textarea
              className={`${fieldClassName} min-h-24 resize-y`}
              value={activity.globe?.description ?? ''}
              onChange={(e) => updateGlobeMeta('description', e.target.value)}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={saveGlobeMeta}
          className="mt-4 rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:bg-brand-light"
        >
          Save globe header
        </button>
      </section>

      <div className="mt-6">
        <DashboardItemList
          title="Globe locations"
          countLabel={`${globeLocations.length} location${globeLocations.length === 1 ? '' : 's'} on the map`}
          items={globeLocations}
          editingId={editingGlobeLocationId}
          onAdd={() => setEditingGlobeLocationId('new')}
          onEdit={setEditingGlobeLocationId}
          onDelete={deleteGlobeLocation}
          getItemId={(item) => item.id}
          addLabel="Add location"
          emptyMessage="No globe locations yet."
          renderPreview={(item) => <GlobeLocationPreview location={item} />}
          renderEditor={(item) =>
            item === 'new' ? (
              <GlobeLocationEditor
                initialLocation={emptyGlobeLocation}
                onSave={saveGlobeLocation}
                onCancel={() => setEditingGlobeLocationId(null)}
              />
            ) : (
              <GlobeLocationEditor
                key={item.id}
                initialLocation={item}
                onSave={saveGlobeLocation}
                onCancel={() => setEditingGlobeLocationId(null)}
              />
            )
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
