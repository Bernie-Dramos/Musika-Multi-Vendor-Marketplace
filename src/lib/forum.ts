// Forum data types and mock dataset
export interface ForumPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  category: 'housing' | 'academics' | 'legal' | 'events' | 'general';
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  upvotes: number;
  repliesCount: number;
  savedCount: number;
  isAnswered: boolean;
  tags: string[];
  trending?: boolean;
}

export interface ForumReply {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: Date;
  updatedAt: Date;
  upvotes: number;
  isAnswer?: boolean;
}

// Mock forum posts
const now = new Date();
const oneDay = 24 * 60 * 60 * 1000;
const oneHour = 60 * 60 * 1000;

export const forumPosts: ForumPost[] = [
  {
    id: 'post-1',
    slug: 'student-housing-tips-2026',
    title: 'Best Student Housing Areas in Toronto',
    content:
      'Looking for recommendations on student housing in Toronto. Budget around $800-1000/month. Prefer areas close to Ryerson or UofT.',
    category: 'housing',
    authorId: 'user-1',
    authorName: 'Sarah Ahmed',
    authorAvatar: '👩‍🎓',
    createdAt: new Date(now.getTime() - 2 * oneDay),
    updatedAt: new Date(now.getTime() - 2 * oneDay),
    views: 234,
    upvotes: 18,
    repliesCount: 12,
    savedCount: 45,
    isAnswered: true,
    tags: ['housing', 'toronto', 'budget-friendly'],
    trending: true,
  },
  {
    id: 'post-2',
    slug: 'visa-extension-process-canada',
    title: 'Anyone Successfully Extended Their Study Permit?',
    content:
      'My study permit expires in 3 months. Has anyone gone through the extension process? How long did it take?',
    category: 'legal',
    authorId: 'user-2',
    authorName: 'James Liu',
    authorAvatar: '👨‍💼',
    createdAt: new Date(now.getTime() - 5 * oneHour),
    updatedAt: new Date(now.getTime() - 5 * oneHour),
    views: 89,
    upvotes: 7,
    repliesCount: 5,
    savedCount: 12,
    isAnswered: false,
    tags: ['visa', 'study-permit', 'legal'],
    trending: true,
  },
  {
    id: 'post-3',
    slug: 'best-part-time-jobs-students',
    title: 'What Are the Best Part-Time Jobs for International Students?',
    content:
      'Looking to earn some extra money while studying. What companies or roles do you recommend? Any tips for balancing work and studies?',
    category: 'general',
    authorId: 'user-3',
    authorName: 'Maria Garcia',
    authorAvatar: '👩‍💻',
    createdAt: new Date(now.getTime() - 1 * oneDay),
    updatedAt: new Date(now.getTime() - 1 * oneDay),
    views: 512,
    upvotes: 42,
    repliesCount: 28,
    savedCount: 156,
    isAnswered: true,
    tags: ['jobs', 'part-time', 'international-students'],
    trending: true,
  },
  {
    id: 'post-4',
    slug: 'health-insurance-coverage',
    title: 'Health Insurance for International Students - What\'s Covered?',
    content:
      'Trying to understand what my school health insurance actually covers. Anyone know if dental and vision are included?',
    category: 'academics',
    authorId: 'user-4',
    authorName: 'Alex Kim',
    authorAvatar: '👨‍🎓',
    createdAt: new Date(now.getTime() - 3 * oneDay),
    updatedAt: new Date(now.getTime() - 3 * oneDay),
    views: 156,
    upvotes: 12,
    repliesCount: 8,
    savedCount: 34,
    isAnswered: true,
    tags: ['health', 'insurance', 'coverage'],
  },
  {
    id: 'post-5',
    slug: 'transportation-gta-presto-card',
    title: 'PRESTO Card vs Monthly Pass - Which Is Better?',
    content:
      'New to GTA. Should I get a PRESTO card or buy a monthly pass? What are the actual savings?',
    category: 'academics',
    authorId: 'user-5',
    authorName: 'Priya Patel',
    authorAvatar: '👩‍🔬',
    createdAt: new Date(now.getTime() - 4 * oneHour),
    updatedAt: new Date(now.getTime() - 4 * oneHour),
    views: 203,
    upvotes: 15,
    repliesCount: 9,
    savedCount: 42,
    isAnswered: true,
    tags: ['transportation', 'presto', 'toronto'],
  },
  {
    id: 'post-6',
    slug: 'campus-event-orientation-week',
    title: 'Orientation Week Events - Which Ones Should I Attend?',
    content:
      'First year student here. There are SO many events during orientation. Any suggestions on which ones are actually worth attending?',
    category: 'events',
    authorId: 'user-6',
    authorName: 'Chen Wang',
    authorAvatar: '👨‍🎓',
    createdAt: new Date(now.getTime() - 6 * oneHour),
    updatedAt: new Date(now.getTime() - 6 * oneHour),
    views: 89,
    upvotes: 6,
    repliesCount: 4,
    savedCount: 18,
    isAnswered: false,
    tags: ['events', 'orientation', 'first-year'],
  },
  {
    id: 'post-7',
    slug: 'roommate-conflict-resolution',
    title: 'How to Handle Difficult Roommate Situations',
    content:
      'My roommate and I have been having issues. Anyone have experience dealing with this constructively? Tips appreciated.',
    category: 'housing',
    authorId: 'user-7',
    authorName: 'Emma Thompson',
    authorAvatar: '👩‍🎓',
    createdAt: new Date(now.getTime() - 12 * oneHour),
    updatedAt: new Date(now.getTime() - 12 * oneHour),
    views: 167,
    upvotes: 9,
    repliesCount: 6,
    savedCount: 28,
    isAnswered: true,
    tags: ['housing', 'roommate', 'lifestyle'],
  },
  {
    id: 'post-8',
    slug: 'scholarship-application-tips',
    title: '[Unanswered] Scholarship Application Tips for International Students',
    content:
      'Are there specific scholarships I should be targeting as an international student? What makes a strong application?',
    category: 'academics',
    authorId: 'user-8',
    authorName: 'Fatima Hassan',
    authorAvatar: '👩‍🎓',
    createdAt: new Date(now.getTime() - 18 * oneHour),
    updatedAt: new Date(now.getTime() - 18 * oneHour),
    views: 76,
    upvotes: 4,
    repliesCount: 2,
    savedCount: 14,
    isAnswered: false,
    tags: ['scholarships', 'funding', 'applications'],
  },
];

// Mock replies for posts
export const forumReplies: ForumReply[] = [
  {
    id: 'reply-1',
    postId: 'post-1',
    content:
      'Honestly, the Annex area near UofT is great. Good vibe, walkable to campus, and lots of student houses. Prices around $950 for a room.',
    authorId: 'user-10',
    authorName: 'Michael Chen',
    authorAvatar: '👨‍💼',
    createdAt: new Date(now.getTime() - 1 * oneDay),
    updatedAt: new Date(now.getTime() - 1 * oneDay),
    upvotes: 8,
    isAnswer: true,
  },
  {
    id: 'reply-2',
    postId: 'post-1',
    content:
      'I lived in St. George area last year. Super convenient and safe. The only downside is it\'s on the pricier side, but the commute is worth it.',
    authorId: 'user-11',
    authorName: 'Jessica Wong',
    authorAvatar: '👩‍💼',
    createdAt: new Date(now.getTime() - 1 * oneDay),
    updatedAt: new Date(now.getTime() - 1 * oneDay),
    upvotes: 5,
  },
  {
    id: 'reply-3',
    postId: 'post-3',
    content:
      'Library tutoring gigs are great for students. Flexible hours, $17-20/hr, and you get to help people. Highly recommend!',
    authorId: 'user-12',
    authorName: 'David Rodriguez',
    authorAvatar: '👨‍💼',
    createdAt: new Date(now.getTime() - 20 * oneHour),
    updatedAt: new Date(now.getTime() - 20 * oneHour),
    upvotes: 12,
    isAnswer: true,
  },
  {
    id: 'reply-4',
    postId: 'post-5',
    content:
      'PRESTO is definitely better if you\'re commuting regularly. The daily cap is way more than the difference between each trip.',
    authorId: 'user-13',
    authorName: 'Nina Sharma',
    authorAvatar: '👩‍💼',
    createdAt: new Date(now.getTime() - 2 * oneHour),
    updatedAt: new Date(now.getTime() - 2 * oneHour),
    upvotes: 7,
    isAnswer: true,
  },
];

export function getForumPostBySlug(slug: string): ForumPost | undefined {
  return forumPosts.find((post) => post.slug === slug);
}

export function getForumPostReplies(postId: string): ForumReply[] {
  return forumReplies.filter((reply) => reply.postId === postId);
}

export function getForumPostsByCategory(category: string): ForumPost[] {
  return forumPosts.filter((post) => post.category === category);
}

export function getTrendingForumPosts(): ForumPost[] {
  return forumPosts.filter((post) => post.trending).sort((a, b) => b.upvotes - a.upvotes);
}

export function getUnansweredForumPosts(): ForumPost[] {
  return forumPosts.filter((post) => !post.isAnswered);
}

export function getMyForumPosts(authorId: string): ForumPost[] {
  return forumPosts.filter((post) => post.authorId === authorId);
}
