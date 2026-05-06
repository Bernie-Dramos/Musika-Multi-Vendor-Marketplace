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
    title: 'Best Student Housing Areas in Nashik',
    content:
      'Looking for recommendations on student housing in Nashik. Budget around ₹8000-10000/month. Prefer areas close to KTHM College or Sandip University.',
    category: 'housing',
    authorId: 'user-1',
    authorName: 'Tatenda Moyo',
    authorAvatar: '👩‍🎓',
    createdAt: new Date(now.getTime() - 2 * oneDay),
    updatedAt: new Date(now.getTime() - 2 * oneDay),
    views: 234,
    upvotes: 18,
    repliesCount: 2,
    savedCount: 45,
    isAnswered: true,
    tags: ['housing', 'nashik', 'budget-friendly'],
    trending: true,
  },
  {
    id: 'post-2',
    slug: 'visa-extension-process-india',
    title: 'Anyone Successfully Extended Their Study Permit in Mumbai?',
    content:
      'My study permit expires in 3 months. Has anyone gone through the extension process in Mumbai? How long did it take?',
    category: 'legal',
    authorId: 'user-2',
    authorName: 'João Costa',
    authorAvatar: '👨‍💼',
    createdAt: new Date(now.getTime() - 5 * oneHour),
    updatedAt: new Date(now.getTime() - 5 * oneHour),
    views: 89,
    upvotes: 7,
    repliesCount: 0,
    savedCount: 12,
    isAnswered: false,
    tags: ['visa', 'study-permit', 'legal'],
    trending: true,
  },
  {
    id: 'post-3',
    slug: 'best-part-time-jobs-students',
    title: 'What Are the Best Part-Time Jobs for International Students in Pune?',
    content:
      'Looking to earn some extra money while studying in Pune. What companies or roles do you recommend? Any tips for balancing work and studies?',
    category: 'general',
    authorId: 'user-3',
    authorName: 'Fatima Al-Rashid',
    authorAvatar: '👩‍💻',
    createdAt: new Date(now.getTime() - 1 * oneDay),
    updatedAt: new Date(now.getTime() - 1 * oneDay),
    views: 512,
    upvotes: 42,
    repliesCount: 1,
    savedCount: 156,
    isAnswered: true,
    tags: ['jobs', 'part-time', 'pune'],
    trending: true,
  },
  {
    id: 'post-4',
    slug: 'health-insurance-coverage',
    title: 'Health Insurance for International Students in Aurangabad - What\'s Covered?',
    content:
      'Trying to understand what my school health insurance actually covers in Aurangabad. Anyone know if dental and vision are included?',
    category: 'academics',
    authorId: 'user-4',
    authorName: 'Chiedza Mutasa',
    authorAvatar: '👨‍🎓',
    createdAt: new Date(now.getTime() - 3 * oneDay),
    updatedAt: new Date(now.getTime() - 3 * oneDay),
    views: 156,
    upvotes: 12,
    repliesCount: 0,
    savedCount: 34,
    isAnswered: true,
    tags: ['health', 'insurance', 'aurangabad'],
  },
  {
    id: 'post-5',
    slug: 'transportation-nashik-smart-card',
    title: 'Nashik City Bus Pass vs Daily Tickets - Which Is Better?',
    content:
      'New to Nashik. Should I get a monthly bus pass or buy daily tickets? What are the actual savings?',
    category: 'academics',
    authorId: 'user-5',
    authorName: 'Youssef El-Amin',
    authorAvatar: '👩‍🔬',
    createdAt: new Date(now.getTime() - 4 * oneHour),
    updatedAt: new Date(now.getTime() - 4 * oneHour),
    views: 203,
    upvotes: 15,
    repliesCount: 1,
    savedCount: 42,
    isAnswered: true,
    tags: ['transportation', 'bus', 'nashik'],
  },
  {
    id: 'post-6',
    slug: 'campus-event-orientation-week',
    title: 'Orientation Week Events in Pune - Which Ones Should I Attend?',
    content:
      'First year student here in Pune. There are SO many events during orientation. Any suggestions on which ones are actually worth attending?',
    category: 'events',
    authorId: 'user-6',
    authorName: 'Beatriz Oliveira',
    authorAvatar: '👨‍🎓',
    createdAt: new Date(now.getTime() - 6 * oneHour),
    updatedAt: new Date(now.getTime() - 6 * oneHour),
    views: 89,
    upvotes: 6,
    repliesCount: 0,
    savedCount: 18,
    isAnswered: false,
    tags: ['events', 'orientation', 'pune'],
  },
  {
    id: 'post-7',
    slug: 'roommate-conflict-resolution',
    title: 'How to Handle Difficult Roommate Situations in Mumbai',
    content:
      'My roommate and I have been having issues in our Mumbai flat. Anyone have experience dealing with this constructively? Tips appreciated.',
    category: 'housing',
    authorId: 'user-7',
    authorName: 'Omar Khalil',
    authorAvatar: '👩‍🎓',
    createdAt: new Date(now.getTime() - 12 * oneHour),
    updatedAt: new Date(now.getTime() - 12 * oneHour),
    views: 167,
    upvotes: 9,
    repliesCount: 0,
    savedCount: 28,
    isAnswered: true,
    tags: ['housing', 'roommate', 'mumbai'],
  },
  {
    id: 'post-8',
    slug: 'scholarship-application-tips',
    title: 'Scholarship Application Tips for Students in Maharashtra',
    content:
      'Are there specific scholarships I should be targeting as an international student in Maharashtra? What makes a strong application?',
    category: 'academics',
    authorId: 'user-8',
    authorName: 'Farai Ncube',
    authorAvatar: '👩‍🎓',
    createdAt: new Date(now.getTime() - 18 * oneHour),
    updatedAt: new Date(now.getTime() - 18 * oneHour),
    views: 76,
    upvotes: 4,
    repliesCount: 0,
    savedCount: 14,
    isAnswered: false,
    tags: ['scholarships', 'funding', 'maharashtra'],
  },
];

// Mock replies for posts
export const forumReplies: ForumReply[] = [
  {
    id: 'reply-1',
    postId: 'post-1',
    content:
      'Honestly, the College Road area in Nashik is great. Good vibe, walkable to colleges, and lots of student rooms. Prices around ₹9500 for a shared flat.',
    authorId: 'user-10',
    authorName: 'Ana Ferreira',
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
      'The Nashik Smart Card is definitely better if you\'re commuting regularly. The monthly pass savings are worth it.',
    authorId: 'user-13',
    authorName: 'Fatima Al-Rashid',
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



export function getMyForumPosts(authorId: string): ForumPost[] {
  return forumPosts.filter((post) => post.authorId === authorId);
}
