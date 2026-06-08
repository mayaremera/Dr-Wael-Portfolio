import AboutMePanel from './AboutMePanel'
import ContactPanel from './ContactPanel'
import GalleryPanel from './GalleryPanel'
import InTheFieldPanel from './InTheFieldPanel'
import ServicesPanel from './ServicesPanel'

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

function PlaceholderCard({ title, items }) {
  return (
    <article className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-brand/5">
      <h2 className="text-sm font-semibold text-ink">{title}</h2>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-center gap-2.5 rounded-lg bg-surface-alt px-3 py-2.5 text-sm text-ink-muted"
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </article>
  )
}

export function SettingsPanel() {
  return (
    <PanelShell
      eyebrow="Settings"
      title="Site settings"
      description="Manage global site details, branding, and footer information."
    >
      <div className="grid gap-5 md:grid-cols-2">
        <PlaceholderCard
          title="General"
          items={['Site title & tagline', 'Contact email & phone', 'Social media links']}
        />
        <PlaceholderCard
          title="Branding"
          items={['Logo & favicon', 'Hero banner image', 'Footer tagline']}
        />
      </div>
    </PanelShell>
  )
}

const panels = {
  settings: SettingsPanel,
  'about-me': AboutMePanel,
  services: ServicesPanel,
  gallery: GalleryPanel,
  'in-the-field': InTheFieldPanel,
  contact: ContactPanel,
}

export function DashboardPanel({ section }) {
  const Panel = panels[section] ?? InTheFieldPanel
  return <Panel />
}
