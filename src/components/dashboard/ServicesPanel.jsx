import { useState } from 'react'
import DashboardItemList from './DashboardItemList'
import MediaDropzone from './MediaDropzone'
import {
  FILTER_GROUPS,
  createContentId,
  emptyClinicalCase,
  emptyTestimonial,
  emptyTherapyConcept,
  getDefaultServicesContent,
  loadServicesContentRemote,
  resetServicesContent,
  saveServicesContent,
} from '../../data/servicesContentStore'
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

function StringListEditor({ label, items, onChange, addLabel = 'Add line' }) {
  const updateItem = (index, value) => {
    onChange(items.map((item, itemIndex) => (itemIndex === index ? value : item)))
  }

  const removeItem = (index) => {
    onChange(items.filter((_, itemIndex) => itemIndex !== index))
  }

  const addItem = () => {
    onChange([...items, ''])
  }

  return (
    <div>
      <label className={labelClassName}>{label}</label>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={`${label}-${index}`} className="flex gap-2">
            <textarea
              className={`${fieldClassName} min-h-20 resize-y`}
              value={item}
              onChange={(event) => updateItem(index, event.target.value)}
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="shrink-0 self-start rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-semibold tracking-wide text-accent-hover uppercase transition-colors hover:border-accent/30"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addItem}
        className="mt-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold tracking-wide text-brand uppercase transition-colors hover:border-brand/25"
      >
        {addLabel}
      </button>
    </div>
  )
}

function TherapyConceptPreview({ concept }) {
  return (
    <div className="flex gap-3">
      <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200/80">
        {concept.image ? (
          <img src={concept.image} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-[0.6rem] text-ink-muted">No image</div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-ink">{concept.title || 'Untitled service'}</p>
        <p className="text-sm text-brand">{concept.subtitle}</p>
        <p className="mt-1 line-clamp-2 text-xs text-ink-muted">{concept.summary}</p>
      </div>
    </div>
  )
}

function TherapyConceptEditor({ initialConcept, onSave, onCancel }) {
  const [concept, setConcept] = useState({
    ...emptyTherapyConcept,
    ...initialConcept,
    paragraphs: initialConcept.paragraphs?.length ? [...initialConcept.paragraphs] : [''],
    bullets: initialConcept.bullets ? [...initialConcept.bullets] : [],
  })

  const updateField = (field, value) => {
    setConcept((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const payload = {
      ...concept,
      id: concept.id || createContentId(concept.title),
      paragraphs: concept.paragraphs.map((line) => line.trim()).filter(Boolean),
      bullets: concept.bullets.map((line) => line.trim()).filter(Boolean),
    }

    onSave(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-brand/20 bg-brand-muted/30 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-serif text-xl text-ink">{concept.id ? 'Edit service' : 'New service'}</h3>
        <button type="button" onClick={onCancel} className="text-xs font-semibold tracking-wide text-ink-muted uppercase hover:text-brand">
          Cancel
        </button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClassName}>Title</label>
          <input className={fieldClassName} value={concept.title} onChange={(e) => updateField('title', e.target.value)} required />
        </div>
        <div>
          <label className={labelClassName}>Subtitle</label>
          <input className={fieldClassName} value={concept.subtitle} onChange={(e) => updateField('subtitle', e.target.value)} required />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClassName}>Summary</label>
          <textarea className={`${fieldClassName} min-h-20 resize-y`} value={concept.summary} onChange={(e) => updateField('summary', e.target.value)} required />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClassName}>Cover image</label>
          <MediaDropzone
            image={concept.image}
            video=""
            onChange={({ image }) => updateField('image', image)}
            onClear={() => updateField('image', '')}
          />
        </div>
        <div className="sm:col-span-2">
          <StringListEditor label="Detail paragraphs" items={concept.paragraphs} onChange={(paragraphs) => updateField('paragraphs', paragraphs)} addLabel="Add paragraph" />
        </div>
        <div className="sm:col-span-2">
          <StringListEditor label="Bullet points (optional)" items={concept.bullets.length ? concept.bullets : []} onChange={(bullets) => updateField('bullets', bullets)} addLabel="Add bullet" />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button type="submit" className="rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:bg-brand-light">
          Save service
        </button>
        <button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 px-5 py-2.5 text-xs font-semibold tracking-wide text-ink-muted uppercase transition-colors hover:border-brand/25 hover:text-brand">
          Cancel
        </button>
      </div>
    </form>
  )
}

function CasePreview({ item }) {
  return (
    <div className="flex gap-3">
      <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200/80">
        {item.image ? (
          <img src={item.image} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-[0.6rem] text-ink-muted">No image</div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-brand-muted px-2 py-0.5 text-[0.6rem] font-semibold tracking-wide text-brand uppercase">
            {item.category || 'Case'}
          </span>
          {item.abbr ? (
            <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[0.6rem] font-semibold tracking-wide text-accent-hover uppercase">
              {item.abbr}
            </span>
          ) : null}
        </div>
        <p className="mt-1 truncate font-medium text-ink">{item.title || 'Untitled case'}</p>
        <p className="line-clamp-2 text-xs text-ink-muted">{item.excerpt}</p>
      </div>
    </div>
  )
}

function CaseEditor({ initialCase, onSave, onCancel }) {
  const [item, setItem] = useState({
    ...emptyClinicalCase,
    ...initialCase,
    paragraphs: initialCase.paragraphs?.length ? [...initialCase.paragraphs] : [''],
    therapyAreas: initialCase.therapyAreas?.length ? [...initialCase.therapyAreas] : [''],
  })

  const updateField = (field, value) => {
    setItem((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const payload = {
      ...item,
      id: item.id || createContentId(item.title),
      paragraphs: item.paragraphs.map((line) => line.trim()).filter(Boolean),
      therapyAreas: item.therapyAreas.map((line) => line.trim()).filter(Boolean),
    }

    onSave(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-brand/20 bg-brand-muted/30 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-serif text-xl text-ink">{item.id ? 'Edit case' : 'New case'}</h3>
        <button type="button" onClick={onCancel} className="text-xs font-semibold tracking-wide text-ink-muted uppercase hover:text-brand">
          Cancel
        </button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClassName}>Title</label>
          <input className={fieldClassName} value={item.title} onChange={(e) => updateField('title', e.target.value)} required />
        </div>
        <div>
          <label className={labelClassName}>Abbreviation</label>
          <input className={fieldClassName} value={item.abbr} onChange={(e) => updateField('abbr', e.target.value)} placeholder="ASD" />
        </div>
        <div>
          <label className={labelClassName}>Category label</label>
          <input className={fieldClassName} value={item.category} onChange={(e) => updateField('category', e.target.value)} required />
        </div>
        <div>
          <label className={labelClassName}>Filter group</label>
          <select className={fieldClassName} value={item.filterGroup} onChange={(e) => updateField('filterGroup', e.target.value)}>
            {FILTER_GROUPS.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={labelClassName}>Short excerpt</label>
          <textarea className={`${fieldClassName} min-h-20 resize-y`} value={item.excerpt} onChange={(e) => updateField('excerpt', e.target.value)} required />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClassName}>Cover image</label>
          <MediaDropzone
            image={item.image}
            video=""
            onChange={({ image }) => updateField('image', image)}
            onClear={() => updateField('image', '')}
          />
        </div>
        <div className="sm:col-span-2">
          <StringListEditor label="Detail paragraphs" items={item.paragraphs} onChange={(paragraphs) => updateField('paragraphs', paragraphs)} addLabel="Add paragraph" />
        </div>
        <div className="sm:col-span-2">
          <StringListEditor label="Therapy areas" items={item.therapyAreas} onChange={(therapyAreas) => updateField('therapyAreas', therapyAreas)} addLabel="Add therapy area" />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClassName}>Bilingual note</label>
          <input className={fieldClassName} value={item.bilingualNote} onChange={(e) => updateField('bilingualNote', e.target.value)} />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button type="submit" className="rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:bg-brand-light">
          Save case
        </button>
        <button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 px-5 py-2.5 text-xs font-semibold tracking-wide text-ink-muted uppercase transition-colors hover:border-brand/25 hover:text-brand">
          Cancel
        </button>
      </div>
    </form>
  )
}

function TestimonialPreview({ item }) {
  return (
    <div className="flex gap-3">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200/80">
        {item.image ? (
          <img src={item.image} alt="" className="h-full w-full object-cover object-top" />
        ) : (
          <div className="flex h-full items-center justify-center text-[0.6rem] text-ink-muted">No photo</div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-ink">{item.name || 'Untitled testimonial'}</p>
        {item.location ? <p className="text-sm text-brand">{item.location}</p> : null}
        <p className="mt-1 line-clamp-2 text-xs text-ink-muted">{item.quote}</p>
      </div>
    </div>
  )
}

function TestimonialEditor({ initialTestimonial, onSave, onCancel }) {
  const [item, setItem] = useState({
    ...emptyTestimonial,
    ...initialTestimonial,
  })

  const updateField = (field, value) => {
    setItem((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    onSave({
      ...item,
      id: item.id || createContentId(item.name),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-brand/20 bg-brand-muted/30 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-serif text-xl text-ink">{item.id ? 'Edit testimonial' : 'New testimonial'}</h3>
        <button type="button" onClick={onCancel} className="text-xs font-semibold tracking-wide text-ink-muted uppercase hover:text-brand">
          Cancel
        </button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClassName}>Name</label>
          <input className={fieldClassName} value={item.name} onChange={(e) => updateField('name', e.target.value)} required />
        </div>
        <div>
          <label className={labelClassName}>Location / role</label>
          <input
            className={fieldClassName}
            value={item.location}
            onChange={(e) => updateField('location', e.target.value)}
            placeholder="Faris's Mom"
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClassName}>Photo</label>
          <MediaDropzone
            image={item.image}
            video=""
            onChange={({ image }) => updateField('image', image)}
            onClear={() => updateField('image', '')}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClassName}>Quote</label>
          <textarea
            className={`${fieldClassName} min-h-40 resize-y`}
            value={item.quote}
            onChange={(e) => updateField('quote', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button type="submit" className="rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:bg-brand-light">
          Save testimonial
        </button>
        <button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 px-5 py-2.5 text-xs font-semibold tracking-wide text-ink-muted uppercase transition-colors hover:border-brand/25 hover:text-brand">
          Cancel
        </button>
      </div>
    </form>
  )
}

export default function ServicesPanel() {
  const { content, setContent, loading, loadError } = useDashboardSection(
    getDefaultServicesContent,
    loadServicesContentRemote,
  )
  const [editingServiceId, setEditingServiceId] = useState(null)
  const [editingCaseId, setEditingCaseId] = useState(null)
  const [editingTestimonialId, setEditingTestimonialId] = useState(null)
  const [savedMessage, setSavedMessage] = useState('')
  const [saveError, setSaveError] = useState('')

  const persist = (nextContent, message = 'Changes saved.') => {
    persistDashboardSection({
      saveFn: saveServicesContent,
      nextContent,
      setContent,
      setSaveError,
      setSavedMessage,
      message,
      storageErrorMessage: 'Could not save — images may be too large. Try smaller files.',
    })
  }

  const updateServicesHeader = (field, value) => {
    setContent((current) => ({
      ...current,
      speechLanguageServices: { ...current.speechLanguageServices, [field]: value },
    }))
  }

  const updateCasesHeader = (field, value) => {
    setContent((current) => ({
      ...current,
      casesWeServe: { ...current.casesWeServe, [field]: value },
    }))
  }

  const updateTestimonialsHeader = (field, value) => {
    setContent((current) => ({
      ...current,
      testimonialsSection: { ...current.testimonialsSection, [field]: value },
    }))
  }

  const saveServicesHeader = () => persist(content, 'Services header saved.')

  const saveCasesHeader = () => persist(content, 'Cases header saved.')

  const saveTestimonialsHeader = () => persist(content, 'Testimonials header saved.')

  const saveService = (concept) => {
    const exists = content.therapyConcepts.some((item) => item.id === concept.id)
    const therapyConcepts = exists
      ? content.therapyConcepts.map((item) => (item.id === concept.id ? concept : item))
      : [concept, ...content.therapyConcepts]

    persist({ ...content, therapyConcepts }, exists ? 'Service updated.' : 'Service created.')
    setEditingServiceId(null)
  }

  const deleteService = (id) => {
    persist(
      { ...content, therapyConcepts: content.therapyConcepts.filter((item) => item.id !== id) },
      'Service deleted.',
    )
    if (editingServiceId === id) setEditingServiceId(null)
  }

  const saveCase = (item) => {
    const exists = content.clinicalSpecializations.some((entry) => entry.id === item.id)
    const clinicalSpecializations = exists
      ? content.clinicalSpecializations.map((entry) => (entry.id === item.id ? item : entry))
      : [item, ...content.clinicalSpecializations]

    persist({ ...content, clinicalSpecializations }, exists ? 'Case updated.' : 'Case created.')
    setEditingCaseId(null)
  }

  const deleteCase = (id) => {
    persist(
      {
        ...content,
        clinicalSpecializations: content.clinicalSpecializations.filter((entry) => entry.id !== id),
      },
      'Case deleted.',
    )
    if (editingCaseId === id) setEditingCaseId(null)
  }

  const saveTestimonial = (item) => {
    const exists = content.testimonials.some((entry) => entry.id === item.id)
    const testimonials = exists
      ? content.testimonials.map((entry) => (entry.id === item.id ? item : entry))
      : [item, ...content.testimonials]

    persist({ ...content, testimonials }, exists ? 'Testimonial updated.' : 'Testimonial created.')
    setEditingTestimonialId(null)
  }

  const deleteTestimonial = (id) => {
    persist(
      { ...content, testimonials: content.testimonials.filter((entry) => entry.id !== id) },
      'Testimonial deleted.',
    )
    if (editingTestimonialId === id) setEditingTestimonialId(null)
  }

  const handleReset = () => {
    if (!window.confirm('Reset all services, cases, and testimonials back to the original defaults?')) return

    resetServicesContent()
    setContent(getDefaultServicesContent())
    setEditingServiceId(null)
    setEditingCaseId(null)
    setEditingTestimonialId(null)
    setSaveError('')
    setSavedMessage('Reset to default content.')
    window.setTimeout(() => setSavedMessage(''), 2500)
  }

  return (
    <PanelShell
      eyebrow="Service"
      title="Therapy services, cases & testimonials"
      description="Manage service pathway cards, clinical cases, and family testimonials shown on the live Services page and homepage. Saves go to Supabase."
    >
      <DashboardSectionLoader loading={loading} loadError={loadError} />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <a href="/services" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-brand transition-colors hover:text-brand-light">
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
        <h2 className="font-serif text-xl text-ink">Services section header</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClassName}>Title</label>
            <input className={fieldClassName} value={content.speechLanguageServices.title} onChange={(e) => updateServicesHeader('title', e.target.value)} />
          </div>
          <div>
            <label className={labelClassName}>Tagline</label>
            <input className={fieldClassName} value={content.speechLanguageServices.tagline} onChange={(e) => updateServicesHeader('tagline', e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClassName}>Intro</label>
            <textarea className={`${fieldClassName} min-h-24 resize-y`} value={content.speechLanguageServices.intro} onChange={(e) => updateServicesHeader('intro', e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <StringListEditor
              label="Family benefits"
              items={content.speechLanguageServices.familyBenefits}
              onChange={(familyBenefits) => updateServicesHeader('familyBenefits', familyBenefits)}
              addLabel="Add benefit"
            />
          </div>
        </div>
        <button type="button" onClick={saveServicesHeader} className="mt-4 rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:bg-brand-light">
          Save header
        </button>
      </section>

      <div className="mt-6">
        <DashboardItemList
          title="Service pathway cards"
          countLabel={`${content.therapyConcepts.length} service${content.therapyConcepts.length === 1 ? '' : 's'}`}
          items={content.therapyConcepts}
          editingId={editingServiceId}
          onAdd={() => setEditingServiceId('new')}
          onEdit={setEditingServiceId}
          onDelete={deleteService}
          getItemId={(item) => item.id}
          renderPreview={(item) => <TherapyConceptPreview concept={item} />}
          renderEditor={(item) =>
            item === 'new' ? (
              <TherapyConceptEditor initialConcept={emptyTherapyConcept} onSave={saveService} onCancel={() => setEditingServiceId(null)} />
            ) : (
              <TherapyConceptEditor key={item.id} initialConcept={item} onSave={saveService} onCancel={() => setEditingServiceId(null)} />
            )
          }
        />
      </div>

      <section className="mt-6 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-brand/5">
        <h2 className="font-serif text-xl text-ink">Cases section header</h2>
        <div className="mt-4 grid gap-4">
          <div>
            <label className={labelClassName}>Title</label>
            <input className={fieldClassName} value={content.casesWeServe.title} onChange={(e) => updateCasesHeader('title', e.target.value)} />
          </div>
          <div>
            <label className={labelClassName}>Intro</label>
            <textarea className={`${fieldClassName} min-h-24 resize-y`} value={content.casesWeServe.intro} onChange={(e) => updateCasesHeader('intro', e.target.value)} />
          </div>
        </div>
        <button type="button" onClick={saveCasesHeader} className="mt-4 rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:bg-brand-light">
          Save header
        </button>
      </section>

      <div className="mt-6">
        <DashboardItemList
          title="Clinical cases"
          countLabel={`${content.clinicalSpecializations.length} case${content.clinicalSpecializations.length === 1 ? '' : 's'}`}
          items={content.clinicalSpecializations}
          editingId={editingCaseId}
          onAdd={() => setEditingCaseId('new')}
          onEdit={setEditingCaseId}
          onDelete={deleteCase}
          getItemId={(item) => item.id}
          renderPreview={(item) => <CasePreview item={item} />}
          renderEditor={(item) =>
            item === 'new' ? (
              <CaseEditor initialCase={emptyClinicalCase} onSave={saveCase} onCancel={() => setEditingCaseId(null)} />
            ) : (
              <CaseEditor key={item.id} initialCase={item} onSave={saveCase} onCancel={() => setEditingCaseId(null)} />
            )
          }
        />
      </div>

      <section className="mt-6 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-brand/5">
        <h2 className="font-serif text-xl text-ink">Testimonials section header</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClassName}>Eyebrow</label>
            <input
              className={fieldClassName}
              value={content.testimonialsSection.eyebrow}
              onChange={(e) => updateTestimonialsHeader('eyebrow', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClassName}>Title</label>
            <input
              className={fieldClassName}
              value={content.testimonialsSection.title}
              onChange={(e) => updateTestimonialsHeader('title', e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClassName}>Description</label>
            <textarea
              className={`${fieldClassName} min-h-24 resize-y`}
              value={content.testimonialsSection.description}
              onChange={(e) => updateTestimonialsHeader('description', e.target.value)}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={saveTestimonialsHeader}
          className="mt-4 rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:bg-brand-light"
        >
          Save header
        </button>
      </section>

      <div className="mt-6">
        <DashboardItemList
          title="Testimonials"
          countLabel={`${content.testimonials.length} testimonial${content.testimonials.length === 1 ? '' : 's'}`}
          items={content.testimonials}
          editingId={editingTestimonialId}
          onAdd={() => setEditingTestimonialId('new')}
          onEdit={setEditingTestimonialId}
          onDelete={deleteTestimonial}
          getItemId={(item) => item.id}
          renderPreview={(item) => <TestimonialPreview item={item} />}
          renderEditor={(item) =>
            item === 'new' ? (
              <TestimonialEditor initialTestimonial={emptyTestimonial} onSave={saveTestimonial} onCancel={() => setEditingTestimonialId(null)} />
            ) : (
              <TestimonialEditor key={item.id} initialTestimonial={item} onSave={saveTestimonial} onCancel={() => setEditingTestimonialId(null)} />
            )
          }
        />
      </div>

      <div className="mt-6">
        <button type="button" onClick={handleReset} className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold tracking-wide text-ink-muted uppercase transition-colors hover:border-accent/30 hover:text-accent-hover">
          Reset to defaults
        </button>
      </div>
    </PanelShell>
  )
}
