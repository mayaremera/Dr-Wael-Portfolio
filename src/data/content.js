/** Site content — Dr. Wael A. Al-Dakroury, SLP (drwaelslp.com) */

export const site = {
  name: 'Dr. Wael A. Al-Dakroury',
  title: 'Speech-Language Pathologist',
  suffix: 'SLP',
  domain: 'drwaelslp.com',
  email: 'info@drwaelslp.com',
  phone: '+91 3309 62885',
  hours: 'Sunday – Thursday',
  languages: ['English', 'Arabic'],
  tagline: 'Every child has something to say — we help them find the words.',
  social: {
    twitter: 'https://twitter.com/',
    instagram: 'https://instagram.com/',
    linkedin: 'https://linkedin.com/',
  },
}

export const images = {
  drWael: '/images/dr-wael.jpeg',
  heroBanner: '/images/hero1.jpeg',
  family: '/images/family.jpg',
  screening: '/images/screening.jpg',
  familyCounseling: '/images/familycoun.jpeg',
  assessment: '/images/assesment.jpeg',
  treatment: '/images/treatment.jpeg',
  // swap to hero2.jpeg if you prefer that image:
  // heroBanner: '/images/hero2.jpeg',
}

export const whyChooseUs = {
  label: 'Why Choose Dr. Wael',
  title: 'Why Families Choose Dr. Wael Al-Dakroury',
  paragraphs: [
    'Every child is treated as unique—with personalized care, clear answers about their condition, and therapy focused on real progress in communication and daily life.',
    'With 30+ years of experience, every decision is guided by expertise, not guesswork. Parents are active partners, supported with practical guidance every step of the way.',
  ],
}

export const video = {
  youtubeId: 'EyIvs6DKl-Y',
  youtubeUrl: 'https://youtu.be/EyIvs6DKl-Y',
  poster: '/images/video1.jpeg',
  title: 'Center for Autism Research — Award Ceremony',
  paragraphs: [
    'This video captures Dr. Wael Al-Dakroury at the Center for Autism Research award ceremony — recognition of his dedication to children with autism, their families, and the field of communication sciences.',
  ],
}

export const promoVideo = {
  src: '/videos/vidsection.mp4',
  label: 'Transform Communication',
  titleLine1: 'Every child deserves',
  titleHighlight: 'a voice.',
  description:
    '30+ years of expert speech-language care — bilingual, family-centered, and built on real progress for children across autism, ADHD, language, and speech.',
  cta: { label: 'Book a Consultation', href: '#contact' },
  secondary: { label: 'Explore Services', href: '#approach' },
}

export const profileDetails = {
  name: 'Dr. Wael A. Al-Dakroury',
  title: 'Speech-Language Pathologist (SLP)',
  credentials: ['PhD', 'ASHA Fellow (2025)', 'CCC-SLP'],
  tagline: site.tagline,
  highlights: [
    { label: 'Experience', value: '30+ Years' },
    { label: 'Honor', value: 'ASHA Fellow 2025' },
    { label: 'Languages', value: 'English & Arabic' },
    { label: 'Reach', value: 'Global Leadership' },
  ],
  bio: [
    'Dr. Wael is an internationally recognized speech-language pathologist with 30+ years of experience. He directs the Communication Disorders Department at Psych Care Complex, Riyadh, serves as Associate Professor at Alfaisal University, and was named ASHA Fellow in 2025.',
    'He offers bilingual care in English and Arabic, specializing in autism, ADHD, language disorders, speech sound disorders, and fluency — with evidence-based, family-centered support at every step.',
  ],
  education: [
    'PhD — Queen Margaret University, Edinburgh',
    'MA — San Jose State University, California',
  ],
  roles: [
    'Director, Communication Disorders Dept. — Psych Care Complex, Riyadh',
    'Associate Professor, Faculty of Medicine — Alfaisal University, Riyadh',
    'ASHA International SLP Ambassador (2024–2026)',
    'Chief Editor, ASHA SIG17 Perspectives (2026–2028)',
    'Member, IALP Child Language Committee (2025–2031)',
    'Honorary President — EACSL (Egyptian Association for Comm. Sciences)',
    'Editorial Board, JSLHR Language Section (2023–2025)',
  ],
}

export const therapyConcepts = [
  {
    id: 'screening',
    image: images.screening,
    title: 'Screening',
    subtitle: 'A Simple First Step',
    summary:
      'Not sure if your child needs speech therapy? A quick screening is the best place to start.',
  },
  {
    id: 'counseling',
    image: images.familyCounseling,
    title: 'Family Counseling',
    subtitle: 'Support Every Step of the Way',
    summary:
      'Guidance you can trust. We know how important parents are in every child\'s progress.',
  },
  {
    id: 'assessment',
    image: images.assessment,
    title: 'Assessment',
    subtitle: 'Understanding Your Child\'s Unique Profile',
    summary:
      'If a deeper look is needed, we\'ll do a full, child-friendly assessment.',
  },
  {
    id: 'treatment',
    image: images.treatment,
    title: 'Treatment',
    subtitle: 'Helping Children Find Their Voice',
    summary:
      'Once therapy begins, your child\'s sessions will be designed just for them.',
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
    id: 'intl-achievement',
    title: 'Certificate of Recognition — Outstanding International Achievement',
    issuer: 'American Speech-Language-Hearing Association',
    year: '2023',
    description:
      'Recognized for exceptional international contributions to speech-language pathology and communication sciences.',
  },
  {
    id: 'asha-ace',
    title: 'ASHA ACE Awards',
    issuer: 'American Speech-Language-Hearing Association',
    year: '2007–2025',
    description:
      '10+ ASHA ACE Awards spanning 2007 to 2025 — reflecting sustained commitment to continuing education and clinical excellence.',
  },
]

export const leadershipRoles = [
  {
    year: '2024–2026',
    title: 'ASHA International SLP Ambassador',
    org: 'American Speech-Language-Hearing Association',
    note: 'Global advocacy and professional collaboration',
  },
  {
    year: '2026–2028',
    title: 'Chief Editor',
    org: 'ASHA SIG17 Perspectives',
    note: 'Editorial leadership in communication sciences',
  },
  {
    year: '2025–2031',
    title: 'Member',
    org: 'IALP Child Language Committee',
    note: 'International leadership in child language research and practice',
  },
  {
    year: 'Present',
    title: 'Honorary President',
    org: 'EACSL — Egyptian Association for Comm. Sciences',
    note: 'Honoring contributions to communication sciences in the region',
  },
  {
    year: '2023–2025',
    title: 'Editorial Board Member',
    org: 'JSLHR Language Section',
    note: 'Peer-reviewed research in language sciences',
  },
]

export const clinicalSpecializations = [
  {
    id: 'autism',
    category: 'Autism',
    title: 'Autism Spectrum Disorder',
    image: '/images/treatment.jpeg',
    description:
      'Support for verbal and non-verbal children, including PECS and PODD augmentative communication systems.',
  },
  {
    id: 'adhd',
    category: 'ADHD',
    title: 'ADHD',
    image: '/images/screening.jpg',
    description:
      'Addressing multi-step direction difficulties and the links between attention, executive function, and language.',
  },
  {
    id: 'language',
    category: 'Language',
    title: 'Developmental Language Disorder',
    image: '/images/assesment.jpeg',
    description:
      'Bilingual expertise in English and Arabic, with accurate DLD diagnosis and individualized intervention.',
  },
  {
    id: 'speech',
    category: 'Speech',
    title: 'Speech Sound Disorder',
    image: '/images/family.jpg',
    description:
      'Improving intelligibility, confidence, and academic readiness through targeted speech intervention.',
  },
  {
    id: 'apraxia',
    category: 'Apraxia',
    title: 'Childhood Apraxia of Speech (CAS)',
    image: '/images/familycoun.jpeg',
    description:
      'A specialized approach for a frequently misdiagnosed condition — motor planning and speech production.',
  },
  {
    id: 'fluency',
    category: 'Fluency',
    title: 'Fluency Disorders & Stuttering',
    image: '/images/treatment.jpeg',
    description:
      'Integrative, person-centered treatment that respects each child\'s experience and communication goals.',
  },
  {
    id: 'bilingual',
    category: 'Language',
    title: 'Language Support',
    image: '/images/family.jpg',
    description:
      'Bilingual services in English and Arabic — supporting communication development across both languages.',
  },
]

export const testimonials = [
  {
    id: 'shackleton',
    name: 'Paul Shackleton',
    location: '',
    image: '/images/paul.jpeg',
    quote:
      'Dr Wael worked with my profoundly autistic non-verbal son between 2013-15. Since leaving Saudi Arabia we have employed a number of other speech language pathologists in the UK and Australia, but we have been unable to find any who have matched Dr Wael\'s dedication, commitment, and professional skills. Other therapists have struggled to hold his attention and deal with his considerable challenging behaviors and aggression. What impressed me most about Dr Wael was his ability to engage my child in meaningful learning. Before Dr Wael worked with my son, he would never maintain eye contact with other people. Without Dr Wael\'s interventions, I doubt that my son would have been able to develop the ability to communicate his needs effectively using the PECS and PODD systems. I\'m sure that Dr Wael\'s therapy has made a lasting and significant improvement to my son\'s quality of life.',
  },
  {
    id: 'alolabi',
    name: 'Dr. Shaima AlOlabi',
    location: "Faris's Mom",
    image: '/images/drshayma.jpeg',
    quote:
      'Throughout my journey with autism, I have met many professionals in all different kinds of fields and specialities, visiting many centres and clinics to look for the best services and care for my precious son. It has been, and remains, a struggle to find a dedicated professional to rely on. As my son struggles with communication, speech therapy is crucial for him to improve his functional communication, reduce frustration, and enhance social interaction. I was referred to Dr. AlDakroury a couple of years ago, and I\'m confident to say that it was one of the best referrals I\'ve ever had for my son. His expertise, knowledge, care, attention, and dedication are all really what I needed for my son. He isn\'t only working with him on speech and communication; he\'s also provided our family with the gift of better understanding and connection. Thank you, Dr. AlDakroury, for your tireless dedication and for believing in him.',
  },
  {
    id: 'yahia',
    name: "Yahia's Family",
    location: '',
    image: '/images/yehias.jpeg',
    quote:
      'Working with Dr. Wael has been a very positive and professional experience for our family. Throughout our journey, we have seen remarkable progress in our son\'s development. His cognitive abilities have improved noticeably, his social skills have improved significantly, and his speech has developed significantly over time. Dr. Wael\'s guidance, support, and professional approach gave us confidence and reassurance during every step of the process. We are truly grateful for the care and dedication provided, and we highly recommend his services to families seeking support and meaningful progress for their children.',
  },
  {
    id: 'alruwais',
    name: 'Mrs. Mary Alruwais',
    location: 'Director of My School, Riyadh',
    image: '/images/mrsmary.jpeg',
    quote:
      'Working with Dr. Wael Al-Dakroury has been an outstanding experience for our school community. His professionalism, expertise, and dedication to supporting students\' communication and language development have had a positive impact on both students and staff alike. Dr. Wael consistently demonstrates excellent collaboration with educational teams, providing thoughtful guidance, practical strategies, and individualized support that contribute meaningfully to student success and wellbeing. His ability to work effectively with teachers, families, and multidisciplinary teams reflects a high level of professionalism and genuine care for children\'s development. We greatly value his contributions to our schools and highly recommend his services to educational institutions and families seeking high-quality speech and language support.',
  },
  {
    id: 'abo-yousif',
    name: 'Abo Yousif',
    location: '',
    image: '/images/aboyousif.jpeg',
    quote:
      'When our son was 3, we began noticing that he had limited eye contact, communication-related difficulties, and was only using a few words. Like any parents, we felt worried, confused, and unsure of what to do next. Meeting Dr. Wael during that time gave us a real sense of relief. He listened patiently, understood our concerns, and explained everything in a calm, clear, and reassuring way. What truly stood out was not only his assessment but also the way he worked with our son in each session. His sessions were thoughtful, engaging, and tailored to our son\'s specific needs. He knew how to make him feel comfortable and safe, which helped him respond better and open up little by little. Every session felt purposeful, with clear progress, practical strategies, and guidance that we could continue at home. Over time, we saw real changes. Our son became more confident, improved in communication, and started connecting better with others. We are deeply grateful for the care, patience, and consistency throughout the journey. For any parent feeling worried about communication or developmental concerns, I can honestly say that finding the right support early can make all the difference.',
  },
]

export const footerServices = [
  'Screening',
  'Assessment',
  'Family Counseling',
  'Therapy',
]
