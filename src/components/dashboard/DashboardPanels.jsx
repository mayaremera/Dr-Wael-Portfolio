import AboutMePanel from './AboutMePanel'
import ContactPanel from './ContactPanel'
import GalleryPanel from './GalleryPanel'
import InTheFieldPanel from './InTheFieldPanel'
import ServicesPanel from './ServicesPanel'

const panels = {  'about-me': AboutMePanel,
  services: ServicesPanel,
  gallery: GalleryPanel,
  'in-the-field': InTheFieldPanel,
  contact: ContactPanel,
}

export function DashboardPanel({ section }) {
  const Panel = panels[section] ?? InTheFieldPanel
  return <Panel />
}
