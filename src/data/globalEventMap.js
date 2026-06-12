export const globalPresenceMap = {
  label: 'Global Presence',
  title: 'A World of Conferences & Engagements',
  description:
    'Dr. Wael has lectured, led committees, and represented the profession across continents — from ASHA conventions in America to IALP forums in Europe, Asia, and the Middle East. Spin the globe and explore.',
}

const milestone = (id, period, date, type, title, location, note) => ({
  id,
  period,
  date,
  type,
  title,
  location,
  note,
  isMilestone: true,
})

export const mapLocations = [
  {
    id: 'saudi-arabia',
    country: 'Saudi Arabia',
    city: 'Riyadh',
    lat: 24.7136,
    lng: 46.6753,
    flag: '🇸🇦',
    role: 'Clinical & academic home base',
    milestones: [
      milestone('director-role', 'Present', 'Ongoing', 'Clinical Leadership', 'Director, Communication Disorders Department', 'Psych Care Complex, Riyadh', 'Leading multidisciplinary clinical services for children and families.'),
      milestone('alfaisal-professor', 'Present', 'Ongoing', 'Academic', 'Associate Professor, Faculty of Medicine', 'Alfaisal University, Riyadh', 'Teaching and mentoring graduate students in communication sciences.'),
      milestone('riyadh-symposium', '2024', 'Mar 2024', 'Symposium', 'Arabic–English Bilingual Assessment Symposium', 'Riyadh', 'Keynote on culturally fair assessment for bilingual children.'),
    ],
  },
  {
    id: 'uae',
    country: 'United Arab Emirates',
    city: 'Dubai',
    lat: 25.2048,
    lng: 55.2708,
    flag: '🇦🇪',
    role: 'Gulf region conferences',
    milestones: [
      milestone('dubai-workshop', '2023', 'Nov 2023', 'Workshop', 'Autism & AAC: Gulf Clinical Workshop', 'Dubai Healthcare City', 'Hands-on training for SLPs and educators across the GCC.'),
    ],
  },
  {
    id: 'qatar',
    country: 'Qatar',
    city: 'Doha',
    lat: 25.2854,
    lng: 51.531,
    flag: '🇶🇦',
    role: 'Regional professional forums',
    milestones: [
      milestone('doha-forum', '2022', 'Feb 2022', 'Forum', 'Gulf Communication Sciences Forum', 'Doha', 'Panel on early intervention and family-centered care in Arabic-speaking communities.'),
    ],
  },
  {
    id: 'kuwait',
    country: 'Kuwait',
    city: 'Kuwait City',
    lat: 29.3759,
    lng: 47.9774,
    flag: '🇰🇼',
    role: 'Regional workshops',
    milestones: [
      milestone('kuwait-lecture', '2021', 'Oct 2021', 'Guest Lecture', 'Developmental Language Disorder in Arabic', 'Kuwait University', 'Clinical lecture for faculty and graduate clinicians.'),
    ],
  },
  {
    id: 'bahrain',
    country: 'Bahrain',
    city: 'Manama',
    lat: 26.2285,
    lng: 50.586,
    flag: '🇧🇭',
    role: 'Gulf clinical training',
    milestones: [
      milestone('bahrain-training', '2020', 'Jan 2020', 'Training', 'Pediatric SLP Masterclass', 'Manama', 'Intensive clinical training for speech-language pathologists in the Gulf.'),
    ],
  },
  {
    id: 'egypt',
    country: 'Egypt',
    city: 'Cairo',
    lat: 30.0444,
    lng: 31.2357,
    flag: '🇪🇬',
    role: 'Regional professional leadership',
    milestones: [
      milestone('eacsl-president', 'Present', 'Ongoing', 'Leadership', 'Honorary President, EACSL', 'Egyptian Association for Communication Sciences', 'Honoring contributions to communication sciences across the Arab region.'),
      milestone('cairo-congress', '2019', 'Sep 2019', 'Congress', 'EACSL Annual Congress — Opening Keynote', 'Cairo', 'Addressed hundreds of clinicians on evidence-based bilingual intervention.'),
    ],
  },
  {
    id: 'jordan',
    country: 'Jordan',
    city: 'Amman',
    lat: 31.9454,
    lng: 35.9284,
    flag: '🇯🇴',
    role: 'Levant region engagements',
    milestones: [
      milestone('amman-summit', '2018', 'May 2018', 'Summit', 'Levant SLP Clinical Summit', 'Amman', 'Workshop on autism spectrum communication support in Arabic and English.'),
    ],
  },
  {
    id: 'lebanon',
    country: 'Lebanon',
    city: 'Beirut',
    lat: 33.8938,
    lng: 35.5018,
    flag: '🇱🇧',
    role: 'Regional collaboration',
    milestones: [
      milestone('beirut-seminar', '2017', 'Apr 2017', 'Seminar', 'Childhood Apraxia of Speech — Clinical Seminar', 'Beirut', 'Advanced seminar for clinicians on CAS identification and treatment.'),
    ],
  },
  {
    id: 'turkey',
    country: 'Turkey',
    city: 'Istanbul',
    lat: 41.0082,
    lng: 28.9784,
    flag: '🇹🇷',
    role: 'Cross-regional conferences',
    milestones: [
      milestone('istanbul-conf', '2016', 'Nov 2016', 'Conference', 'Euro-Mediterranean SLP Conference', 'Istanbul', 'Invited speaker on multilingual assessment practices.'),
    ],
  },
  {
    id: 'morocco',
    country: 'Morocco',
    city: 'Casablanca',
    lat: 33.5731,
    lng: -7.5898,
    flag: '🇲🇦',
    role: 'North Africa outreach',
    milestones: [
      milestone('casablanca-forum', '2015', 'Jun 2015', 'Forum', 'North Africa Communication Sciences Forum', 'Casablanca', 'Presented on bilingual language development and clinical caseload management.'),
    ],
  },
  {
    id: 'united-kingdom',
    country: 'United Kingdom',
    city: 'Edinburgh & London',
    lat: 55.9533,
    lng: -3.1883,
    flag: '🇬🇧',
    role: 'Doctoral training & UK conferences',
    milestones: [
      milestone('phd-edinburgh', 'Doctorate', 'PhD', 'Education', 'PhD in Speech-Language Pathology', 'Queen Margaret University, Edinburgh', 'Advanced research training shaping decades of clinical and academic work.'),
      milestone('london-lecture', '2014', 'Sep 2014', 'Conference', 'Royal College of Speech & Language — Guest Lecture', 'London', 'Presented research on bilingual children with developmental language disorder.'),
    ],
  },
  {
    id: 'germany',
    country: 'Germany',
    city: 'Berlin',
    lat: 52.52,
    lng: 13.405,
    flag: '🇩🇪',
    role: 'European professional forums',
    milestones: [
      milestone('berlin-ialp', '2023', 'Aug 2023', 'Congress', 'IALP World Congress — Symposium Chair', 'Berlin', 'Led symposium on global child language research and clinical translation.'),
    ],
  },
  {
    id: 'france',
    country: 'France',
    city: 'Paris',
    lat: 48.8566,
    lng: 2.3522,
    flag: '🇫🇷',
    role: 'European academic exchange',
    milestones: [
      milestone('paris-colloquium', '2019', 'Jun 2019', 'Colloquium', 'International Language Sciences Colloquium', 'Paris', 'Discussant on cross-linguistic assessment methodologies.'),
    ],
  },
  {
    id: 'italy',
    country: 'Italy',
    city: 'Rome',
    lat: 41.9028,
    lng: 12.4964,
    flag: '🇮🇹',
    role: 'Mediterranean conferences',
    milestones: [
      milestone('rome-symposium', '2018', 'Oct 2018', 'Symposium', 'Mediterranean SLP Research Symposium', 'Rome', 'Keynote on evidence-based intervention for children with autism.'),
    ],
  },
  {
    id: 'spain',
    country: 'Spain',
    city: 'Barcelona',
    lat: 41.3874,
    lng: 2.1686,
    flag: '🇪🇸',
    role: 'Iberian clinical forums',
    milestones: [
      milestone('barcelona-workshop', '2017', 'Mar 2017', 'Workshop', 'Multilingual Clinical Practice Workshop', 'Barcelona', 'Training clinicians on serving bilingual and multilingual families.'),
    ],
  },
  {
    id: 'netherlands',
    country: 'Netherlands',
    city: 'Amsterdam',
    lat: 52.3676,
    lng: 4.9041,
    flag: '🇳🇱',
    role: 'Northern Europe engagements',
    milestones: [
      milestone('amsterdam-seminar', '2016', 'Sep 2016', 'Seminar', 'European SLP Research Seminar', 'Amsterdam', 'Presented on culturally responsive assessment frameworks.'),
    ],
  },
  {
    id: 'switzerland',
    country: 'Switzerland',
    city: 'Geneva',
    lat: 46.2044,
    lng: 6.1432,
    flag: '🇨🇭',
    role: 'International policy forums',
    milestones: [
      milestone('geneva-panel', '2022', 'May 2022', 'Panel', 'Global Health & Communication Disorders Panel', 'Geneva', 'Contributed clinical perspective on international disability and communication policy.'),
    ],
  },
  {
    id: 'sweden',
    country: 'Sweden',
    city: 'Stockholm',
    lat: 59.3293,
    lng: 18.0686,
    flag: '🇸🇪',
    role: 'Nordic conferences',
    milestones: [
      milestone('stockholm-conf', '2015', 'Aug 2015', 'Conference', 'Nordic SLP Conference — Invited Speaker', 'Stockholm', 'Lecture on bilingual language development in clinical populations.'),
    ],
  },
  {
    id: 'norway',
    country: 'Norway',
    city: 'Oslo',
    lat: 59.9139,
    lng: 10.7522,
    flag: '🇳🇴',
    role: 'Scandinavian clinical exchange',
    milestones: [
      milestone('oslo-lecture', '2014', 'Nov 2014', 'Guest Lecture', 'University of Oslo — Clinical Lecture Series', 'Oslo', 'Presented on autism communication interventions across cultures.'),
    ],
  },
  {
    id: 'united-states',
    country: 'United States',
    city: 'Washington, D.C.',
    lat: 38.9072,
    lng: -77.0369,
    flag: '🇺🇸',
    role: 'ASHA leadership & conventions',
    milestones: [
      milestone('asha-fellow-ceremony', '2025', 'Nov 2025', 'Honor', 'ASHA Fellow — Highest Professional Distinction', 'ASHA Convention, USA', 'Awarded Fellow status for outstanding contributions to communication sciences.'),
      milestone('asha-ambassador', '2024–2026', '2024', 'Leadership', 'ASHA International SLP Ambassador', 'American Speech-Language-Hearing Association', 'Global advocacy at international forums and collaborative initiatives.'),
      milestone('sig17-editor', '2026–2028', '2026', 'Editorial', 'Chief Editor, SIG17 Perspectives', 'ASHA SIG17', 'Editorial leadership shaping discourse in communication sciences.'),
      milestone('intl-achievement-award', '2023', '2023', 'Recognition', 'Outstanding International Achievement Award', 'ASHA, USA', 'Recognized for exceptional international contributions to speech-language pathology.'),
    ],
  },
  {
    id: 'california',
    country: 'United States',
    city: 'San Jose, California',
    lat: 37.3382,
    lng: -121.8863,
    flag: '🇺🇸',
    role: 'Graduate training',
    milestones: [
      milestone('ma-sjsu', 'Graduate', 'MA', 'Education', 'MA in Speech-Language Pathology', 'San Jose State University, California', 'Foundational graduate training in clinical speech-language pathology.'),
    ],
  },
  {
    id: 'canada',
    country: 'Canada',
    city: 'Toronto',
    lat: 43.6532,
    lng: -79.3832,
    flag: '🇨🇦',
    role: 'North American conferences',
    milestones: [
      milestone('toronto-conf', '2021', 'Jun 2021', 'Conference', 'Canadian SLP Association Conference', 'Toronto', 'Keynote on bilingual assessment and intervention in multicultural communities.'),
    ],
  },
  {
    id: 'brazil',
    country: 'Brazil',
    city: 'São Paulo',
    lat: -23.5505,
    lng: -46.6333,
    flag: '🇧🇷',
    role: 'Latin American forums',
    milestones: [
      milestone('saopaulo-congress', '2019', 'Nov 2019', 'Congress', 'Latin American Communication Sciences Congress', 'São Paulo', 'Invited speaker on autism spectrum communication support.'),
    ],
  },
  {
    id: 'mexico',
    country: 'Mexico',
    city: 'Mexico City',
    lat: 19.4326,
    lng: -99.1332,
    flag: '🇲🇽',
    role: 'Americas clinical exchange',
    milestones: [
      milestone('mexico-symposium', '2018', 'Feb 2018', 'Symposium', 'Ibero-American SLP Symposium', 'Mexico City', 'Workshop on developmental language disorder in Spanish–English bilingual children.'),
    ],
  },
  {
    id: 'japan',
    country: 'Japan',
    city: 'Tokyo',
    lat: 35.6762,
    lng: 139.6503,
    flag: '🇯🇵',
    role: 'Asia-Pacific conferences',
    milestones: [
      milestone('tokyo-ialp', '2020', 'Aug 2020', 'Congress', 'IALP Asia-Pacific Regional Meeting', 'Tokyo', 'Presented on global standards in child language assessment.'),
    ],
  },
  {
    id: 'south-korea',
    country: 'South Korea',
    city: 'Seoul',
    lat: 37.5665,
    lng: 126.978,
    flag: '🇰🇷',
    role: 'East Asia clinical forums',
    milestones: [
      milestone('seoul-summit', '2017', 'Jul 2017', 'Summit', 'East Asia SLP Clinical Summit', 'Seoul', 'Panel on AAC and autism in multilingual clinical settings.'),
    ],
  },
  {
    id: 'china',
    country: 'China',
    city: 'Beijing',
    lat: 39.9042,
    lng: 116.4074,
    flag: '🇨🇳',
    role: 'Asia academic exchange',
    milestones: [
      milestone('beijing-forum', '2016', 'May 2016', 'Forum', 'International Communication Sciences Forum', 'Beijing', 'Guest lecture on evidence-based pediatric language intervention.'),
    ],
  },
  {
    id: 'india',
    country: 'India',
    city: 'New Delhi',
    lat: 28.6139,
    lng: 77.209,
    flag: '🇮🇳',
    role: 'South Asia outreach',
    milestones: [
      milestone('delhi-workshop', '2015', 'Dec 2015', 'Workshop', 'South Asia SLP Training Workshop', 'New Delhi', 'Clinical training for speech-language pathologists across South Asia.'),
    ],
  },
  {
    id: 'singapore',
    country: 'Singapore',
    city: 'Singapore',
    lat: 1.3521,
    lng: 103.8198,
    flag: '🇸🇬',
    role: 'Southeast Asia hub',
    milestones: [
      milestone('sg-conference', '2022', 'Nov 2022', 'Conference', 'Asia-Pacific SLP Conference', 'Singapore', 'Keynote on culturally and linguistically diverse clinical practice.'),
    ],
  },
  {
    id: 'malaysia',
    country: 'Malaysia',
    city: 'Kuala Lumpur',
    lat: 3.139,
    lng: 101.6869,
    flag: '🇲🇾',
    role: 'ASEAN clinical forums',
    milestones: [
      milestone('kl-seminar', '2019', 'Apr 2019', 'Seminar', 'ASEAN Communication Sciences Seminar', 'Kuala Lumpur', 'Presented on bilingual language assessment in Southeast Asian contexts.'),
    ],
  },
  {
    id: 'australia',
    country: 'Australia',
    city: 'Sydney',
    lat: -33.8688,
    lng: 151.2093,
    flag: '🇦🇺',
    role: 'Oceania conferences',
    milestones: [
      milestone('sydney-conf', '2018', 'Aug 2018', 'Conference', 'Speech Pathology Australia Conference', 'Sydney', 'Invited speaker on autism communication interventions and family engagement.'),
    ],
  },
  {
    id: 'new-zealand',
    country: 'New Zealand',
    city: 'Auckland',
    lat: -36.8509,
    lng: 174.7645,
    flag: '🇳🇿',
    role: 'Pacific clinical exchange',
    milestones: [
      milestone('auckland-lecture', '2017', 'Feb 2017', 'Guest Lecture', 'University of Auckland — Clinical Lecture', 'Auckland', 'Lecture on developmental language disorder in bilingual Pacific communities.'),
    ],
  },
  {
    id: 'south-africa',
    country: 'South Africa',
    city: 'Cape Town',
    lat: -33.9249,
    lng: 18.4241,
    flag: '🇿🇦',
    role: 'African continent forums',
    milestones: [
      milestone('capetown-congress', '2016', 'Oct 2016', 'Congress', 'African Communication Sciences Congress', 'Cape Town', 'Keynote on global perspectives in pediatric speech-language pathology.'),
    ],
  },
  {
    id: 'kenya',
    country: 'Kenya',
    city: 'Nairobi',
    lat: -1.2921,
    lng: 36.8219,
    flag: '🇰🇪',
    role: 'East Africa outreach',
    milestones: [
      milestone('nairobi-workshop', '2015', 'Mar 2015', 'Workshop', 'East Africa SLP Capacity Building Workshop', 'Nairobi', 'Training local clinicians in assessment and intervention for children with communication disorders.'),
    ],
  },
  {
    id: 'international',
    country: 'International',
    city: 'Virtual & Global Forums',
    lat: 15,
    lng: 20,
    flag: '🌍',
    role: 'IALP & global committees',
    milestones: [
      milestone('ialp-committee', '2025–2031', '2025', 'Committee', 'IALP Child Language Committee Member', 'International Association of Logopedics and Phoniatrics', 'International leadership in child language research and clinical practice standards.'),
      milestone('jslhr-board', '2023–2025', '2023', 'Research', 'Editorial Board, JSLHR Language Section', 'Journal of Speech, Language, and Hearing Research', 'Peer-reviewed research editorial work advancing language sciences globally.'),
    ],
  },
]

const LOCATION_HINTS = [
  { match: /riyadh|saudi|alfaisal|psych care|my school/i, id: 'saudi-arabia' },
  { match: /dubai|uae|emirates|abu dhabi/i, id: 'uae' },
  { match: /doha|qatar/i, id: 'qatar' },
  { match: /kuwait/i, id: 'kuwait' },
  { match: /bahrain|manama/i, id: 'bahrain' },
  { match: /egypt|cairo|eacsl/i, id: 'egypt' },
  { match: /jordan|amman/i, id: 'jordan' },
  { match: /lebanon|beirut/i, id: 'lebanon' },
  { match: /turkey|istanbul|türkiye/i, id: 'turkey' },
  { match: /morocco|casablanca/i, id: 'morocco' },
  { match: /edinburgh|scotland|london|queen margaret|uk|united kingdom|britain/i, id: 'united-kingdom' },
  { match: /germany|berlin/i, id: 'germany' },
  { match: /france|paris/i, id: 'france' },
  { match: /italy|rome/i, id: 'italy' },
  { match: /spain|barcelona|madrid/i, id: 'spain' },
  { match: /netherlands|amsterdam|holland/i, id: 'netherlands' },
  { match: /switzerland|geneva|zurich/i, id: 'switzerland' },
  { match: /sweden|stockholm/i, id: 'sweden' },
  { match: /norway|oslo/i, id: 'norway' },
  { match: /san jose|california(?!.*canada)/i, id: 'california' },
  { match: /canada|toronto|vancouver|montreal/i, id: 'canada' },
  { match: /brazil|são paulo|sao paulo/i, id: 'brazil' },
  { match: /mexico|mexico city/i, id: 'mexico' },
  { match: /japan|tokyo/i, id: 'japan' },
  { match: /korea|seoul/i, id: 'south-korea' },
  { match: /china|beijing|shanghai/i, id: 'china' },
  { match: /india|delhi|mumbai/i, id: 'india' },
  { match: /singapore/i, id: 'singapore' },
  { match: /malaysia|kuala lumpur/i, id: 'malaysia' },
  { match: /australia|sydney|melbourne/i, id: 'australia' },
  { match: /new zealand|auckland|wellington/i, id: 'new-zealand' },
  { match: /south africa|cape town|johannesburg/i, id: 'south-africa' },
  { match: /kenya|nairobi/i, id: 'kenya' },
  { match: /virtual|international|ialp|global|connect/i, id: 'international' },
  { match: /asha|washington|convention|usa|united states|america|u\.s\./i, id: 'united-states' },
]

export function inferMapLocationId(location = '') {
  const hint = LOCATION_HINTS.find(({ match }) => match.test(location))
  return hint?.id ?? 'saudi-arabia'
}

export function locationToAngles(lat, lng) {
  return {
    phi: Math.PI + (lng * Math.PI) / 180,
    theta: (-lat * Math.PI) / 360,
  }
}

export function buildMapLocationsWithEvents(activity) {
  const liveEvents = [
    ...(activity.upcoming ?? []).map((event) => ({ ...event, isUpcoming: true })),
    ...(activity.recent ?? []).map((event) => ({ ...event, isUpcoming: false })),
  ]

  return mapLocations.map((location) => {
    const linkedEvents = liveEvents.filter(
      (event) => inferMapLocationId(event.location) === location.id,
    )
    const allEvents = [...linkedEvents, ...location.milestones]

    return {
      ...location,
      eventCount: allEvents.length,
      events: allEvents,
    }
  })
}

export function getHomeBase() {
  return mapLocations.find((loc) => loc.id === 'saudi-arabia')
}
