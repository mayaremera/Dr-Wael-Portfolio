/** Site content — Dr. Wael A. Al-Dakroury, SLP (drwaelslp.com) */

import heroMobileVertical from '../assets/hero-mobile-vertical.png'

export const site = {
  name: 'Dr. Wael A. Al-Dakroury',
  title:
    'Consultant Bilingual Speech Language Pathologist & Associate Professor in Speech Language Pathology',
  suffix: 'SLP',
  domain: 'drwaelslp.com',
  email: 'info@drwaelslp.com',
  phone: '+1 913 309 6288',
  languages: ['English', 'Arabic', 'Spanish'],
  tagline: 'Every child has something to say. We help them find the words.',
  footerTagline: 'Helping children communicate, connect, and thrive.',
  social: {
    facebook: 'https://www.facebook.com/share/18yWpgqVwW/?mibextid=wwXIfr',
    threads: 'https://www.threads.com/@dr.waelaldakroury?invite=0',
    linkedin: 'https://www.linkedin.com/in/waelslp?utm_source=share_via&utm_content=profile&utm_medium=member_ios',
    twitter: 'https://x.com/waelslp?s=11&t=dyMPABoxYnqU0IAoWfilIQ',
  },
  academic: {
    googleScholar: 'https://scholar.google.com/citations?user=EEoUMHMAAAAJ&hl=en',
    researchGate: 'https://www.researchgate.net/profile/Wael-Aldakroury?ev=hdr_xprf',
    orcid: 'https://orcid.org/my-orcid?orcid=0000-0003-3158-6414',
    orcidId: '0000-0003-3158-6414',
  },
}

export const images = {
  drWael: '/images/dr-wael.jpeg',
  aboutHero: '/images/aboutmesection.jpeg',
  servicesHero: '/images/services-hero-v3.png',
  heroBanner: '/images/hero1.jpeg',
  heroMobileVertical,
  family: '/images/family.jpg',
  whyTrust: '/images/whytrust.jpg',
  familyTraining: '/images/familytraining.jpg',
  screening: '/images/screening.jpg',
  familyCounseling: '/images/familycoun.jpeg',
  assessment: '/images/assesment.jpeg',
  treatment: '/images/treatment.jpeg',
  inTheFieldHero: '/images/inthefield-scholar.png',
  galleryHeading: [
    '/images/gallery-heading-1.png',
    '/images/gallery-heading-2.png',
    '/images/gallery-heading-3.png',
    '/images/gallery-heading-4.png',
  ],
}

export const drWaelActivity = {
  label: 'In the Field',
  title: 'Dr. Wael\'s Month & Year',
  description:
    'Conferences, lectures, meetings, and professional engagements: a snapshot of where Dr. Wael is contributing now and the highlights from recent months.',
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
      title: 'ASHA Connect: Panel on Culturally Responsive Assessment',
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
      title: 'Center for Autism Research: Award Ceremony',
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
      title: 'Communication Disorders Department: Clinical Review',
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
      title: 'Childhood Apraxia of Speech: Misdiagnosis & Motor Planning',
      location: 'Riyadh',
      image: images.family,
      imageAlt: 'Professional seminar on childhood apraxia of speech',
      note: 'Presented on accurate CAS identification and evidence-based intervention approaches.',
    },
  ],
}

const gridMedia = (filename, type) => ({
  type,
  src: `/images/grid/${filename}`,
  alt:
    type === 'video'
      ? 'Event clip from a professional engagement'
      : 'Speech-language pathology practice moment',
})

export const mediaGallery = {
  label: 'Gallery',
  title: 'Snapshots from Sessions & Events',
  description:
    'Photos and clips from clinical work, training sessions, and professional events — open any moment to view it full size.',
  items: [
    gridMedia('WhatsApp Video 2026-05-27 at 62.49.01 PM.mp4', 'video'),
    gridMedia('WhatsApp Video 2026-05-27 at 6.49.00 PM.mp4', 'video'),
    gridMedia('WhatsApp Image 2026-05-27 at 6.238.47 PM.jpeg', 'image'),
    gridMedia('WhatsApp Image 2026-05-27 at 6.49.015 PM.jpeg', 'image'),
    gridMedia('WhatsApp Image 2026-05-27 at 62.49.01 PM.jpeg', 'image'),
    gridMedia('WhatsApp Image 2026-05-27 at 6.49.013 PM.jpeg', 'image'),
    gridMedia('WhatsApp Image 2026-05-27 at 6.49.041 PM.jpeg', 'image'),
    gridMedia('WhatsApp Image 2026-05-27 at 151516.49.02 PM.jpeg', 'image'),
    gridMedia('WhatsApp Im1313age 2026-05-27 at 6.49.02 PM.jpeg', 'image'),
    gridMedia('WhatsApp Imag1313e 2026-05-27 at 6.49.03 PM.jpeg', 'image'),
    gridMedia('WhatsApp13 Image 2026-05-27 at 6.49.03 PM.jpeg', 'image'),
    gridMedia('WhatsApp Image 2026-1305-27 at 6.49.03 PM.jpeg', 'image'),
    gridMedia('WhatsApp Image 202644-05-27 at 6.49.03 PM.jpeg', 'image'),
    gridMedia('WhatsApp Image 2026-05-27 at 6.49.0135 PM.jpeg', 'image'),
    gridMedia('WhatsApp Image 2026-05-27 at 6.49.014144 PM.jpeg', 'image'),
    gridMedia('WhatsApp Image 2026-05-27 at 6.491414.04 PM.jpeg', 'image'),
    gridMedia('WhatsApp Image 201226-05-27 at 6.49.01 PM.jpeg', 'image'),
    gridMedia('WhatsApp Image 201326-05-27 at 6.49.05 PM.jpeg', 'image'),
    gridMedia('WhatsApp Image 2026-05-2147 at 6.49.05 PM.jpeg', 'image'),
    gridMedia('WhatsApp Image 2026-05-27 14at 6.49.05 PM.jpeg', 'image'),
    gridMedia('WhatsApp Image 21026-05-27 at 6.49.05 PM.jpeg', 'image'),
    gridMedia('WhatsApp Image 2026-05-27 6t 6.38.48 PM.jpeg', 'image'),
    gridMedia('WhatsApp Image 212026-05-27 at 6.38.48 PM.jpeg', 'image'),
    gridMedia('Wh88atsApp Image 2026-05-27 at 6.43.18 PM.jpeg', 'image'),
    gridMedia('WhatsAp5p Image 2026-05-27 at 6.43.18 PM.jpeg', 'image'),
    gridMedia('WhatsApp31313 Image 2026-05-27 at 6.49.02 PM.jpeg', 'image'),
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
    'Explore how DLD affects language development, why assessment fails without culturally appropriate tools, and why reading comprehension depends on background knowledge, not decoding alone.',
  cta: { label: 'Book a Consultation', href: '#contact' },
  secondary: { label: 'Explore Services', href: '#approach' },
}

export const whyChooseUs = {
  label: 'Why Choose Dr. Wael',
  title: 'Why Families Choose Dr. Wael Al-Dakroury',
  paragraphs: [
    'Every child is treated as unique, with personalized care, clear answers about their condition, and therapy focused on real progress in communication and daily life.',
    'With 30+ years of experience, every decision is guided by expertise, not guesswork. Parents are active partners, supported with practical guidance every step of the way.',
  ],
}

export const video = {
  youtubeId: 'EyIvs6DKl-Y',
  youtubeUrl: 'https://youtu.be/EyIvs6DKl-Y',
  poster: '/images/watchvideo.jpeg',
  title: 'Center for Autism Research — Award Ceremony',
  paragraphs: [
    'This video captures Dr. Wael Al-Dakroury at the Center for Autism Research award ceremony — recognition of his dedication to children with autism, their families, and the field of communication sciences.',
  ],
}

export const featuredVideo2 = {
  youtubeId: video.youtubeId,
  youtubeUrl: video.youtubeUrl,
  poster: video.poster,
  title: video.title,
  paragraphs: [...video.paragraphs],
}

export const profileDetails = {
  name: 'Dr. Wael A. Al-Dakroury',
  title: site.title,
  credentials: ['Ph.D.', 'CCC-SLP', 'ASHA Fellow (F-ASHA)'],
  tagline: site.tagline,
  highlights: [
    { label: 'Experience', value: '30+ Years' },
    { label: 'Honor', value: 'ASHA Fellow' },
    { label: 'Languages', value: 'English & Arabic' },
    { label: 'Reach', value: 'Global Leadership' },
  ],
  bio: [
    'Dr. Wael is an internationally recognized speech-language pathologist with 30+ years of experience. He directs the Communication Disorders Department at Psych Care Complex, Riyadh, serves as Associate Professor at Alfaisal University, and was named ASHA Fellow.',
    'He offers bilingual care in English and Arabic, specializing in autism, ADHD, language disorders, speech sound disorders, and fluency, with evidence-based, family-centered support at every step.',
  ],
  bioExtended: [
    'Dr. Wael is an internationally recognized speech-language pathologist with 30+ years of experience. He directs the Communication Disorders Department at Psych Care Complex, Riyadh, and serves as Associate Professor at Alfaisal University.',
    'Named ASHA Fellow (F-ASHA) — one of the highest honors awarded by the American Speech-Language-Hearing Association — he is also a clinical educator in graduate Speech-Language Pathology programs.',
    'He offers bilingual care in English and Arabic, specializing in autism, ADHD, language disorders, speech sound disorders, and fluency, with evidence-based, family-centered support at every step.',
    'As an international speaker, consultant, and professional mentor, he collaborates with universities, healthcare organizations, and professional associations worldwide — advancing communication sciences through clinical excellence, education, and leadership.',
    'Communication connects people, families, cultures, and communities. His mission is to empower individuals through communication and advance the profession of Speech-Language Pathology through clinical excellence, education, leadership, and international collaboration.',
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

export const careerImpact = {
  label: 'Career Impact',
  title: 'A Career Dedicated to Communication, Education, and Impact',
  stats: [
    {
      value: '30+',
      label: 'Years of Experience',
      detail: 'Dedicated experience in Speech-Language Pathology across clinical, academic, and international settings.',
    },
    {
      value: '40,000+',
      label: 'Therapy Sessions',
      detail: 'Speech and language therapy sessions delivered across diverse clinical settings.',
    },
    {
      value: '3,000+',
      label: 'Diagnostic Evaluations',
      detail: 'Comprehensive diagnostic evaluations completed for children and families.',
    },
    {
      value: '50+',
      label: 'Nationalities Served',
      detail: 'Children and families representing more than fifty nationalities worldwide.',
    },
  ],
}

export const clinicalExpertise = {
  label: 'Clinical Expertise',
  title: 'Evidence-based care tailored to every child and family',
  intro:
    'For more than three decades, I have worked with children, families, schools, and healthcare teams to support communication development and improve quality of life. My clinical practice combines evidence-based intervention with a family-centered approach tailored to each individual\'s strengths, needs, and cultural background.',
  areas: [
    { name: 'Developmental Language Disorder', abbr: 'DLD' },
    { name: 'Speech Sound Disorders', abbr: 'SSD' },
    { name: 'Autism Spectrum Disorder', abbr: 'ASD' },
    { name: 'Childhood Stuttering & Fluency Disorders' },
    { name: 'Social Communication & Pragmatic Language Disorders' },
    { name: 'Bilingual & Multilingual Language Development' },
    { name: 'Language Learning Difficulties' },
    { name: 'School-Age Language & Literacy Challenges' },
    { name: 'Parent Coaching & Family Training' },
  ],
}

export const academicLeadership = {
  label: 'Academic Leadership',
  title: 'Preparing the next generation of speech-language pathologists',
  intro:
    'As an educator and academic leader, I am committed to preparing the next generation of Speech-Language Pathologists through rigorous training, clinical supervision, mentorship, and professional development.',
  interests: [
    'Developmental Language Disorder',
    'Multilingualism & Language Disorders',
    'Autism Spectrum Disorder',
    'Speech Sound Disorders',
    'Pediatric Fluency Disorders',
    'Clinical Assessment & Diagnosis',
    'Evidence-Based Practice',
    'Clinical Supervision',
  ],
}

export const internationalLeadership = {
  label: 'International Leadership & Professional Service',
  title: 'Advancing the profession on a global and national stage',
  intro:
    'International appointments, national program leadership, ASHA-accredited training, accreditation standards, editorial service, and scientific committee work — spanning organizations from ASHA and WHO to Saudi national initiatives.',
  summary:
    'Current and recent leadership roles include ASHA Fellow (F-ASHA), Editor of Perspectives SIG 17, ASHA International Ambassador, Member of the IALP Child Language Committee, and recipient of the ASHA Certificate of Recognition for International Achievement.',
}

export const speakingTraining = {
  label: 'Speaking, Training & Consultation',
  title: 'Professional development for clinicians and institutions',
  intro:
    'I regularly provide professional development workshops, keynote presentations, conference lectures, and consultation services for universities, healthcare organizations, schools, and professional associations.',
  topics: [
    'Developmental Language Disorder',
    'Multilingual Assessment & Intervention',
    'Autism Spectrum Disorder',
    'Speech Sound Disorders',
    'Pediatric Stuttering',
    'Aphasia',
    'Clinical Supervision',
    'Evidence-Based Practice',
    'Artificial Intelligence in Speech-Language Pathology',
    'Program Development',
  ],
}

export const professionalMembership = {
  label: 'Professional Membership',
  title: 'Affiliated with leading speech-language & autism organizations',
  intro:
    'Active membership across international, national, and regional professional bodies — reflecting a sustained commitment to the highest standards in communication sciences and clinical practice.',
  organizations: [
    {
      id: 'asha',
      abbr: 'ASHA',
      name: 'American Speech-Language-Hearing Association',
      scope: 'International',
    },
    {
      id: 'ialp',
      abbr: 'IALP',
      name: 'International Association of Logopedics and Phoniatrics',
      scope: 'International',
    },
    {
      id: 'asa',
      abbr: 'ASA',
      name: 'Autism Society of America',
      scope: 'International',
    },
    {
      id: 'ssspa',
      abbr: 'SSSPA',
      name: 'Saudi Society of Speech-Language Pathology and Audiology',
      scope: 'National',
    },
    {
      id: 'espl',
      abbr: 'ESPL',
      name: 'Egyptian Society of Phoniatrics and Logopedics',
      scope: 'Regional',
    },
  ],
}

export const globalImpact = {
  label: 'Global Impact',
  title: 'Communication that connects cultures and communities',
  paragraphs: [
    'Communication connects people, families, cultures, and communities. Throughout my career, I have worked across multiple countries and healthcare systems, collaborating with professionals from diverse backgrounds and serving families representing more than fifty nationalities.',
  ],
  mission:
    'My mission is to empower individuals through communication and to advance the profession of Speech-Language Pathology through clinical excellence, education, leadership, and international collaboration.',
}

export const professionalServices = {
  label: 'Work With Dr. Wael',
  title: 'Collaborate on communication, education, and impact',
  intro:
    'Whether you are seeking clinical consultation, professional training, conference presentations, academic collaboration, or expert guidance in Speech-Language Pathology, I welcome opportunities to work with individuals and organizations that share a commitment to communication and lifelong learning.',
  availableFor: [
    {
      title: 'Professional Consultation',
      description: 'Expert clinical guidance for complex cases, program design, and evidence-based practice.',
    },
    {
      title: 'Speaking Engagements',
      description: 'Keynotes, conference lectures, and panel discussions for professional audiences.',
    },
    {
      title: 'Workshops & Training Programs',
      description: 'Hands-on professional development for clinicians, educators, and healthcare teams.',
    },
    {
      title: 'University Lectures',
      description: 'Graduate-level teaching, guest lectures, and academic collaboration.',
    },
    {
      title: 'Clinical Supervision & Mentorship',
      description: 'Supervision and mentorship for emerging and practicing speech-language pathologists.',
    },
    {
      title: 'International Collaboration Projects',
      description: 'Cross-border partnerships advancing communication sciences and clinical standards.',
    },
  ],
}

export const careerTimeline = [
  {
    id: 'phd',
    year: 'Doctorate',
    title: 'PhD in Speech-Language Pathology',
    org: 'Queen Margaret University, Edinburgh',
    type: 'education',
  },
  {
    id: 'ma',
    year: 'Graduate',
    title: 'MA in Speech-Language Pathology',
    org: 'San Jose State University, California',
    type: 'education',
  },
  {
    id: 'director',
    year: 'Present',
    title: 'Director, Communication Disorders Department',
    org: 'Psych Care Complex, Riyadh',
    type: 'clinical',
  },
  {
    id: 'professor',
    year: 'Present',
    title: 'Associate Professor, Faculty of Medicine',
    org: 'Alfaisal University, Riyadh',
    type: 'academic',
  },
  {
    id: 'asha-fellow',
    year: '2025',
    title: 'ASHA Fellow',
    org: 'American Speech-Language-Hearing Association',
    type: 'honor',
  },
]

export const certificatePlaceholders = [
  '/images/certificates/certificate-1.png',
  '/images/certificates/certificate-2.png',
]

export const trustedCompanies = {
  title: 'Affiliations & recognized training',
  subtitle:
    'Clinical leadership at Psych Care Complex and Alfaisal University, global roles with ASHA and IALP, and specialized certifications from world-leading therapy programs.',
  viewAllLabel: 'Full biography & credentials',
  viewAllHref: '/about-me',
  companies: [
    {
      id: 'asha',
      name: 'American Speech-Language-Hearing Association',
      shortName: 'ASHA',
      role: 'Ph.D., CCC-SLP, ASHA Fellow, International SLP Ambassador, and SIG 17 Committee Member.',
      logo: '/images/trusted1.jpg',
    },
    {
      id: 'hanen',
      name: 'The Hanen Centre',
      shortName: 'Hanen',
      role: 'Certified in TalkAbility, More Than Words, It Takes Two to Talk, Target Words, and Learning Language and Loving It.',
      logo: '/images/trusted2.png',
    },
    {
      id: 'pecs',
      name: 'Picture Exchange Communication System',
      shortName: 'PECS',
      role: 'PECS Level 1 and Advanced Level certified.',
      logo: '/images/trusted4.png',
    },
    {
      id: 'lsvt',
      name: 'LSVT Global',
      shortName: 'LSVT LOUD',
      role: 'LSVT LOUD for Parkinson\'s, children, and other populations.',
      logo: '/images/trusted5.png',
    },
    {
      id: 'ialp',
      name: 'International Association of Communication Sciences and Disorders',
      shortName: 'IALP',
      role: 'Child Language Committee member, 2025 to 2031.',
      logo: '/images/trusted6.png',
    },
    {
      id: 'prompt',
      name: 'PROMPT Institute',
      shortName: 'PROMPT',
      role: 'PROMPT certified — integrative speech motor therapy for speech production disorders.',
      logo: '/images/trusted7.png',
    },
    {
      id: 'cambridge',
      name: 'University of Cambridge',
      shortName: 'Cambridge',
      role: 'Research affiliation with the Autism Research Centre, advancing evidence-based understanding of communication and neurodevelopment.',
      logo: '/images/trusted8-combined.png',
      logoFit: 'cover',
    },
  ],
}

export const speechLanguageServices = {
  title: 'Speech & Language Services',
  tagline: 'Every child deserves to be understood.',
  intro:
    'Our speech-language services are here to help your child express themselves clearly and confidently—at home, in school, and in everyday life.',
  familyBenefits: [
    'Certified, experienced speech-language pathologists',
    'Friendly, supportive atmosphere for kids and families',
    'Personalized, evidence-based therapy plans',
    'Practical tips for home and school success',
  ],
}

/** Fixed page hero at the top of /services — not editable in the dashboard. */
export const servicesPageHero = {
  eyebrow: 'Services',
  title: 'Speech & Language Services',
}

export const therapyConcepts = [
  {
    id: 'screening',
    image: images.screening,
    title: 'Screening',
    subtitle: 'A Simple First Step',
    summary:
      'Not sure if your child needs speech therapy? A quick screening is the best place to start.',
    paragraphs: [
      'In just a few minutes, we gently observe how your child communicates—no stress, no pressure.',
      'If we notice anything that could use extra attention, we\'ll suggest a full evaluation to understand your child\'s needs in more detail.',
    ],
    ctaLabel: 'Book a Session',
  },
  {
    id: 'counseling',
    image: images.familyCounseling,
    title: 'Family Counseling',
    subtitle: 'Guidance You Can Trust',
    summary:
      'We know how important parents are in every child\'s progress—and we want you to feel informed, confident, and supported.',
    paragraphs: [
      'Our counseling sessions give you clear answers about your child\'s communication skills, explain treatment options, and share recommendations for home and school.',
    ],
    ctaLabel: 'Schedule Counseling',
  },
  {
    id: 'assessment',
    image: images.assessment,
    title: 'Assessment',
    subtitle: 'Getting the Full Picture',
    summary:
      'If a deeper look is needed, we\'ll do a full, child-friendly assessment tailored to your child\'s unique profile.',
    paragraphs: [
      'A comprehensive assessment may include a review of your child\'s development and history, observation of speech and language skills, oral-motor and articulation checks, and age-appropriate standardized testing.',
      'Afterward, we\'ll walk you through the results, highlight your child\'s strengths, and build a personalized plan that fits their unique needs.',
    ],
    bullets: [
      'Review of development and history',
      'Observation of speech and language skills',
      'Oral-motor and articulation checks',
      'Age-appropriate standardized testing',
    ],
    ctaLabel: 'Book a Session',
  },
  {
    id: 'treatment',
    image: images.treatment,
    title: 'Therapy',
    subtitle: 'Helping Your Child Find Their Voice',
    summary:
      'Once therapy begins, your child\'s sessions will be designed just for them—focused on building confidence, improving communication, and having fun while learning.',
    paragraphs: [
      'Our approach is family-centered: you\'re welcome to observe or join sessions, we\'ll teach you simple ways to practice at home, and we\'ll send fun exercises your child can enjoy outside the clinic.',
      'With teamwork, your child keeps progressing even after the session ends.',
    ],
    bullets: [
      'You\'re welcome to observe or join sessions',
      'Simple home practice strategies for parents',
      'Fun exercises to enjoy outside the clinic',
    ],
    ctaLabel: 'Book a Session',
  },
  {
    id: 'professional-training',
    image: images.inTheFieldHero,
    title: 'Professional Training',
    subtitle: 'Workshops & Clinical Development',
    summary:
      'Hands-on professional development for speech-language pathologists, educators, and healthcare teams seeking evidence-based clinical growth.',
    paragraphs: [
      'Interactive workshops and seminars designed for clinicians, educators, and allied health professionals who want to deepen their expertise in communication sciences.',
      'Sessions cover assessment frameworks, intervention strategies, bilingual practice, and the latest research — tailored to the needs of your team or institution.',
    ],
    bullets: [
      'Clinical workshops for SLPs and educators',
      'Evidence-based assessment and intervention training',
      'Bilingual and culturally responsive practice',
      'Custom programs for hospitals, schools, and universities',
    ],
    ctaLabel: 'Book a Session',
  },
  {
    id: 'family-training',
    image: images.familyTraining,
    title: 'Family Training',
    subtitle: 'Parent Coaching & Home Support',
    summary:
      'Practical coaching for parents and caregivers — building confidence and skills to support your child\'s communication at home and in everyday life.',
    paragraphs: [
      'Parent coaching sessions give you clear, actionable strategies to reinforce therapy goals in daily routines — from mealtimes and play to homework and social situations.',
      'We work alongside your family to build a supportive home environment where your child\'s communication skills can grow naturally between clinic visits.',
    ],
    bullets: [
      'Personalized home practice strategies',
      'Guidance on supporting communication in daily routines',
      'Collaboration with schools and other caregivers',
      'Ongoing coaching as your child progresses',
    ],
    ctaLabel: 'Book a Session',
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

export const casesWeServe = {
  title: 'Conditions We Understand & Treat',
  intro:
    'Every child communicates differently. At our practice, assessments and therapy are grounded in the most current evidence, delivered with deep cultural and linguistic awareness, and tailored to the individual—not the diagnosis. We work with children and families across a spectrum of communication and language disorders, offering services in both English and Arabic.',
}

export const clinicalSpecializations = [
  {
    id: 'autism',
    filterGroup: 'Neurodevelopmental',
    category: 'Neurodevelopmental',
    title: 'Autism Spectrum Disorder',
    abbr: 'ASD',
    image: images.treatment,
    excerpt:
      'Neurodiversity-affirming support for social communication, pragmatics, AAC, and functional language across home, school, and community.',
    paragraphs: [
      'Autism Spectrum Disorder is a neurodevelopmental condition characterized by differences in social communication, social interaction, and patterns of behavior or sensory processing. The word spectrum is essential — no two autistic individuals present alike. Some children are highly verbal yet struggle with the social and pragmatic dimensions of language; others may use limited spoken language or communicate through alternative means. What they share is a profile of strengths and challenges that is uniquely their own.',
      'From a speech-language perspective, ASD affects communication across multiple levels. Children may show delays in early language milestones, difficulty initiating or sustaining conversation, challenges with understanding nonliteral language such as sarcasm, idioms, or inference, and differences in prosody — the rhythm and melody of speech. Many children with ASD also present with sensory sensitivities that directly affect how they engage in social and communicative contexts.',
      'Our approach is explicitly neurodiversity-affirming. We do not aim to make autistic children appear neurotypical. Our goal is to expand their communicative repertoire, build confidence, and support them in expressing themselves effectively in the environments that matter most to them — at home, at school, and in the community.',
    ],
    therapyAreas: [
      'Joint attention, turn-taking, and early social communication skills',
      'Functional language and spontaneous communication',
      'Pragmatic language: understanding social rules, context, and conversational repair',
      'Augmentative and Alternative Communication (AAC) when appropriate',
      'Narrative language and school-based communication demands',
      'Sensory-informed, neurodiversity-affirming approaches',
    ],
    bilingualNote: 'Bilingual assessment and therapy available in English and Arabic',
  },
  {
    id: 'adhd',
    filterGroup: 'Neurodevelopmental',
    category: 'Neurodevelopmental',
    title: 'Attention Deficit Hyperactivity Disorder',
    abbr: 'ADHD',
    image: images.screening,
    excerpt:
      'Targeted support for executive function, listening comprehension, narrative organization, and academic language impacted by ADHD.',
    paragraphs: [
      'Attention-Deficit/Hyperactivity Disorder is one of the most common neurodevelopmental conditions affecting school-age children, yet its impact on language and communication is frequently underestimated. While ADHD is often framed around attention regulation and impulse control, its effects extend well into how a child processes, organizes, and expresses language — with real consequences for learning, social connection, and academic performance.',
      'Children with ADHD may struggle to follow multi-step directions, organize their thoughts when speaking or writing, maintain a coherent narrative, or regulate conversational turn-taking. They may interrupt frequently, lose track of the topic, or have difficulty recalling verbal instructions. These patterns are not a matter of intelligence or willingness — they reflect the underlying differences in executive function that define ADHD.',
      'Assessment in the context of ADHD requires careful differentiation: some children present with a co-occurring developmental language disorder, others with specific reading difficulties, and still others with language profiles that are broadly within normal limits but functionally impaired by attentional demands. We conduct thorough, individualized evaluations to distinguish these profiles and design intervention accordingly.',
    ],
    therapyAreas: [
      'Listening comprehension and following complex verbal instructions',
      'Narrative organization and verbal expression',
      'Conversational skills: topic maintenance, turn-taking, and self-monitoring',
      'Phonological awareness and reading-related language skills',
      'Metacognitive strategies for academic language tasks',
      'Collaboration with educational teams and parents',
    ],
    bilingualNote: 'Bilingual assessment and therapy available in English and Arabic',
  },
  {
    id: 'intellectual-developmental',
    filterGroup: 'Neurodevelopmental',
    category: 'Neurodevelopmental',
    title: 'Intellectual Developmental Disorder',
    abbr: 'IDD',
    image: images.assessment,
    excerpt:
      'Functional communication development for children with intellectual disability — building practical language, daily living skills, and social participation.',
    paragraphs: [
      'Intellectual Developmental Disorder is characterized by significant limitations in intellectual functioning and adaptive behavior, affecting how a child learns, reasons, problem-solves, and manages everyday life demands. Communication is almost always affected — not because a child lacks the desire to connect, but because the cognitive and linguistic demands of learning language, using symbols, and navigating social interaction require support matched to their developmental level.',
      'Children with intellectual developmental disorder may have delayed first words, limited vocabulary, short or grammatically simple utterances, and difficulty understanding abstract language, complex instructions, or figurative expressions. They may rely heavily on routines, context, and familiar partners to communicate effectively. Without individualized support, these challenges can limit independence, academic participation, and quality of life.',
      'Speech-language intervention for children with intellectual developmental disorder is not about pushing development beyond capacity — it is about building functional, meaningful communication that opens doors. We focus on what matters most in daily life: expressing needs and choices, participating in family and classroom routines, understanding safety and social expectations, and developing communication systems that grow with the child.',
    ],
    therapyAreas: [
      'Early communication and symbolic language development',
      'Functional vocabulary for daily routines and independence',
      'Understanding and using simple to complex sentence structures',
      'Augmentative and Alternative Communication (AAC) systems when needed',
      'Social communication and peer interaction skills',
      'Collaboration with families, educators, and multidisciplinary teams',
    ],
    bilingualNote: 'Bilingual assessment and therapy available in English and Arabic',
  },
  {
    id: 'specific-learning',
    filterGroup: 'Learning',
    category: 'Learning Disorder',
    title: 'Specific Learning Disorder',
    abbr: 'SLD',
    image: images.family,
    excerpt:
      'Language-based intervention for reading, writing, and academic learning difficulties — bridging spoken language skills with literacy success.',
    paragraphs: [
      'Specific Learning Disorder refers to persistent difficulties in learning and using academic skills — most commonly in reading (dyslexia), written expression (dysgraphia), or mathematics (dyscalculia) — that are not explained by intellectual disability, sensory impairment, or inadequate instruction. Because literacy is built on language, speech-language pathologists play a critical role in identifying and treating the underlying language weaknesses that fuel learning struggles.',
      'Children with specific learning disorders may read accurately but fail to comprehend; struggle to spell or organize written work; have weak phonological awareness; or find it difficult to learn and retain new vocabulary. They may perform adequately in conversation yet falter when academic language demands increase — longer texts, inferential questions, written reports, and subject-specific terminology expose gaps that casual interaction does not.',
      'Effective intervention targets the language foundations of learning: phonological processing, morphological awareness, sentence-level comprehension, narrative structure, and metalinguistic skills. We work closely with families and schools to ensure that therapy translates into classroom success — because a child who understands language deeply is a child better equipped to learn across every subject.',
    ],
    therapyAreas: [
      'Phonological awareness and decoding skills',
      'Reading comprehension and verbal reasoning',
      'Vocabulary development across academic subjects',
      'Written language: sentence formulation, organization, and cohesion',
      'Metalinguistic awareness and study strategies',
      'Collaboration with teachers on classroom accommodations',
    ],
    bilingualNote: 'Bilingual literacy and language assessment available in English and Arabic',
  },
  {
    id: 'global-developmental-delay',
    filterGroup: 'Developmental',
    category: 'Developmental Delay',
    title: 'Global Developmental Delay',
    abbr: 'GDD',
    image: images.familyCounseling,
    excerpt:
      'Early intervention for young children showing delays across multiple developmental domains — with communication at the center of every plan.',
    paragraphs: [
      'Global Developmental Delay is diagnosed in young children who demonstrate significant delays in two or more developmental areas — typically including communication, motor skills, cognition, and social-emotional development — before a more specific diagnosis can be determined. It is often identified in the toddler and preschool years, when parents notice that their child is not meeting expected milestones at the same pace as peers.',
      'From a communication standpoint, children with global developmental delay may be late to babble or speak their first words, have limited vocabulary, struggle to combine words into phrases, or show difficulty understanding simple instructions. They may also present with feeding, play, or social interaction differences that are closely intertwined with communication development. Early patterns matter: the earlier support begins, the greater the opportunity to shape trajectories across all domains.',
      'Our early intervention approach is relationship-based, play-informed, and family-centered. We assess the whole child — not just isolated skills — and design therapy that integrates communication goals into everyday routines. Parents are active partners in every session, learning strategies they can use at home to accelerate progress between visits.',
    ],
    therapyAreas: [
      'Early language stimulation and pre-linguistic communication',
      'Vocabulary building and first word combinations',
      'Receptive language: following directions and understanding concepts',
      'Play-based social communication and joint attention',
      'Feeding and oral-motor concerns where clinically indicated',
      'Parent coaching and home practice strategies',
    ],
    bilingualNote: 'Early intervention available in English and Arabic',
  },
  {
    id: 'social-pragmatic',
    filterGroup: 'Communication',
    category: 'Pragmatic Language Disorder',
    title: 'Social (Pragmatic) Communication Disorder',
    abbr: 'SCD',
    image: images.treatment,
    excerpt:
      'Specialized support for social communication and pragmatic language — helping children navigate conversation, context, and social understanding.',
    paragraphs: [
      'Social (Pragmatic) Communication Disorder is a diagnostic category for children who have significant difficulty using verbal and nonverbal communication appropriately in social contexts — without meeting the full criteria for autism spectrum disorder. These children may have adequate vocabulary and grammar yet struggle profoundly with the unwritten rules of conversation: taking turns, staying on topic, adjusting language for different listeners, understanding humor or sarcasm, and interpreting social cues.',
      'Children with pragmatic communication difficulties may speak fluently but say things that seem odd or off-topic, have trouble making and keeping friends, misread social situations, or become anxious in group settings. Teachers may describe them as capable on paper but lost in the classroom socially. Families often report that their child seems to miss what others intuitively understand about how communication works in real life.',
      'Pragmatic language intervention is among the most specialized areas of speech-language pathology. It requires careful assessment to distinguish social communication disorder from language disorder, ADHD, anxiety, or cultural differences in communication style. Our therapy is explicit, structured, and grounded in real social contexts — teaching the skills of conversation, perspective-taking, and social problem-solving in ways children can practice and generalize.',
    ],
    therapyAreas: [
      'Conversational skills: initiating, maintaining, and closing topics',
      'Understanding nonliteral language: idioms, sarcasm, and inference',
      'Social problem-solving and perspective-taking',
      'Adjusting communication for different audiences and settings',
      'Nonverbal communication: eye contact, body language, and tone',
      'Building friendship skills and reducing social anxiety',
    ],
    bilingualNote: 'Bilingual pragmatic language assessment available in English and Arabic',
  },
]

export const testimonialsSection = {
  eyebrow: 'Family Voices',
  title: 'When families find the right words',
  description:
    'Parents and partners share how thoughtful, bilingual care turned worry into progress — one session, one breakthrough at a time.',
}

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

export const contactDetails = {
  workplace: {
    name: 'Psych Care Complex',
    department: 'Communication Disorders Department',
    city: 'Riyadh, Saudi Arabia',
  },
  schedule: [
    { day: 'Sunday', hours: '9:00 AM – 5:00 PM' },
    { day: 'Monday', hours: '9:00 AM – 5:00 PM' },
    { day: 'Tuesday', hours: '9:00 AM – 5:00 PM' },
    { day: 'Wednesday', hours: '9:00 AM – 5:00 PM' },
    { day: 'Thursday', hours: '9:00 AM – 3:00 PM' },
    { day: 'Friday', hours: 'Weekend', weekend: true },
    { day: 'Saturday', hours: 'Weekend', weekend: true },
  ],
}

export const footerServices = [
  'Assessment',
  'Therapy',
  'Family Counseling',
  'School Collaboration',
]

export const footerQuickLinks = [
  { label: 'About', href: '/about-me' },
  { label: 'Services', href: '/services' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'In the Field', href: '/in-the-field' },
  { label: 'Contact', href: '/contact' },
]
