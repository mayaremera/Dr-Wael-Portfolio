import { useDrWaelActivity } from '../hooks/useDrWaelActivity'
import VibeBand from './VibeBand'

export default function InTheFieldPresenceBand() {
  const { activity, isReady } = useDrWaelActivity()
  const section = activity?.academicClinicalPresence

  if (!isReady || !section) return null

  return (
    <VibeBand
      label={section.label}
      title={section.title}
      description={section.description}
      primaryLabel={section.primaryLabel}
      secondaryLabel={section.secondaryLabel}
    />
  )
}
