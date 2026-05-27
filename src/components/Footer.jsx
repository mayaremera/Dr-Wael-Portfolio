export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200 bg-surface-tint py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 text-center md:flex-row md:text-left lg:px-8">
        <p className="font-serif text-lg text-brand">Dr. Wael A. Al-Dakroury</p>
        <p className="text-sm text-ink-muted">
          Speech-Language Pathologist · Pediatric Communication Specialist
        </p>
        <p className="text-sm text-ink-muted">
          &copy; {year} Dr. Wael Al-Dakroury. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
