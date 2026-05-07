-- =============================================================================
-- Migration 010: Seed mock content – International Resources & Forum Posts
-- Musika Multi-Vendor Marketplace
--
-- Creates deterministic seed auth users + profiles so forum posts have a valid
-- author_id FK, then inserts all resources and forum content.
-- Safe to re-run: every statement uses ON CONFLICT DO NOTHING.
-- =============================================================================

-- ─── Seed auth users (bypasses trigger; runs as postgres) ─────────────────────
-- These are bot/seed accounts only – no real passwords are set.
-- UUIDs use only valid hex characters (0-9, a-f).
insert into auth.users (
  id,
  email,
  email_confirmed_at,
  encrypted_password,
  created_at,
  updated_at,
  raw_user_meta_data
)
values
  ('00000000-0000-0000-0000-000000000001', 'seed-tatenda@musika.internal',   now(), '', now(), now(), '{"full_name":"Tatenda Moyo"}'),
  ('00000000-0000-0000-0000-000000000002', 'seed-joao@musika.internal',      now(), '', now(), now(), '{"full_name":"Joao Costa"}'),
  ('00000000-0000-0000-0000-000000000003', 'seed-fatima@musika.internal',    now(), '', now(), now(), '{"full_name":"Fatima Al-Rashid"}'),
  ('00000000-0000-0000-0000-000000000004', 'seed-chiedza@musika.internal',   now(), '', now(), now(), '{"full_name":"Chiedza Mutasa"}'),
  ('00000000-0000-0000-0000-000000000005', 'seed-youssef@musika.internal',   now(), '', now(), now(), '{"full_name":"Youssef El-Amin"}'),
  ('00000000-0000-0000-0000-000000000006', 'seed-beatriz@musika.internal',   now(), '', now(), now(), '{"full_name":"Beatriz Oliveira"}'),
  ('00000000-0000-0000-0000-000000000007', 'seed-omar@musika.internal',      now(), '', now(), now(), '{"full_name":"Omar Khalil"}'),
  ('00000000-0000-0000-0000-000000000008', 'seed-farai@musika.internal',     now(), '', now(), now(), '{"full_name":"Farai Ncube"}'),
  ('00000000-0000-0000-0000-000000000010', 'seed-ana@musika.internal',       now(), '', now(), now(), '{"full_name":"Ana Ferreira"}'),
  ('00000000-0000-0000-0000-000000000011', 'seed-jessica@musika.internal',   now(), '', now(), now(), '{"full_name":"Jessica Wong"}'),
  ('00000000-0000-0000-0000-000000000012', 'seed-david@musika.internal',     now(), '', now(), now(), '{"full_name":"David Rodriguez"}'),
  ('00000000-0000-0000-0000-000000000013', 'seed-fatima2@musika.internal',   now(), '', now(), now(), '{"full_name":"Fatima Al-Rashid"}')
on conflict (id) do nothing;

-- ─── Seed profiles ────────────────────────────────────────────────────────────
insert into public.profiles (id, email, full_name, role)
values
  ('00000000-0000-0000-0000-000000000001', 'seed-tatenda@musika.internal',  'Tatenda Moyo',      'student'),
  ('00000000-0000-0000-0000-000000000002', 'seed-joao@musika.internal',     'Joao Costa',        'student'),
  ('00000000-0000-0000-0000-000000000003', 'seed-fatima@musika.internal',   'Fatima Al-Rashid',  'student'),
  ('00000000-0000-0000-0000-000000000004', 'seed-chiedza@musika.internal',  'Chiedza Mutasa',    'student'),
  ('00000000-0000-0000-0000-000000000005', 'seed-youssef@musika.internal',  'Youssef El-Amin',   'student'),
  ('00000000-0000-0000-0000-000000000006', 'seed-beatriz@musika.internal',  'Beatriz Oliveira',  'student'),
  ('00000000-0000-0000-0000-000000000007', 'seed-omar@musika.internal',     'Omar Khalil',       'student'),
  ('00000000-0000-0000-0000-000000000008', 'seed-farai@musika.internal',    'Farai Ncube',       'student'),
  ('00000000-0000-0000-0000-000000000010', 'seed-ana@musika.internal',      'Ana Ferreira',      'student'),
  ('00000000-0000-0000-0000-000000000011', 'seed-jessica@musika.internal',  'Jessica Wong',      'student'),
  ('00000000-0000-0000-0000-000000000012', 'seed-david@musika.internal',    'David Rodriguez',   'student'),
  ('00000000-0000-0000-0000-000000000013', 'seed-fatima2@musika.internal',  'Fatima Al-Rashid',  'student')
on conflict (id) do nothing;

-- =============================================================================
-- International Resources
-- category enum: 'visa' | 'legal' | 'housing' | 'transport' | 'healthcare' | 'discounts' | 'emergency'
-- =============================================================================

insert into public.resources (slug, title, description, category, country, city, url, is_verified, is_free)
values
  (
    'india-student-visa-renewal-guide',
    'India Student Visa Renewal Guide',
    'Step-by-step renewal checklist, timelines, and common mistakes to avoid.',
    'visa',
    'India', 'Pune',
    'https://example.com/resources/india-student-visa-renewal-guide',
    true, true
  ),
  (
    'budget-housing-near-campus-checklist',
    'Budget Housing Near Campus Checklist',
    'How to verify landlords, compare rent terms, and avoid housing scams.',
    'housing',
    'India', 'Pune',
    'https://example.com/resources/budget-housing-near-campus-checklist',
    true, true
  ),
  (
    'public-transport-student-pass-setup',
    'Public Transport Student Pass Setup',
    'Apply for student transit cards and unlock discounted monthly passes.',
    'transport',
    'India', 'Pune',
    'https://example.com/resources/public-transport-student-pass-setup',
    true, true
  ),
  (
    'international-student-healthcare-basics',
    'International Student Healthcare Basics',
    'Find clinics, understand insurance claims, and use emergency care safely.',
    'healthcare',
    'India', 'Mumbai',
    'https://example.com/resources/international-student-healthcare-basics',
    true, true
  ),
  (
    'city-safety-essentials-for-new-students',
    'City Safety Essentials for New Students',
    'Emergency contacts, safe zones, and practical safety habits for daily life.',
    'emergency',
    'India', 'Pune',
    'https://example.com/resources/city-safety-essentials-for-new-students',
    false, true
  ),
  (
    'academic-success-toolkit-first-semester',
    'Academic Success Toolkit: First Semester',
    'Time management templates, exam prep flow, and faculty communication tips.',
    'discounts',
    'India', 'Bengaluru',
    'https://example.com/resources/academic-success-toolkit-first-semester',
    true, true
  ),
  (
    'legal-document-translation-guide',
    'Legal Document Translation Guide',
    'When to notarize, translate, and apostille official education documents.',
    'legal',
    'India', 'Delhi',
    'https://example.com/resources/legal-document-translation-guide',
    true, true
  ),
  (
    'student-tenant-rights-quick-reference',
    'Student Tenant Rights Quick Reference',
    'A compact rights and obligations guide before signing your rental agreement.',
    'housing',
    'India', 'Hyderabad',
    'https://example.com/resources/student-tenant-rights-quick-reference',
    true, true
  )
on conflict (slug) do nothing;

-- =============================================================================
-- Forum Posts
-- category enum: 'housing' | 'academics' | 'legal' | 'events' | 'general'
-- =============================================================================

insert into public.forum_posts (
  id, slug, title, content, category, author_id,
  views, upvotes, replies_count, saved_count, is_answered, tags, is_trending,
  created_at, updated_at
)
values
  (
    'a0000001-f001-0000-0000-000000000001',
    'student-housing-tips-2026',
    'Best Student Housing Areas in Nashik',
    'Looking for recommendations on student housing in Nashik. Budget around ₹8000-10000/month. Prefer areas close to KTHM College or Sandip University.',
    'housing',
    '00000000-0000-0000-0000-000000000001',
    234, 18, 2, 45, true,
    array['housing','nashik','budget-friendly'],
    true,
    now() - interval '2 days',
    now() - interval '2 days'
  ),
  (
    'a0000001-f002-0000-0000-000000000002',
    'visa-extension-process-india',
    'Anyone Successfully Extended Their Study Permit in Mumbai?',
    'My study permit expires in 3 months. Has anyone gone through the extension process in Mumbai? How long did it take?',
    'legal',
    '00000000-0000-0000-0000-000000000002',
    89, 7, 0, 12, false,
    array['visa','study-permit','legal'],
    true,
    now() - interval '5 hours',
    now() - interval '5 hours'
  ),
  (
    'a0000001-f003-0000-0000-000000000003',
    'best-part-time-jobs-students',
    'What Are the Best Part-Time Jobs for International Students in Pune?',
    'Looking to earn some extra money while studying in Pune. What companies or roles do you recommend? Any tips for balancing work and studies?',
    'general',
    '00000000-0000-0000-0000-000000000003',
    512, 42, 1, 156, true,
    array['jobs','part-time','pune'],
    true,
    now() - interval '1 day',
    now() - interval '1 day'
  ),
  (
    'a0000001-f004-0000-0000-000000000004',
    'health-insurance-coverage',
    'Health Insurance for International Students in Aurangabad - What''s Covered?',
    'Trying to understand what my school health insurance actually covers in Aurangabad. Anyone know if dental and vision are included?',
    'academics',
    '00000000-0000-0000-0000-000000000004',
    156, 12, 0, 34, true,
    array['health','insurance','aurangabad'],
    false,
    now() - interval '3 days',
    now() - interval '3 days'
  ),
  (
    'a0000001-f005-0000-0000-000000000005',
    'transportation-nashik-smart-card',
    'Nashik City Bus Pass vs Daily Tickets - Which Is Better?',
    'New to Nashik. Should I get a monthly bus pass or buy daily tickets? What are the actual savings?',
    'academics',
    '00000000-0000-0000-0000-000000000005',
    203, 15, 1, 42, true,
    array['transportation','bus','nashik'],
    false,
    now() - interval '4 hours',
    now() - interval '4 hours'
  ),
  (
    'a0000001-f006-0000-0000-000000000006',
    'campus-event-orientation-week',
    'Orientation Week Events in Pune - Which Ones Should I Attend?',
    'First year student here in Pune. There are SO many events during orientation. Any suggestions on which ones are actually worth attending?',
    'events',
    '00000000-0000-0000-0000-000000000006',
    89, 6, 0, 18, false,
    array['events','orientation','pune'],
    false,
    now() - interval '6 hours',
    now() - interval '6 hours'
  ),
  (
    'a0000001-f007-0000-0000-000000000007',
    'roommate-conflict-resolution',
    'How to Handle Difficult Roommate Situations in Mumbai',
    'My roommate and I have been having issues in our Mumbai flat. Anyone have experience dealing with this constructively? Tips appreciated.',
    'housing',
    '00000000-0000-0000-0000-000000000007',
    167, 9, 0, 28, true,
    array['housing','roommate','mumbai'],
    false,
    now() - interval '12 hours',
    now() - interval '12 hours'
  ),
  (
    'a0000001-f008-0000-0000-000000000008',
    'scholarship-application-tips',
    'Scholarship Application Tips for Students in Maharashtra',
    'Are there specific scholarships I should be targeting as an international student in Maharashtra? What makes a strong application?',
    'academics',
    '00000000-0000-0000-0000-000000000008',
    76, 4, 0, 14, false,
    array['scholarships','funding','maharashtra'],
    false,
    now() - interval '18 hours',
    now() - interval '18 hours'
  )
on conflict (id) do nothing;

-- =============================================================================
-- Forum Comments (replies)
-- Note: replies_count on forum_posts is managed by trigger, but since we
-- seeded replies_count directly above, we skip the trigger by using
-- replica identity / bypassing via direct insert and NOT relying on the trigger
-- for the seed counts (they are already set correctly above).
-- =============================================================================

-- Temporarily disable the sync trigger so it doesn't double-count
-- (we already set replies_count to correct values in the posts insert above)
alter table public.forum_comments disable trigger forum_comments_sync_count;

insert into public.forum_comments (
  id, post_id, content, author_id, upvotes, is_answer, created_at, updated_at
)
values
  (
    'b0000001-c001-0000-0000-000000000001',
    'a0000001-f001-0000-0000-000000000001',
    'Honestly, the College Road area in Nashik is great. Good vibe, walkable to colleges, and lots of student rooms. Prices around ₹9500 for a shared flat.',
    '00000000-0000-0000-0000-000000000010',
    8, true,
    now() - interval '1 day',
    now() - interval '1 day'
  ),
  (
    'b0000001-c002-0000-0000-000000000002',
    'a0000001-f001-0000-0000-000000000001',
    'I lived in St. George area last year. Super convenient and safe. The only downside is it''s on the pricier side, but the commute is worth it.',
    '00000000-0000-0000-0000-000000000011',
    5, false,
    now() - interval '1 day',
    now() - interval '1 day'
  ),
  (
    'b0000001-c003-0000-0000-000000000003',
    'a0000001-f003-0000-0000-000000000003',
    'Library tutoring gigs are great for students. Flexible hours, ₹800-1000/hr, and you get to help people. Highly recommend!',
    '00000000-0000-0000-0000-000000000012',
    12, true,
    now() - interval '20 hours',
    now() - interval '20 hours'
  ),
  (
    'b0000001-c004-0000-0000-000000000004',
    'a0000001-f005-0000-0000-000000000005',
    'The Nashik Smart Card is definitely better if you''re commuting regularly. The monthly pass savings are worth it.',
    '00000000-0000-0000-0000-000000000013',
    7, true,
    now() - interval '2 hours',
    now() - interval '2 hours'
  )
on conflict (id) do nothing;

-- Re-enable the sync trigger
alter table public.forum_comments enable trigger forum_comments_sync_count;
