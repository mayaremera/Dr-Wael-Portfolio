import Logo from '../Logo'

const mainNavItems = [
  {
    id: 'home',
    label: 'Home',
    description: 'Hero & sections',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5L12 3l9 7.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10v10h14V10" />
        <path strokeLinecap="round" d="M10 20v-6h4v6" />
      </svg>
    ),
  },
  {
    id: 'about-me',
    label: 'About Me',
    description: 'Profile & bio',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
        <circle cx="12" cy="8" r="4" />
        <path strokeLinecap="round" d="M5 20c0-3.5 3.13-6 7-6s7 2.5 7 6" />
      </svg>
    ),
  },
  {
    id: 'services',
    label: 'Services',
    description: 'Therapy & cases',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path strokeLinecap="round" d="M9 12h6M9 16h4" />
      </svg>
    ),
  },
  {
    id: 'gallery',
    label: 'Video / Gallery',
    description: 'Photos & videos',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="9" cy="11" r="2" />
        <path strokeLinecap="round" d="M21 15l-5-5L9 17" />
      </svg>
    ),
  },
  {
    id: 'in-the-field',
    label: 'In the Field',
    description: 'Events & activity',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" d="M3 9h18M7 3v4M17 3v4" />
        <rect x="3" y="7" width="18" height="14" rx="2" />
        <path strokeLinecap="round" d="M8 13h4M8 17h7" />
      </svg>
    ),
  },
  {
    id: 'contact',
    label: 'Contact',
    description: 'Hours & details',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" d="M4 7l8 5 8-5M4 7v10h16V7" />
      </svg>
    ),
  },
]

function SidebarLink({ item, active, onSelect }) {

  return (

    <button

      type="button"

      onClick={() => onSelect(item.id)}

      className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-all duration-200 ${

        active

          ? 'bg-white/12 text-white shadow-sm shadow-black/10'

          : 'text-white/70 hover:bg-white/8 hover:text-white'

      }`}

    >

      <span

        className={`absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full transition-all duration-200 ${

          active ? 'bg-accent opacity-100' : 'bg-accent opacity-0 group-hover:opacity-40'

        }`}

        aria-hidden="true"

      />



      <span

        className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg transition-colors ${

          active ? 'bg-accent/20 text-accent' : 'bg-white/8 text-white/80 group-hover:bg-white/12'

        }`}

      >

        {item.icon}

      </span>



      <span className="min-w-0">

        <span className="block text-sm font-medium">{item.label}</span>

        <span className={`block text-[0.65rem] ${active ? 'text-white/65' : 'text-white/45'}`}>

          {item.description}

        </span>

      </span>

    </button>

  )

}



export default function DashboardSidebar({ activeSection, onSelect }) {

  return (

    <aside className="relative flex h-full w-full flex-col overflow-hidden bg-linear-to-b from-brand via-brand to-brand-light text-white lg:w-72 lg:shrink-0 xl:w-80">

      <div

        className="pointer-events-none absolute -right-10 top-16 h-40 w-40 rounded-full bg-accent/15 blur-3xl"

        aria-hidden="true"

      />

      <div

        className="pointer-events-none absolute -left-8 bottom-24 h-32 w-32 rounded-full bg-white/8 blur-3xl"

        aria-hidden="true"

      />



      <div className="relative border-b border-white/10 px-5 py-6">

        <div className="flex items-center gap-3">

          <Logo scrolled={false} markOnly className="!h-11" />

          <div>

            <p className="font-serif text-lg leading-tight">Dashboard</p>

            <p className="text-[0.65rem] tracking-[0.18em] text-white/55 uppercase">Content Manager</p>

          </div>

        </div>

      </div>



      <nav className="relative flex flex-1 flex-col overflow-y-auto px-3 py-5">

        <div className="flex-1">

          <p className="mb-3 px-3 text-[0.62rem] font-semibold tracking-[0.2em] text-white/40 uppercase">

            Sections

          </p>

          <div className="space-y-1">

            {mainNavItems.map((item) => (

              <SidebarLink

                key={item.id}

                item={item}

                active={activeSection === item.id}

                onSelect={onSelect}

              />

            ))}

          </div>

        </div>
      </nav>



      <div className="relative border-t border-white/10 p-4">

        <a

          href="/"

          className="flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/8 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:border-white/35 hover:bg-white/14"

        >

          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">

            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />

          </svg>

          View live site

        </a>

      </div>

    </aside>

  )

}


