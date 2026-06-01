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
  footerTagline: 'Helping children communicate, connect, and thrive.',
  social: {
    facebook: 'https://facebook.com/',
    instagram: 'https://instagram.com/',
    youtube: 'https://youtube.com/',
    linkedin: 'https://linkedin.com/',
    twitter: 'https://twitter.com/',
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
}

export const drWaelActivity = {
  label: 'In the Field',
  title: 'Dr. Wael\'s Month & Year',
  description:
    'Conferences, lectures, meetings, and professional engagements — a snapshot of where Dr. Wael is contributing now and the highlights from recent months.',
  upcoming: [
    {
      id: 'alfaisal-lecture',
      period: 'May 2026',
      date: '15 May',
      type: 'Guest Lecture',
      title: 'Developmental Language Disorder in Bilingual Children',
      location: 'Alfaisal University, Riyadh',
      image: images.assessment,
      imageAlt: 'Clinical assessment session with a child and speech-language pathologist',
      note: 'Clinical lecture for faculty and graduate students on DLD assessment and intervention across Arabic and English.',
    },
    {
      id: 'asha-panel',
      period: 'June 2026',
      date: '8–10 Jun',
      type: 'Conference',
      title: 'ASHA Connect — Panel on Culturally Responsive Assessment',
      location: 'Virtual / International',
      image: images.drWael,
      imageAlt: 'Dr. Wael Al-Dakroury presenting at a professional conference',
      note: 'Discussant on fair assessment practices when standardized tools are not culturally appropriate.',
    },
  ],
  recent: [
    {
      id: 'autism-award',
      period: 'April 2026',
      date: '22 Apr',
      type: 'Recognition',
      title: 'Center for Autism Research — Award Ceremony',
      location: 'Riyadh',
      video: '/videos/event1.mp4',
      imageAlt: 'Center for Autism Research award ceremony honoring Dr. Wael Al-Dakroury',
      note: 'Honored for outstanding contributions to children with autism and the field of communication sciences.',
    },
    {
      id: 'psych-care-meeting',
      period: 'March 2026',
      date: '12 Mar',
      type: 'Leadership Meeting',
      title: 'Communication Disorders Department — Clinical Review',
      location: 'Psych Care Complex, Riyadh',
      image: images.familyCounseling,
      imageAlt: 'Multidisciplinary team meeting at Psych Care Complex',
      note: 'Led multidisciplinary review of caseload progress, therapy protocols, and family engagement strategies.',
    },
    {
      id: 'school-outreach',
      period: 'February 2026',
      date: '3 Feb',
      type: 'School Visit',
      title: 'Collaborative SLP Workshop for Educators',
      location: 'My School, Riyadh',
      image: images.screening,
      imageAlt: 'Speech-language pathologist leading a workshop with educators',
      note: 'Training session with teachers on supporting students with speech and language needs in the classroom.',
    },
    {
      id: 'cas-seminar',
      period: 'January 2026',
      date: '18 Jan',
      type: 'Professional Seminar',
      title: 'Childhood Apraxia of Speech — Misdiagnosis & Motor Planning',
      location: 'Riyadh',
      image: images.family,
      imageAlt: 'Professional seminar on childhood apraxia of speech',
      note: 'Presented on accurate CAS identification and evidence-based intervention approaches.',
    },
  ],
}

export const hopeGallery = {
  label: 'Our Impact',
  title: 'Expert Care in Every Session',
  images: [
    {
      src: '/images/gallery/hope-therapy.png',
      alt: 'Speech-language pathologist guiding a child through a one-on-one oral motor exercise during therapy',
      eyebrow: 'Personalized therapy',
    },
    {
      src: '/images/gallery/hope-2.png',
      alt: 'Child engaged in a speech therapy session with picture cards',
      eyebrow: 'Every Session counts',
    },
    {
      src: '/images/familycoun.jpeg',
      alt: 'Speech-language pathologist meeting with parents and their child to explain progress and discuss the care plan',
      eyebrow: 'Guidance for parents',
    },
  ],
}

export const promoVideo = {
  src: '/videos/vidsection.mp4',
  sectionLabel: 'Featured Presentation',
  sectionTitle: 'When Language Doesn\'t Develop as Expected',
  label: 'Understanding DLD',
  titleHighlight: 'Understanding DLD in Children',
  description:
    'Explore how DLD affects language development, why assessment fails without culturally appropriate tools, and why reading comprehension depends on background knowledge—not decoding alone.',
  cta: { label: 'Book a Consultation', href: '#contact' },
  secondary: { label: 'Explore Services', href: '#approach' },
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
  'Assessment',
  'Therapy',
  'Parent Coaching',
  'School Collaboration',
]

export const footerQuickLinks = [
  { label: 'About', href: '/about-me' },
  { label: 'Services', href: '/services' },
  { label: 'Cases', href: '/cases' },
  { label: 'Video / Gallery', href: '/video-gallery' },
  { label: 'In the Field', href: '/in-the-field' },
  { label: 'Contact', href: '/contact' },
]
