const seamPositions = ['33.333%', '66.666%']

export default function GalleryPageHeading({ eyebrow, title, galleryImages }) {
  const images = galleryImages.slice(0, 3)

  return (
    <section className="relative overflow-hidden bg-brand-muted">
      <div className="relative min-h-[300px] pt-24 sm:min-h-[340px] sm:pt-28 lg:pt-36 xl:pt-40">
        <div className="absolute inset-0 grid grid-cols-3 bg-brand-muted">
          {images.map((src) => (
            <img
              key={src}
              src={src}
              alt=""
              className="h-full w-full object-cover object-center"
            />
          ))}
        </div>

        {seamPositions.map((position) => (
          <div
            key={position}
            className="pointer-events-none absolute inset-y-0 z-[1] w-16 -translate-x-1/2 bg-linear-to-r from-transparent via-brand-muted/95 to-transparent"
            style={{ left: position }}
            aria-hidden="true"
          />
        ))}

        <div className="absolute inset-0 z-[2] bg-linear-to-r from-ink/85 via-ink/65 to-ink/40" />
        <div className="absolute inset-x-0 bottom-0 z-[2] h-20 bg-linear-to-t from-ink/35 to-transparent" />

        <div className="relative z-[3] mx-auto flex min-h-[300px] max-w-6xl flex-col justify-end px-6 pb-10 sm:min-h-[340px] sm:pb-12 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.24em] text-accent uppercase">{eyebrow}</p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight text-white md:text-5xl">{title}</h1>
        </div>
      </div>
    </section>
  )
}
