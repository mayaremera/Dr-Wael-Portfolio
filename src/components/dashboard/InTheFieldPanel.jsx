import { useMemo, useRef, useState } from 'react'
import DashboardItemList from './DashboardItemList'
import DashboardSaveNotice from './DashboardSaveNotice'
import EventDatePicker from './EventDatePicker'
import MediaDropzone from './MediaDropzone'
import { useConfirmDelete } from './DeleteConfirmDialog'
import {
  createActivityId,
  emptyActivityEvent,
  emptyGlobeLocation,
  emptyGlobeMilestone,
  emptyGlobeRegion,
  emptyMembershipOrg,
  getDefaultDrWaelActivity,
  loadDrWaelActivityRemote,
  MEMBERSHIP_SCOPES,
  saveDrWaelActivity,
} from '../../data/contentStore'
import { CONTENT_SECTIONS } from '../../data/contentSync'
import { useDashboardSection } from '../../hooks/useDashboardSection'
import { withCacheBust } from '../../lib/mediaUrl'
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
  const regionCount = location.regions?.length ?? 0
  const eventCount = (location.regions ?? []).reduce(
    (sum, region) => sum + (region.milestones?.length ?? 0),
    0,
  )

  return (
    <div className="flex gap-3">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-2xl ring-1 ring-slate-200/80">
        {location.flag || '🌍'}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-ink">{location.country || 'Untitled country'}</p>
        <p className="text-xs text-ink-muted">
          {regionCount} region{regionCount === 1 ? '' : 's'} · {eventCount} event{eventCount === 1 ? '' : 's'}
        </p>
        <p className="mt-1 text-xs text-ink-muted">
          {Number(location.lat).toFixed(2)}, {Number(location.lng).toFixed(2)}
        </p>
      </div>
    </div>
  )
}

function GlobeRegionEditor({ initialRegion, onSave, onCancel }) {
  const confirmDelete = useConfirmDelete()
  const [region, setRegion] = useState({
    ...emptyGlobeRegion,
    ...initialRegion,
    milestones: initialRegion.milestones ?? [],
  })
  const [editingMilestoneId, setEditingMilestoneId] = useState(null)

  const update = (field, value) => setRegion((current) => ({ ...current, [field]: value }))

  const saveMilestone = (milestone) => {
    setRegion((current) => {
      const exists = current.milestones.some((entry) => entry.id === milestone.id)
      const milestones = exists
        ? current.milestones.map((entry) => (entry.id === milestone.id ? milestone : entry))
        : [milestone, ...current.milestones]

      return { ...current, milestones }
    })
    setEditingMilestoneId(null)
  }

  const deleteMilestone = (id) => {
    setRegion((current) => ({
      ...current,
      milestones: current.milestones.filter((entry) => entry.id !== id),
    }))
    if (editingMilestoneId === id) setEditingMilestoneId(null)
  }

  const handleSubmit = () => {
    if (!region.name?.trim()) return

    setRegion((current) => {
      onSave({
        ...current,
        id: current.id || createActivityId(current.name),
      })
      return current
    })
  }

  return (
    <div className="rounded-lg border border-slate-200/80 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-sm font-semibold text-ink">{region.id ? 'Edit region' : 'New region'}</h4>
        <button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold tracking-wide text-ink-muted uppercase">
          Cancel
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClassName}>Region / city name</label>
          <input className={fieldClassName} value={region.name} onChange={(e) => update('name', e.target.value)} required />
        </div>
        <div>
          <label className={labelClassName}>Region label</label>
          <input className={fieldClassName} value={region.role} onChange={(e) => update('role', e.target.value)} placeholder="Optional short description" />
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-slate-200/80 bg-surface-alt/40 p-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold tracking-wide text-ink-muted uppercase">Events in this region</p>
          <button
            type="button"
            onClick={() => setEditingMilestoneId('new')}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold tracking-wide text-brand uppercase"
          >
            Add event
          </button>
        </div>

        {editingMilestoneId === 'new' ? (
          <div className="mt-3">
            <GlobeMilestoneEditor
              initialMilestone={emptyGlobeMilestone}
              onSave={saveMilestone}
              onCancel={() => setEditingMilestoneId(null)}
            />
          </div>
        ) : null}

        <div className="mt-3 space-y-3">
          {region.milestones.length === 0 ? (
            <p className="rounded-lg bg-white px-4 py-4 text-center text-sm text-ink-muted">No events in this region yet.</p>
          ) : (
            region.milestones.map((milestone) => (
              <div key={milestone.id} className="rounded-lg border border-slate-200/80 bg-white p-3">
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
                            title: 'Delete this event?',
                            message: 'This event will be removed from this region.',
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

      <div className="mt-4 flex gap-2">
        <button type="button" onClick={handleSubmit} className="rounded-lg bg-brand px-4 py-2 text-xs font-semibold tracking-wide text-white uppercase">
          Save region
        </button>
      </div>
      <p className="mt-2 text-xs text-ink-muted">After adding events, save the region, then save the country below.</p>
    </div>
  )
}

function GlobeLocationEditor({ initialLocation, onSave, onCancel }) {
  const confirmDelete = useConfirmDelete()
  const [location, setLocation] = useState({
    ...emptyGlobeLocation,
    ...initialLocation,
    regions: initialLocation.regions?.length ? initialLocation.regions : emptyGlobeLocation.regions,
  })
  const [editingRegionId, setEditingRegionId] = useState(null)

  const update = (field, value) => setLocation((current) => ({ ...current, [field]: value }))

  const saveRegion = (region) => {
    setLocation((current) => {
      const exists = current.regions.some((entry) => entry.id === region.id)
      const regions = exists
        ? current.regions.map((entry) => (entry.id === region.id ? region : entry))
        : [region, ...current.regions]

      return { ...current, regions }
    })
    setEditingRegionId(null)
  }

  const deleteRegion = (id) => {
    setLocation((current) => ({
      ...current,
      regions: current.regions.filter((entry) => entry.id !== id),
    }))
    if (editingRegionId === id) setEditingRegionId(null)
  }

  const handleSubmit = () => {
    onSave({
      ...location,
      id: location.id || createActivityId(location.country),
      lat: Number(location.lat),
      lng: Number(location.lng),
      regions: location.regions.filter((region) => region.name?.trim()),
    })
  }

  return (
    <div className="rounded-xl border border-brand/20 bg-brand-muted/30 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-serif text-xl text-ink">{location.id ? 'Edit globe country' : 'New globe country'}</h3>
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
          <label className={labelClassName}>Flag emoji</label>
          <input className={fieldClassName} value={location.flag} onChange={(e) => update('flag', e.target.value)} placeholder="🇸🇦" />
        </div>
        <div>
          <label className={labelClassName}>Latitude</label>
          <input className={fieldClassName} type="number" step="any" value={location.lat} onChange={(e) => update('lat', e.target.value)} required />
        </div>
        <div>
          <label className={labelClassName}>Longitude</label>
          <input className={fieldClassName} type="number" step="any" value={location.lng} onChange={(e) => update('lng', e.target.value)} required />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClassName}>Country summary</label>
          <input className={fieldClassName} value={location.role} onChange={(e) => update('role', e.target.value)} placeholder="Short description shown in the globe panel" />
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-slate-200/80 bg-white/70 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-semibold text-ink">Regions / states / cities</h4>
            <p className="mt-1 text-xs text-ink-muted">Add one region per city or state. Visitors switch between them inside the country panel.</p>
          </div>
          <button
            type="button"
            onClick={() => setEditingRegionId('new')}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold tracking-wide text-brand uppercase"
          >
            Add region
          </button>
        </div>

        {editingRegionId === 'new' ? (
          <div className="mt-4">
            <GlobeRegionEditor
              initialRegion={emptyGlobeRegion}
              onSave={saveRegion}
              onCancel={() => setEditingRegionId(null)}
            />
          </div>
        ) : null}

        <div className="mt-4 space-y-3">
          {location.regions.length === 0 ? (
            <p className="rounded-lg bg-surface-alt px-4 py-5 text-center text-sm text-ink-muted">Add at least one region for this country.</p>
          ) : (
            location.regions.map((region) => (
              <div key={region.id} className="rounded-lg border border-slate-200/80 bg-surface-alt/60 p-3">
                {editingRegionId === region.id ? (
                  <GlobeRegionEditor
                    initialRegion={region}
                    onSave={saveRegion}
                    onCancel={() => setEditingRegionId(null)}
                  />
                ) : (
                  <>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-ink">{region.name || 'Untitled region'}</p>
                        {region.role ? <p className="mt-1 text-xs text-ink-muted">{region.role}</p> : null}
                        <p className="mt-1 text-xs text-ink-muted">
                          {region.milestones?.length ?? 0} event{(region.milestones?.length ?? 0) === 1 ? '' : 's'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingRegionId(region.id)}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold tracking-wide text-brand uppercase"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            confirmDelete({
                              title: 'Delete this region?',
                              message: 'This region and all of its events will be removed from the globe country.',
                              onConfirm: () => deleteRegion(region.id),
                            })
                          }
                          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold tracking-wide text-accent-hover uppercase"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button type="button" onClick={handleSubmit} className="rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase">
          Save country
        </button>
      </div>
    </div>
  )
}

function GlobeMilestoneEditor({ initialMilestone, onSave, onCancel }) {
  const [milestone, setMilestone] = useState({ ...emptyGlobeMilestone, ...initialMilestone })
  const update = (field, value) => setMilestone((current) => ({ ...current, [field]: value }))

  const handleSave = () => {
    if (!milestone.period?.trim() || !milestone.date?.trim() || !milestone.type?.trim() || !milestone.title?.trim() || !milestone.location?.trim()) {
      return
    }

    onSave({
      ...milestone,
      id: milestone.id || createActivityId(milestone.title),
      isMilestone: true,
    })
  }

  return (
    <div className="rounded-lg border border-slate-200/80 bg-white p-4">
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
          <textarea className={`${fieldClassName} min-h-20 resize-y`} value={milestone.note} onChange={(e) => update('note', e.target.value)} placeholder="Optional" />
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={handleSave} className="rounded-lg bg-brand px-4 py-2 text-xs font-semibold tracking-wide text-white uppercase">
          Save event
        </button>
        <button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold tracking-wide text-ink-muted uppercase">
          Cancel
        </button>
      </div>
    </div>
  )
}

function MembershipOrgPreview({ org }) {
  return (
    <div>
      <p className="text-sm font-semibold text-ink">{org.abbr || '—'}</p>
      <p className="mt-1 font-medium text-ink">{org.name || 'Untitled organization'}</p>
      <p className="mt-1 text-xs text-ink-muted">{org.scope || 'International'}</p>
    </div>
  )
}

function toggleHomepageSlot(selectedIds, eventId, slotIndex) {
  const next = [0, 1, 2].map((index) => selectedIds?.[index] ?? '')

  if (next[slotIndex] === eventId) {
    next[slotIndex] = ''
    return next
  }

  for (let index = 0; index < 3; index += 1) {
    if (next[index] === eventId) next[index] = ''
  }

  next[slotIndex] = eventId
  return next
}

function HomepageSlotCheckboxes({ eventId, selectedIds, onToggle }) {
  const slots = [
    { index: 0, label: 'Left' },
    { index: 1, label: 'Middle' },
    { index: 2, label: 'Right' },
  ]
  const normalizedIds = [0, 1, 2].map((index) => selectedIds?.[index] ?? '')

  return (
    <div className="mt-4 rounded-lg border border-slate-200/80 bg-white p-3">
      <p className="text-[0.65rem] font-semibold tracking-wide text-ink-muted uppercase">Show on homepage</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {slots.map((slot) => {
          const checked = normalizedIds[slot.index] === eventId

          return (
            <label
              key={slot.label}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                checked
                  ? 'border-brand bg-brand-muted/50 text-brand'
                  : 'border-slate-200 bg-white text-ink-muted hover:border-brand/25 hover:text-brand'
              }`}
            >
              <input
                type="checkbox"
                className="h-3.5 w-3.5 rounded border-slate-300 text-brand focus:ring-brand/30"
                checked={checked}
                onChange={() => onToggle(eventId, slot.index)}
              />
              {slot.label}
            </label>
          )
        })}
      </div>
    </div>
  )
}

function MembershipOrgEditor({ initialOrg, onSave, onCancel }) {
  const [org, setOrg] = useState({ ...emptyMembershipOrg, ...initialOrg })
  const update = (field, value) => setOrg((current) => ({ ...current, [field]: value }))

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSave({ ...org, id: org.id || createActivityId(org.abbr || org.name) })
      }}
      className="rounded-xl border border-brand/20 bg-brand-muted/30 p-5 shadow-sm"
    >
      <h3 className="font-serif text-xl text-ink">{org.id ? 'Edit membership' : 'New membership'}</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClassName}>Abbreviation</label>
          <input
            className={fieldClassName}
            value={org.abbr}
            onChange={(e) => update('abbr', e.target.value)}
            placeholder="ASHA"
            required
          />
        </div>
        <div>
          <label className={labelClassName}>Scope</label>
          <select className={fieldClassName} value={org.scope} onChange={(e) => update('scope', e.target.value)} required>
            {MEMBERSHIP_SCOPES.map((scope) => (
              <option key={scope} value={scope}>
                {scope}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={labelClassName}>Organization name</label>
          <input
            className={fieldClassName}
            value={org.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="American Speech-Language-Hearing Association"
            required
          />
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:bg-brand-light"
        >
          Save
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
  const confirmDelete = useConfirmDelete()
  const { content: activity, setContent: setActivity, loading, loadError } = useDashboardSection(
    getDefaultDrWaelActivity,
    loadDrWaelActivityRemote,
    CONTENT_SECTIONS.ACTIVITY,
  )
  const [editingId, setEditingId] = useState(null)
  const [editingGlobeLocationId, setEditingGlobeLocationId] = useState(null)
  const [editingMembershipOrgId, setEditingMembershipOrgId] = useState(null)
  const [savedMessage, setSavedMessage] = useState('')
  const [saveError, setSaveError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const activityRef = useRef(activity)
  activityRef.current = activity

  const globeLocations = activity?.globe?.locations ?? []
  const membershipOrganizations = activity?.professionalMembership?.organizations ?? []

  const allEvents = useMemo(
    () => [
      ...(activity?.upcoming ?? []).map((event) => ({ ...event, status: 'upcoming' })),
      ...(activity?.recent ?? []).map((event) => ({ ...event, status: 'recent' })),
    ],
    [activity],
  )

  const persist = (nextActivity, message = 'Changes saved.', previousContent = null) => {
    void persistDashboardSection({
      saveFn: saveDrWaelActivity,
      nextContent: nextActivity,
      previousContent,
      setContent: setActivity,
      setSaveError,
      setSavedMessage,
      setIsSaving,
      message,
      storageErrorMessage: 'Could not save changes.',
    })
  }

  const persistFromCurrent = (buildNextActivity, message) => {
    const current = activityRef.current
    if (!current) {
      setSaveError('Content is still loading. Try again in a moment.')
      return
    }

    const nextActivity = buildNextActivity(current)
    persist(nextActivity, message, current)
  }

  const normalizeEventMedia = (event) => ({
    ...event,
    image: event.image ? withCacheBust(event.image) : '',
    video: event.video ? withCacheBust(event.video) : '',
  })

  const updateMeta = (field, value) => {
    setActivity((current) => ({ ...current, [field]: value }))
  }

  const saveMeta = () => {
    persistFromCurrent((current) => current, 'Section header saved.')
  }

  const handleHomepageSlotToggle = (eventId, slotIndex) => {
    persistFromCurrent(
      (current) => ({
        ...current,
        homepageFeaturedIds: toggleHomepageSlot(current.homepageFeaturedIds, eventId, slotIndex),
      }),
      'Homepage cards updated.',
    )
  }

  const updateGlobeMeta = (field, value) => {
    setActivity((current) => ({
      ...current,
      globe: { ...current.globe, [field]: value },
    }))
  }

  const saveGlobeMeta = () => {
    persistFromCurrent((current) => current, 'Globe header saved.')
  }

  const saveGlobeLocation = (location) => {
    const exists = (activityRef.current?.globe?.locations ?? []).some((entry) => entry.id === location.id)

    persistFromCurrent((current) => {
      const locations = current.globe?.locations ?? []
      const nextLocations = exists
        ? locations.map((entry) => (entry.id === location.id ? location : entry))
        : [location, ...locations]

      return {
        ...current,
        globe: { ...current.globe, locations: nextLocations },
      }
    }, exists ? 'Globe country updated.' : 'Globe country created.')

    setEditingGlobeLocationId(null)
  }

  const deleteGlobeLocation = (id) => {
    persistFromCurrent(
      (current) => ({
        ...current,
        globe: {
          ...current.globe,
          locations: (current.globe?.locations ?? []).filter((entry) => entry.id !== id),
        },
      }),
      'Globe country deleted.',
    )
    if (editingGlobeLocationId === id) setEditingGlobeLocationId(null)
  }

  const handleSaveEvent = (event, status) => {
    const normalizedEvent = normalizeEventMedia(event)
    const current = activityRef.current

    if (!current) {
      setSaveError('Content is still loading. Try again in a moment.')
      return
    }

    const sourceStatus = normalizedEvent.id ? getEventStatus(current, normalizedEvent.id) : null
    const exists = Boolean(sourceStatus)
    const message =
      exists && sourceStatus !== status
        ? 'Event moved and saved.'
        : exists
          ? 'Event updated.'
          : 'Event created.'

    persistFromCurrent((currentActivity) => {
      let nextUpcoming = (currentActivity.upcoming ?? []).filter((item) => item.id !== normalizedEvent.id)
      let nextRecent = (currentActivity.recent ?? []).filter((item) => item.id !== normalizedEvent.id)

      if (status === 'upcoming') {
        nextUpcoming = [normalizedEvent, ...nextUpcoming]
      } else {
        nextRecent = [normalizedEvent, ...nextRecent]
      }

      return { ...currentActivity, upcoming: nextUpcoming, recent: nextRecent }
    }, message)

    setEditingId(null)
  }

  const handleDeleteEvent = (eventId) => {
    persistFromCurrent(
      (current) => ({
        ...current,
        upcoming: (current.upcoming ?? []).filter((item) => item.id !== eventId),
        recent: (current.recent ?? []).filter((item) => item.id !== eventId),
        homepageFeaturedIds: (current.homepageFeaturedIds ?? ['', '', '']).map((id) =>
          id === eventId ? '' : id,
        ),
      }),
      'Event deleted.',
    )
    if (editingId === eventId) setEditingId(null)
  }

  const updateMembershipMeta = (field, value) => {
    setActivity((current) => ({
      ...current,
      professionalMembership: { ...current.professionalMembership, [field]: value },
    }))
  }

  const saveMembershipMeta = () => {
    persistFromCurrent((current) => current, 'Professional membership saved.')
  }

  const updateAcademicClinicalPresence = (field, value) => {
    setActivity((current) => ({
      ...current,
      academicClinicalPresence: {
        ...current.academicClinicalPresence,
        [field]: value,
      },
    }))
  }

  const saveAcademicClinicalPresence = () => {
    persistFromCurrent((current) => current, 'Academic & Clinical Presence section saved.')
  }

  const saveMembershipOrg = (org) => {
    const exists = (activityRef.current?.professionalMembership?.organizations ?? []).some(
      (entry) => entry.id === org.id,
    )

    persistFromCurrent((current) => {
      const organizations = current.professionalMembership?.organizations ?? []
      const nextOrganizations = exists
        ? organizations.map((entry) => (entry.id === org.id ? org : entry))
        : [org, ...organizations]

      return {
        ...current,
        professionalMembership: {
          ...current.professionalMembership,
          organizations: nextOrganizations,
        },
      }
    }, exists ? 'Membership updated.' : 'Membership created.')

    setEditingMembershipOrgId(null)
  }

  const deleteMembershipOrg = (id) => {
    persistFromCurrent(
      (current) => ({
        ...current,
        professionalMembership: {
          ...current.professionalMembership,
          organizations: (current.professionalMembership?.organizations ?? []).filter(
            (entry) => entry.id !== id,
          ),
        },
      }),
      'Membership deleted.',
    )
    if (editingMembershipOrgId === id) setEditingMembershipOrgId(null)
  }

  return (
    <PanelShell
      eyebrow="In the Field"
      title="Professional activity"
      description="Sections are listed in the same order they appear on the live In the Field page."
    >
      <DashboardSaveNotice message={savedMessage} error={saveError} saving={isSaving} />
      <DashboardSectionLoader loading={loading} loadError={loadError} />
      {!loading && !loadError && activity ? (
        <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <a
          href="/in-the-field"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-brand transition-colors hover:text-brand-light"
        >
          Preview live page →
        </a>
      </div>

      <section className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-brand/5">
        <p className="text-[0.65rem] font-semibold tracking-wide text-brand uppercase">1 · Top of page</p>
        <h2 className="mt-1 font-serif text-xl text-ink">Earth globe</h2>
        <p className="mt-1 text-sm text-ink-muted">
          The interactive globe at the top of the page — header text and countries on the map.
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
          Save changes
        </button>
      </section>

      <div className="mt-6">
        <DashboardItemList
          title="Globe countries"
          countLabel={`${globeLocations.length} countr${globeLocations.length === 1 ? 'y' : 'ies'} on the map`}
          items={globeLocations}
          editingId={editingGlobeLocationId}
          onAdd={() => setEditingGlobeLocationId('new')}
          onEdit={setEditingGlobeLocationId}
          onDelete={deleteGlobeLocation}
          getItemId={(item) => item.id}
          addLabel="Add country"
          emptyMessage="No globe countries yet."
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

      <section className="mt-6 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-brand/5">
        <p className="text-[0.65rem] font-semibold tracking-wide text-brand uppercase">2 · Events timeline</p>
        <h2 className="mt-1 font-serif text-xl text-ink">Dr. Wael&apos;s month &amp; year</h2>
        <p className="mt-1 text-sm text-ink-muted">
          The events section below the globe — section header and upcoming/recent event cards.
        </p>
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
          Save changes
        </button>
      </section>

      <div className="mt-6">
        <p className="mb-3 text-sm leading-relaxed text-ink-muted">
          Use the Left, Middle, and Right checkboxes on each event to choose the three cards shown on the homepage.
          If none are selected, the three most recently added events appear automatically.
        </p>
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
                      <HomepageSlotCheckboxes
                        eventId={event.id}
                        selectedIds={activity.homepageFeaturedIds}
                        onToggle={handleHomepageSlotToggle}
                      />
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
        <p className="text-[0.65rem] font-semibold tracking-wide text-brand uppercase">3 · Memberships</p>
        <h2 className="mt-1 font-serif text-xl text-ink">Professional membership</h2>
        <p className="mt-1 text-sm text-ink-muted">
          The membership grid below the events timeline — section header and organization cards.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClassName}>Label</label>
            <input
              className={fieldClassName}
              value={activity.professionalMembership?.label ?? ''}
              onChange={(e) => updateMembershipMeta('label', e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClassName}>Title</label>
            <input
              className={fieldClassName}
              value={activity.professionalMembership?.title ?? ''}
              onChange={(e) => updateMembershipMeta('title', e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClassName}>Introduction</label>
            <textarea
              className={`${fieldClassName} min-h-24 resize-y`}
              value={activity.professionalMembership?.intro ?? ''}
              onChange={(e) => updateMembershipMeta('intro', e.target.value)}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={saveMembershipMeta}
          className="mt-4 rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:bg-brand-light"
        >
          Save changes
        </button>
      </section>

      <div className="mt-6">
        <DashboardItemList
          title="Organizations"
          countLabel={`${membershipOrganizations.length} membership${membershipOrganizations.length === 1 ? '' : 's'}`}
          items={membershipOrganizations}
          editingId={editingMembershipOrgId}
          onAdd={() => setEditingMembershipOrgId('new')}
          onEdit={setEditingMembershipOrgId}
          onDelete={deleteMembershipOrg}
          getItemId={(item) => item.id}
          addLabel="Add organization"
          emptyMessage="No memberships yet."
          renderPreview={(item) => <MembershipOrgPreview org={item} />}
          renderEditor={(item) =>
            item === 'new' ? (
              <MembershipOrgEditor
                initialOrg={emptyMembershipOrg}
                onSave={saveMembershipOrg}
                onCancel={() => setEditingMembershipOrgId(null)}
              />
            ) : (
              <MembershipOrgEditor
                key={item.id}
                initialOrg={item}
                onSave={saveMembershipOrg}
                onCancel={() => setEditingMembershipOrgId(null)}
              />
            )
          }
        />
      </div>

      <section className="mt-6 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-brand/5">
        <p className="text-[0.65rem] font-semibold tracking-wide text-brand uppercase">4 · Closing band</p>
        <h2 className="mt-1 font-serif text-xl text-ink">Academic &amp; Clinical Presence</h2>
        <p className="mt-1 text-sm text-ink-muted">
          The call-to-action band at the bottom of the In the Field page.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClassName}>Label</label>
            <input
              className={fieldClassName}
              value={activity.academicClinicalPresence?.label ?? ''}
              onChange={(e) => updateAcademicClinicalPresence('label', e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClassName}>Title</label>
            <input
              className={fieldClassName}
              value={activity.academicClinicalPresence?.title ?? ''}
              onChange={(e) => updateAcademicClinicalPresence('title', e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClassName}>Description</label>
            <textarea
              className={`${fieldClassName} min-h-24 resize-y`}
              value={activity.academicClinicalPresence?.description ?? ''}
              onChange={(e) => updateAcademicClinicalPresence('description', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClassName}>Primary button label</label>
            <input
              className={fieldClassName}
              value={activity.academicClinicalPresence?.primaryLabel ?? ''}
              onChange={(e) => updateAcademicClinicalPresence('primaryLabel', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClassName}>Secondary button label</label>
            <input
              className={fieldClassName}
              value={activity.academicClinicalPresence?.secondaryLabel ?? ''}
              onChange={(e) => updateAcademicClinicalPresence('secondaryLabel', e.target.value)}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={saveAcademicClinicalPresence}
          className="mt-4 rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:bg-brand-light"
        >
          Save changes
        </button>
      </section>
        </>
      ) : null}
    </PanelShell>
  )
}
