/** Replace paths with real assets in /public/ when available */

export const images = {
  drWael: '/images/dr-wael.png',
  heroBanner:
    'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1920&q=80',
}

export const video = {
  youtubeId: 'EyIvs6DKl-Y',
  youtubeUrl: 'https://youtu.be/EyIvs6DKl-Y',
  title: 'A Message from Dr. Wael',
  description:
    'Learn about our approach to pediatric speech and language therapy — compassionate, evidence-based care for every child.',
}

export const profileDetails = {
  name: 'Dr. Wael A. Al-Dakroury',
  title: 'Speech-Language Pathologist',
  credentials: ['PhD', 'ASHA Fellow (2025)', 'CCC-SLP'],
  tagline: 'Every child has something to say — we help them find the words.',
  highlights: [
    { label: 'Experience', value: '30+ Years' },
    { label: 'Honor', value: 'ASHA Fellow 2025' },
    { label: 'Focus', value: 'Pediatric SLP' },
    { label: 'Reach', value: 'Global Leadership' },
  ],
  bio: [
    'Dr. Wael A. Al-Dakroury is an internationally recognized speech-language pathologist with over three decades of clinical, academic, and leadership experience. He is celebrated for advancing communication sciences through evidence-based pediatric care and meaningful collaboration with families worldwide.',
    'In 2025, he received ASHA Fellowship — the highest honor from the American Speech-Language-Hearing Association — recognizing his outstanding international contributions to the profession.',
    'He serves as Associate Professor at Alfaisal University and holds prominent global roles including ASHA International Ambassador and Chief Editor of ASHA SIG17 Perspectives (2026–2028). His clinical expertise centers on language disorders in children with ADHD and autism spectrum conditions.',
  ],
  roles: [
    'Associate Professor — Alfaisal University',
    'ASHA International Ambassador',
    'Chief Editor, ASHA SIG17 Perspectives (2026–2028)',
    'Pediatric language & neurodevelopmental disorders specialist',
  ],
}

export const therapyConcepts = [
  {
    id: 'screening',
    icon: 'screening',
    step: '01',
    title: 'Screening',
    subtitle: 'A simple first step',
    summary:
      'A brief, structured look at whether your child may benefit from further evaluation — without commitment to full therapy.',
    points: [
      'Quick review of speech, language, and communication milestones',
      'Helps decide if a full assessment is recommended',
      'Gentle and child-friendly — often the best starting point for concerned parents',
    ],
  },
  {
    id: 'counseling',
    icon: 'counseling',
    step: '02',
    title: 'Family Counseling',
    subtitle: 'Support every step of the way',
    summary:
      'Guidance for parents and caregivers so you understand your child\'s needs and can support progress at home.',
    points: [
      'Clear explanations of findings and next steps',
      'Practical strategies for daily communication at home',
      'Parents as active partners, not observers',
    ],
  },
  {
    id: 'assessment',
    icon: 'assessment',
    step: '03',
    title: 'Assessment',
    subtitle: 'Understanding your child\'s profile',
    summary:
      'A comprehensive, individualized evaluation when a deeper understanding of your child\'s communication is needed.',
    points: [
      'Standardized and clinical measures tailored to age and concerns',
      'Identifies strengths as well as areas for support',
      'Forms the foundation for a personalized therapy plan',
    ],
  },
  {
    id: 'treatment',
    icon: 'treatment',
    step: '04',
    title: 'Treatment',
    subtitle: 'Helping children find their voice',
    summary:
      'Evidence-based therapy sessions designed around your child\'s goals — measurable progress in communication and daily life.',
    points: [
      'Individualized goals based on assessment results',
      'Play-based and engaging methods for children',
      'Regular review of progress with families',
    ],
  },
]

export const expertisePillars = [
  {
    icon: 'globe',
    title: 'Global Expertise',
    description:
      'With leadership roles in international organizations, Dr. Wael brings global best practices and adapts them thoughtfully to the needs of families in the region.',
  },
  {
    icon: 'shield',
    title: 'Trusted by Professionals & Families',
    description:
      'Recognized internationally and trusted locally — a reference point for both families and specialists seeking high-quality pediatric communication care.',
  },
  {
    icon: 'science',
    title: 'Evidence-Based Care',
    description:
      'Every assessment and therapy plan is grounded in the latest international research and clinical standards — effective, measurable, never trial-and-error.',
  },
  {
    icon: 'heart',
    title: 'Family-Centered Approach',
    description:
      'Parents are not observers — they are partners. You receive clear guidance, practical strategies, and ongoing support beyond clinic sessions.',
  },
]

export const certificates = [
  {
    id: 'asha-fellow',
    title: 'ASHA Fellow',
    issuer: 'American Speech-Language-Hearing Association',
    year: '2025',
    featured: true,
    description:
      'The highest honor bestowed by ASHA — awarded to members who have made outstanding contributions to the discipline of communication sciences and disorders.',
  },
  {
    id: 'ccc-slp',
    title: 'Certificate of Clinical Competence (CCC-SLP)',
    issuer: 'ASHA — Speech-Language Pathology',
    year: 'Professional',
    description:
      'Internationally recognized clinical certification in speech-language pathology.',
  },
  {
    id: 'intl-ambassador',
    title: 'International Ambassador',
    issuer: 'American Speech-Language-Hearing Association',
    year: 'Present',
    description:
      'Representing ASHA globally and advancing cross-border professional collaboration.',
  },
  {
    id: 'sig17-editor',
    title: 'Chief Editor — SIG 17 Perspectives',
    issuer: 'ASHA Special Interest Group 17',
    year: '2026–2028',
    description:
      'Editorial leadership for global perspectives in communication sciences.',
  },
  {
    id: 'academic',
    title: 'Academic Leadership',
    issuer: 'Alfaisal University — Associate Professor',
    year: 'Present',
    description:
      'Teaching, mentoring, and advancing clinical research in speech-language pathology.',
  },
]
