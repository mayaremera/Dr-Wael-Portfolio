import { useState } from 'react'
import DashboardItemList from './DashboardItemList'
import MediaDropzone from './MediaDropzone'
import { useConfirmDelete } from './DeleteConfirmDialog'
import {
  createContentId,
  emptyAffiliation,
  emptyCredentialWheelItem,
  getDefaultHomeContent,
  loadHomeContentRemote,
  saveHomeContent,
} from '../../data/homeContentStore'
import { useDashboardSection } from '../../hooks/useDashboardSection'
import DashboardSectionLoader from './DashboardSectionLoader'
import { persistDashboardSection } from './persistDashboardSection'
import { withCacheBust } from '../../lib/mediaUrl'

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

function StringListEditor({ label, items, onChange, addLabel = 'Add paragraph' }) {
  const confirmDelete = useConfirmDelete()

  return (
    <div>
      <label className={labelClassName}>{label}</label>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={`${label}-${index}`} className="flex gap-2">
            <textarea
              className={`${fieldClassName} min-h-20 resize-y`}
              value={item}
              onChange={(e) => onChange(items.map((entry, i) => (i === index ? e.target.value : entry)))}
            />
            <button
              type="button"
              onClick={() =>
                confirmDelete({
                  title: 'Remove this paragraph?',
                  message: 'This paragraph will be removed from the list.',
                  confirmLabel: 'Remove',
                  onConfirm: () => onChange(items.filter((_, i) => i !== index)),
                })
              }
              className="shrink-0 self-start rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-semibold tracking-wide text-accent-hover uppercase"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...items, ''])}
        className="mt-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold tracking-wide text-brand uppercase"
      >
        {addLabel}
      </button>
    </div>
  )
}

function CtaFields({ label, cta, onChange }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-ink">{label}</p>
      <div>
        <label className={labelClassName}>Button label</label>
        <input className={fieldClassName} value={cta.label} onChange={(e) => onChange({ ...cta, label: e.target.value })} />
      </div>
    </div>
  )
}

function AffiliationEditor({ initialItem, onSave, onCancel }) {
  const [item, setItem] = useState({ ...emptyAffiliation, ...initialItem })
  const update = (field, value) => setItem((current) => ({ ...current, [field]: value }))

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSave({ ...item, id: item.id || createContentId(item.shortName || item.name) })
      }}
      className="rounded-xl border border-brand/20 bg-brand-muted/30 p-5"
    >
      <h3 className="font-serif text-xl text-ink">{item.id ? 'Edit affiliation' : 'New affiliation'}</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClassName}>Short name</label>
          <input className={fieldClassName} value={item.shortName} onChange={(e) => update('shortName', e.target.value)} required />
        </div>
        <div>
          <label className={labelClassName}>Logo fit</label>
          <select className={fieldClassName} value={item.logoFit || ''} onChange={(e) => update('logoFit', e.target.value)}>
            <option value="">Contain (default)</option>
            <option value="cover">Cover</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={labelClassName}>Full name</label>
          <input className={fieldClassName} value={item.name} onChange={(e) => update('name', e.target.value)} required />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClassName}>Role / description</label>
          <textarea className={`${fieldClassName} min-h-24 resize-y`} value={item.role} onChange={(e) => update('role', e.target.value)} required />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClassName}>Logo</label>
          <MediaDropzone image={item.logo} video="" onChange={({ image }) => update('logo', image)} onClear={() => update('logo', '')} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClassName}>Badge logo (optional)</label>
          <MediaDropzone image={item.badgeLogo || ''} video="" onChange={({ image }) => update('badgeLogo', image)} onClear={() => update('badgeLogo', '')} />
        </div>
        {item.badgeLogo ? (
          <div className="sm:col-span-2">
            <label className={labelClassName}>Dual logo layout</label>
            <select className={fieldClassName} value={item.logoLayout || 'split'} onChange={(e) => update('logoLayout', e.target.value)}>
              <option value="split">Side by side (50 / 50)</option>
              <option value="badge">Corner badge overlay</option>
            </select>
          </div>
        ) : null}
        <div className="sm:col-span-2">
          <label className={labelClassName}>Badge label (optional)</label>
          <input className={fieldClassName} value={item.badgeLabel || ''} onChange={(e) => update('badgeLabel', e.target.value)} />
        </div>
      </div>
      <div className="mt-4 flex gap-3">
        <button type="submit" className="rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase">
          Save
        </button>
        <button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 px-5 py-2.5 text-xs font-semibold tracking-wide text-ink-muted uppercase">
          Cancel
        </button>
      </div>
    </form>
  )
}

function AffiliationPreview({ item }) {
  const showSplit = item.badgeLogo && (item.logoLayout || 'split') === 'split'

  return (
    <div className="flex gap-3">
      <div
        className={`h-14 shrink-0 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200/80 ${
          showSplit ? 'flex w-24' : 'w-14'
        }`}
      >
        {showSplit ? (
          <>
            <div className="flex w-[54%] items-center justify-center bg-white p-1">
              <img src={item.badgeLogo} alt="" className="max-h-full max-w-full object-contain" />
            </div>
            <div
              className="relative flex-1 overflow-hidden bg-[#1a3a7a]"
              style={{ clipPath: 'polygon(14% 0, 100% 0, 100% 100%, 0 100%)' }}
            >
              {item.logo ? (
                <img src={item.logo} alt="" className="h-full w-full object-cover object-center" />
              ) : (
                <div className="flex h-full items-center justify-center text-[0.55rem] text-white/70">Logo</div>
              )}
            </div>
          </>
        ) : item.logo ? (
          <img src={item.logo} alt="" className="h-full w-full object-contain p-1" />
        ) : (
          <div className="flex h-full items-center justify-center text-[0.6rem] text-ink-muted">No logo</div>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink">{item.shortName}</p>
        <p className="line-clamp-2 text-xs text-ink-muted">{item.name}</p>
      </div>
    </div>
  )
}

function CredentialWheelItemPreview({ item }) {
  return (
    <div>
      <p className="text-sm font-semibold text-ink">{item.short || 'Untitled point'}</p>
      <p className="mt-1 text-xs font-medium text-brand">{item.title}</p>
      <p className="mt-1 line-clamp-2 text-xs text-ink-muted">{item.detail}</p>
    </div>
  )
}

function CredentialWheelItemEditor({ initialItem, onSave, onCancel }) {
  const [item, setItem] = useState({ ...emptyCredentialWheelItem, ...initialItem })
  const update = (field, value) => setItem((current) => ({ ...current, [field]: value }))

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSave({ ...item, id: item.id || createContentId(item.short || item.title) })
      }}
      className="rounded-xl border border-brand/20 bg-brand-muted/30 p-5"
    >
      <h3 className="font-serif text-xl text-ink">{item.id ? 'Edit credential point' : 'New credential point'}</h3>
      <p className="mt-1 text-sm text-ink-muted">
        Ring label is the short text on the wheel. Title and detail appear in the center when selected.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClassName}>Ring label</label>
          <input className={fieldClassName} value={item.short} onChange={(e) => update('short', e.target.value)} placeholder="30+ Years" required />
        </div>
        <div>
          <label className={labelClassName}>Center title</label>
          <input className={fieldClassName} value={item.title} onChange={(e) => update('title', e.target.value)} placeholder="30+ Years" required />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClassName}>Detail text</label>
          <textarea className={`${fieldClassName} min-h-24 resize-y`} value={item.detail} onChange={(e) => update('detail', e.target.value)} required />
        </div>
      </div>
      <div className="mt-4 flex gap-3">
        <button type="submit" className="rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase">
          Save
        </button>
        <button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 px-5 py-2.5 text-xs font-semibold tracking-wide text-ink-muted uppercase">
          Cancel
        </button>
      </div>
    </form>
  )
}

export default function HomePagePanel() {
  const { content, setContent, loading, loadError } = useDashboardSection(
    getDefaultHomeContent,
    loadHomeContentRemote,
  )
  const [editingAffiliationId, setEditingAffiliationId] = useState(null)
  const [editingCredentialWheelItemId, setEditingCredentialWheelItemId] = useState(null)
  const [savedMessage, setSavedMessage] = useState('')
  const [saveError, setSaveError] = useState('')

  const persist = (nextContent, message = 'Changes saved.') => {
    persistDashboardSection({
      saveFn: saveHomeContent,
      nextContent,
      setContent,
      setSaveError,
      setSavedMessage,
      message,
      storageErrorMessage: 'Could not save changes.',
    })
  }

  const updateHero = (field, value) => {
    setContent((current) => ({
      ...current,
      hero: { ...current.hero, [field]: value },
    }))
  }

  const updateAffiliations = (field, value) => {
    setContent((current) => ({
      ...current,
      affiliations: { ...current.affiliations, [field]: value },
    }))
  }

  const updateWhyChoose = (field, value) => {
    setContent((current) => ({
      ...current,
      whyChooseUs: { ...current.whyChooseUs, [field]: value },
    }))
  }

  const saveWhyTrust = (nextContent = content, message = 'Why Trust section saved.') => {
    persist(nextContent, message)
  }

  const updateWhyTrustImage = (image, { autoSave = false } = {}) => {
    const nextImage = image ? withCacheBust(image) : ''

    setContent((current) => {
      const nextContent = {
        ...current,
        whyChooseUs: { ...current.whyChooseUs, image: nextImage },
      }

      if (autoSave) {
        persistDashboardSection({
          saveFn: saveHomeContent,
          nextContent,
          setContent,
          setSaveError,
          setSavedMessage,
          message: 'Why Trust image saved.',
        })
      }

      return nextContent
    })
  }

  const updatePromoVideo = (field, value) => {
    setContent((current) => ({
      ...current,
      promoVideo: { ...current.promoVideo, [field]: value },
    }))
  }

  const updateCredentialWheel = (field, value) => {
    setContent((current) => ({
      ...current,
      credentialWheel: { ...current.credentialWheel, [field]: value },
    }))
  }

  const saveAffiliation = (item) => {
    const companies = content.affiliations.companies
    const exists = companies.some((entry) => entry.id === item.id)
    const nextCompanies = exists
      ? companies.map((entry) => (entry.id === item.id ? item : entry))
      : [item, ...companies]

    persist(
      {
        ...content,
        affiliations: { ...content.affiliations, companies: nextCompanies },
      },
      exists ? 'Affiliation updated.' : 'Affiliation created.',
    )
    setEditingAffiliationId(null)
  }

  const deleteAffiliation = (id) => {
    persist(
      {
        ...content,
        affiliations: {
          ...content.affiliations,
          companies: content.affiliations.companies.filter((entry) => entry.id !== id),
        },
      },
      'Affiliation deleted.',
    )
    if (editingAffiliationId === id) setEditingAffiliationId(null)
  }

  const saveCredentialWheelItem = (item) => {
    const items = content.credentialWheel?.items ?? []
    const exists = items.some((entry) => entry.id === item.id)
    const nextItems = exists
      ? items.map((entry) => (entry.id === item.id ? item : entry))
      : [item, ...items]

    persist(
      {
        ...content,
        credentialWheel: { ...content.credentialWheel, items: nextItems },
      },
      exists ? 'Credential point updated.' : 'Credential point created.',
    )
    setEditingCredentialWheelItemId(null)
  }

  const deleteCredentialWheelItem = (id) => {
    persist(
      {
        ...content,
        credentialWheel: {
          ...content.credentialWheel,
          items: (content.credentialWheel?.items ?? []).filter((entry) => entry.id !== id),
        },
      },
      'Credential point deleted.',
    )
    if (editingCredentialWheelItemId === id) setEditingCredentialWheelItemId(null)
  }

  const saveAll = () => persist(content)

  return (
    <PanelShell
      eyebrow="Home Page"
      title="Home page content"
      description="Edit the hero banner, affiliations, Why Trust section, and video sections shown on the live home page."
    >
      <DashboardSectionLoader loading={loading} loadError={loadError} />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <a href="/" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-brand transition-colors hover:text-brand-light">
          Preview live page →
        </a>
        <div className="flex flex-wrap items-center gap-2">
          {saveError ? <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent-hover">{saveError}</span> : null}
          {savedMessage ? <span className="rounded-full bg-brand-muted px-3 py-1 text-xs font-semibold text-brand">{savedMessage}</span> : null}
        </div>
      </div>

      <section className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-brand/5">
        <h2 className="font-serif text-xl text-ink">Hero section</h2>
        <p className="mt-1 text-sm text-ink-muted">The top banner with background image, headline, and call-to-action buttons.</p>
        <div className="mt-4 grid gap-4">
          <div>
            <label className={labelClassName}>Background image</label>
            <MediaDropzone
              image={content.hero.backgroundImage}
              video=""
              onChange={({ image }) => updateHero('backgroundImage', image)}
              onClear={() => updateHero('backgroundImage', '')}
            />
          </div>
          <div>
            <label className={labelClassName}>Professional title</label>
            <input className={fieldClassName} value={content.hero.subtitle} onChange={(e) => updateHero('subtitle', e.target.value)} />
          </div>
          <div>
            <label className={labelClassName}>Name</label>
            <input className={fieldClassName} value={content.hero.name} onChange={(e) => updateHero('name', e.target.value)} />
          </div>
          <div>
            <label className={labelClassName}>Description</label>
            <textarea className={`${fieldClassName} min-h-28 resize-y`} value={content.hero.description} onChange={(e) => updateHero('description', e.target.value)} />
          </div>
          <CtaFields
            label="Primary button"
            cta={content.hero.primaryCta}
            onChange={(cta) => updateHero('primaryCta', cta)}
          />
          <CtaFields
            label="Secondary button"
            cta={content.hero.secondaryCta}
            onChange={(cta) => updateHero('secondaryCta', cta)}
          />
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-brand/5">
        <h2 className="font-serif text-xl text-ink">Credentials wheel</h2>
        <p className="mt-1 text-sm text-ink-muted">
          The interactive compass in the About section on the home page. Each point is a credential highlight on the ring.
        </p>
        <div className="mt-4">
          <label className={labelClassName}>Tagline</label>
          <input
            className={fieldClassName}
            value={content.credentialWheel?.tagline ?? ''}
            onChange={(e) => updateCredentialWheel('tagline', e.target.value)}
          />
        </div>
        <div className="mt-6">
          <DashboardItemList
            title="Wheel points"
            countLabel={`${content.credentialWheel?.items?.length ?? 0} point${content.credentialWheel?.items?.length === 1 ? '' : 's'}`}
            items={content.credentialWheel?.items ?? []}
            editingId={editingCredentialWheelItemId}
            onAdd={() => setEditingCredentialWheelItemId('new')}
            onEdit={setEditingCredentialWheelItemId}
            onDelete={deleteCredentialWheelItem}
            getItemId={(item) => item.id}
            addLabel="Add point"
            emptyMessage="No credential points yet."
            renderPreview={(item) => <CredentialWheelItemPreview item={item} />}
            renderEditor={(item) =>
              item === 'new' ? (
                <CredentialWheelItemEditor
                  initialItem={emptyCredentialWheelItem}
                  onSave={saveCredentialWheelItem}
                  onCancel={() => setEditingCredentialWheelItemId(null)}
                />
              ) : (
                <CredentialWheelItemEditor
                  key={item.id}
                  initialItem={item}
                  onSave={saveCredentialWheelItem}
                  onCancel={() => setEditingCredentialWheelItemId(null)}
                />
              )
            }
          />
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-brand/5">
        <h2 className="font-serif text-xl text-ink">Affiliations section</h2>
        <p className="mt-1 text-sm text-ink-muted">Trusted organizations and certifications shown below the profile on the home page.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClassName}>Section title</label>
            <input className={fieldClassName} value={content.affiliations.title} onChange={(e) => updateAffiliations('title', e.target.value)} />
          </div>
          <div>
            <label className={labelClassName}>View all link label</label>
            <input className={fieldClassName} value={content.affiliations.viewAllLabel} onChange={(e) => updateAffiliations('viewAllLabel', e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClassName}>Subtitle</label>
            <textarea className={`${fieldClassName} min-h-20 resize-y`} value={content.affiliations.subtitle} onChange={(e) => updateAffiliations('subtitle', e.target.value)} />
          </div>
        </div>
        <div className="mt-6">
          <DashboardItemList
            title="Affiliation logos"
            countLabel={`${content.affiliations.companies.length} affiliation${content.affiliations.companies.length === 1 ? '' : 's'}`}
            items={content.affiliations.companies}
            editingId={editingAffiliationId}
            onAdd={() => setEditingAffiliationId('new')}
            onEdit={setEditingAffiliationId}
            onDelete={deleteAffiliation}
            getItemId={(item) => item.id}
            addLabel="Add affiliation"
            emptyMessage="No affiliations yet."
            renderPreview={(item) => <AffiliationPreview item={item} />}
            renderEditor={(item) =>
              item === 'new' ? (
                <AffiliationEditor
                  initialItem={emptyAffiliation}
                  onSave={saveAffiliation}
                  onCancel={() => setEditingAffiliationId(null)}
                />
              ) : (
                <AffiliationEditor
                  key={item.id}
                  initialItem={item}
                  onSave={saveAffiliation}
                  onCancel={() => setEditingAffiliationId(null)}
                />
              )
            }
          />
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-brand/5">
        <h2 className="font-serif text-xl text-ink">Why Trust</h2>
        <p className="mt-1 text-sm text-ink-muted">The Why Trust section with image and supporting paragraphs.</p>
        <div className="mt-4 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClassName}>Eyebrow label</label>
              <input className={fieldClassName} value={content.whyChooseUs.label} onChange={(e) => updateWhyChoose('label', e.target.value)} />
            </div>
            <div>
              <label className={labelClassName}>Section title</label>
              <input className={fieldClassName} value={content.whyChooseUs.title} onChange={(e) => updateWhyChoose('title', e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelClassName}>Side image</label>
            <MediaDropzone
              image={content.whyChooseUs.image}
              video=""
              onChange={({ image }) => updateWhyTrustImage(image)}
              onUploaded={({ image }) => updateWhyTrustImage(image, { autoSave: true })}
              onClear={() => {
                const nextContent = {
                  ...content,
                  whyChooseUs: { ...content.whyChooseUs, image: '' },
                }
                setContent(nextContent)
                saveWhyTrust(nextContent, 'Why Trust image removed.')
              }}
            />
          </div>
          <StringListEditor
            label="Paragraphs"
            items={content.whyChooseUs.paragraphs}
            onChange={(paragraphs) => updateWhyChoose('paragraphs', paragraphs)}
          />
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => saveWhyTrust()}
              className="rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:bg-brand-light"
            >
              Save changes
            </button>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-brand/5">
        <h2 className="font-serif text-xl text-ink">Featured video section</h2>
        <p className="mt-1 text-sm text-ink-muted">The background video banner with overlay text on the home page.</p>
        <div className="mt-4 grid gap-4">
          <div>
            <label className={labelClassName}>Background video</label>
            <MediaDropzone
              image=""
              video={content.promoVideo.src}
              onChange={({ video }) => updatePromoVideo('src', video)}
              onClear={() => updatePromoVideo('src', '')}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClassName}>Eyebrow label</label>
              <input className={fieldClassName} value={content.promoVideo.label} onChange={(e) => updatePromoVideo('label', e.target.value)} />
            </div>
            <div>
              <label className={labelClassName}>Headline</label>
              <input className={fieldClassName} value={content.promoVideo.titleHighlight} onChange={(e) => updatePromoVideo('titleHighlight', e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelClassName}>Description</label>
            <textarea className={`${fieldClassName} min-h-24 resize-y`} value={content.promoVideo.description} onChange={(e) => updatePromoVideo('description', e.target.value)} />
          </div>
          <CtaFields
            label="Primary button"
            cta={content.promoVideo.cta}
            onChange={(cta) => updatePromoVideo('cta', cta)}
          />
          <CtaFields
            label="Secondary button"
            cta={content.promoVideo.secondary}
            onChange={(cta) => updatePromoVideo('secondary', cta)}
          />
        </div>
      </section>

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={saveAll} className="rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:bg-brand-light">
          Save all changes
        </button>
      </div>
    </PanelShell>
  )
}
