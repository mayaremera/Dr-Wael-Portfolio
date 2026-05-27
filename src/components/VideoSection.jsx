import { video } from '../data/content'

const embedUrl = `https://www.youtube.com/embed/${video.youtubeId}?rel=0`

export default function VideoSection() {
  return (
    <section id="video" className="border-t border-slate-200 bg-surface-alt py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-medium tracking-[0.2em] text-brand uppercase">
            Watch
          </p>
          <h2 className="mt-4 font-serif text-3xl font-medium text-ink md:text-4xl">
            {video.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-ink-muted">{video.description}</p>
        </div>

        <div className="mt-12 overflow-hidden rounded-sm border border-slate-200 bg-white shadow-lg">
          <div className="relative aspect-video w-full bg-slate-100">
            <iframe
              src={embedUrl}
              title={video.title}
              className="absolute inset-0 h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>

        <p className="mt-6 text-center">
          <a
            href={video.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-brand transition-colors hover:text-brand-light"
          >
            Open video on YouTube →
          </a>
        </p>
      </div>
    </section>
  )
}
