import { hopeGallery } from '../data/content'

function GalleryTile({ item, className = '' }) {
  return (
    <figure
      className={`group relative overflow-hidden rounded-2xl shadow-lg ring-1 ring-white/60 ${className}`}
    >
      <img
        src={item.src}
        alt={item.alt}
        className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-ink/50 via-ink/5 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90"
        aria-hidden="true"
      />
      <figcaption className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <p className="text-xs font-semibold tracking-[0.18em] text-white/80 uppercase">
          {item.eyebrow}
        </p>
      </figcaption>
    </figure>
  )
}

export default function HopeGallery() {
  const [main, ...rest] = hopeGallery.images

  return (
    <section
      id="impact"
      aria-label="Children in speech therapy"
      className="relative overflow-hidden border-t border-slate-200 bg-surface py-16 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <header className="mb-10 text-center lg:mb-12">
          <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">
            {hopeGallery.label}
          </p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-ink md:text-4xl">
            {hopeGallery.title}
          </h2>
          <div
            className="mx-auto mt-5 h-1 w-14 rounded-full bg-gradient-to-r from-brand via-brand-light to-accent"
            aria-hidden="true"
          />
        </header>

        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-12 lg:grid-rows-2 lg:gap-4">
          <GalleryTile
            item={main}
            className="min-h-[260px] sm:min-h-[280px] sm:col-span-2 lg:col-span-7 lg:row-span-2 lg:min-h-[400px]"
          />
          {rest.map((item) => (
            <GalleryTile
              key={item.src}
              item={item}
              className="min-h-[200px] sm:min-h-[220px] lg:col-span-5 lg:min-h-0"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
