export type ResourceCategory =
  | 'Visa & Legal'
  | 'Housing'
  | 'Transportation'
  | 'Healthcare'
  | 'Safety'
  | 'Academics';

export interface InternationalResource {
  id: number;
  slug: string;
  title: string;
  summary: string;
  category: ResourceCategory;
  country: string;
  city: string;
  verified: boolean;
  sourceName: string;
  sourceUrl: string;
  updatedAt: string;
  tags: string[];
}

export const internationalResources: InternationalResource[] = [
  {
    id: 1,
    slug: 'india-student-visa-renewal-guide',
    title: 'India Student Visa Renewal Guide',
    summary: 'Step-by-step renewal checklist, timelines, and common mistakes to avoid.',
    category: 'Visa & Legal',
    country: 'India',
    city: 'Pune',
    verified: true,
    sourceName: 'Musika Legal Partners',
    sourceUrl: 'https://example.com/resources/india-student-visa-renewal-guide',
    updatedAt: '2026-03-28',
    tags: ['visa', 'renewal', 'documentation'],
  },
  {
    id: 2,
    slug: 'budget-housing-near-campus-checklist',
    title: 'Budget Housing Near Campus Checklist',
    summary: 'How to verify landlords, compare rent terms, and avoid housing scams.',
    category: 'Housing',
    country: 'India',
    city: 'Pune',
    verified: true,
    sourceName: 'Student Accommodation Council',
    sourceUrl: 'https://example.com/resources/budget-housing-near-campus-checklist',
    updatedAt: '2026-04-02',
    tags: ['housing', 'rent', 'safety'],
  },
  {
    id: 3,
    slug: 'public-transport-student-pass-setup',
    title: 'Public Transport Student Pass Setup',
    summary: 'Apply for student transit cards and unlock discounted monthly passes.',
    category: 'Transportation',
    country: 'India',
    city: 'Pune',
    verified: true,
    sourceName: 'City Transit Authority',
    sourceUrl: 'https://example.com/resources/public-transport-student-pass-setup',
    updatedAt: '2026-03-15',
    tags: ['transport', 'bus-pass', 'discounts'],
  },
  {
    id: 4,
    slug: 'international-student-healthcare-basics',
    title: 'International Student Healthcare Basics',
    summary: 'Find clinics, understand insurance claims, and use emergency care safely.',
    category: 'Healthcare',
    country: 'India',
    city: 'Mumbai',
    verified: true,
    sourceName: 'Global Health Desk',
    sourceUrl: 'https://example.com/resources/international-student-healthcare-basics',
    updatedAt: '2026-03-20',
    tags: ['healthcare', 'insurance', 'clinic'],
  },
  {
    id: 5,
    slug: 'city-safety-essentials-for-new-students',
    title: 'City Safety Essentials for New Students',
    summary: 'Emergency contacts, safe zones, and practical safety habits for daily life.',
    category: 'Safety',
    country: 'India',
    city: 'Pune',
    verified: false,
    sourceName: 'Student Community Volunteers',
    sourceUrl: 'https://example.com/resources/city-safety-essentials-for-new-students',
    updatedAt: '2026-02-27',
    tags: ['safety', 'emergency', 'orientation'],
  },
  {
    id: 6,
    slug: 'academic-success-toolkit-first-semester',
    title: 'Academic Success Toolkit: First Semester',
    summary: 'Time management templates, exam prep flow, and faculty communication tips.',
    category: 'Academics',
    country: 'India',
    city: 'Bengaluru',
    verified: true,
    sourceName: 'University Success Office',
    sourceUrl: 'https://example.com/resources/academic-success-toolkit-first-semester',
    updatedAt: '2026-04-01',
    tags: ['academics', 'study-plan', 'success'],
  },
  {
    id: 7,
    slug: 'legal-document-translation-guide',
    title: 'Legal Document Translation Guide',
    summary: 'When to notarize, translate, and apostille official education documents.',
    category: 'Visa & Legal',
    country: 'India',
    city: 'Delhi',
    verified: true,
    sourceName: 'Legal Documentation Office',
    sourceUrl: 'https://example.com/resources/legal-document-translation-guide',
    updatedAt: '2026-03-06',
    tags: ['legal', 'translation', 'notary'],
  },
  {
    id: 8,
    slug: 'student-tenant-rights-quick-reference',
    title: 'Student Tenant Rights Quick Reference',
    summary: 'A compact rights and obligations guide before signing your rental agreement.',
    category: 'Housing',
    country: 'India',
    city: 'Hyderabad',
    verified: true,
    sourceName: 'Tenant Advocacy Network',
    sourceUrl: 'https://example.com/resources/student-tenant-rights-quick-reference',
    updatedAt: '2026-03-10',
    tags: ['tenant-rights', 'housing', 'legal'],
  },
];

export const featuredResourceSlugs = [
  'india-student-visa-renewal-guide',
  'budget-housing-near-campus-checklist',
  'international-student-healthcare-basics',
];

export const getInternationalResourceBySlug = (slug: string) =>
  internationalResources.find((resource) => resource.slug === slug);
