// Support and FAQ data types and mock data

export interface FAQ {
  id: string;
  slug: string;
  question: string;
  answer: string;
  category: 'general' | 'buying' | 'selling' | 'payment' | 'safety' | 'account';
  order: number;
  updatedAt: Date;
}

export interface SupportTicket {
  id: string;
  userId?: string;
  userEmail: string;
  userType: 'student' | 'vendor';
  subject: string;
  category: 'billing' | 'technical' | 'account' | 'seller-support' | 'dispute' | 'other';
  description: string;
  attachmentUrls?: string[];
  status: 'open' | 'in-progress' | 'waiting-customer' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  authorId?: string;
  authorRole: 'customer' | 'support';
  message: string;
  attachmentUrls?: string[];
  createdAt: Date;
}

// Mock FAQs
export const faqs: FAQ[] = [
  {
    id: 'faq-1',
    slug: 'how-do-i-create-account',
    question: 'How do I create an account on Musika?',
    answer:
      'Click the "Sign Up" button on the homepage and enter your email address and password. You\'ll receive a verification email - click the link to confirm your account. That\'s it! You can now browse and purchase.',
    category: 'account',
    order: 1,
    updatedAt: new Date('2026-04-01'),
  },
  {
    id: 'faq-2',
    slug: 'how-do-i-reset-password',
    question: 'I forgot my password. How do I reset it?',
    answer:
      'Click "Sign In" on the homepage, then click "Forgot Password?" Enter your email address and we\'ll send you a reset link. Click the link in your email, create a new password, and you\'re done.',
    category: 'account',
    order: 2,
    updatedAt: new Date('2026-04-01'),
  },
  {
    id: 'faq-3',
    slug: 'how-do-i-search-products',
    question: 'How can I search for products and services?',
    answer:
      'Use the search bar at the top of the page to find what you\'re looking for. You can also browse by category or use filters like price range, seller rating, and location to narrow down results.',
    category: 'buying',
    order: 3,
    updatedAt: new Date('2026-04-01'),
  },
  {
    id: 'faq-4',
    slug: 'is-it-safe-to-use-musika',
    question: 'Is it safe to buy and sell on Musika?',
    answer:
      'Yes! We verify all vendors and use secure payment processing. All transactions are protected with our Buyer Protection Guarantee. Never send money or personal information outside the platform.',
    category: 'safety',
    order: 1,
    updatedAt: new Date('2026-04-01'),
  },
  {
    id: 'faq-5',
    slug: 'what-payment-methods-accepted',
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards, debit cards, PayPal, Google Pay, and Apple Pay. Some sellers also accept in-person cash transactions through our marketplace.',
    category: 'payment',
    order: 1,
    updatedAt: new Date('2026-04-01'),
  },
  {
    id: 'faq-6',
    slug: 'how-long-to-receive-order',
    question: 'How long does it take to receive my order?',
    answer:
      'Delivery time depends on the seller and shipping method. Digital items are typically instant. Physical items usually arrive within 2-7 business days for local delivery or 7-14 days for shipping.',
    category: 'buying',
    order: 4,
    updatedAt: new Date('2026-04-01'),
  },
  {
    id: 'faq-7',
    slug: 'how-do-i-become-vendor',
    question: 'How do I become a vendor on Musika?',
    answer:
      'Click "Become a Vendor" in the footer or navigation menu. Follow the onboarding wizard to provide your business information, verify your identity, and set up your payment details. Once approved, you can start listing products.',
    category: 'selling',
    order: 1,
    updatedAt: new Date('2026-04-01'),
  },
  {
    id: 'faq-8',
    slug: 'what-fees-do-vendors-pay',
    question: 'What fees do vendors have to pay?',
    answer:
      'Musika charges a 5-8% commission on completed sales (depending on category), plus payment processing fees (2.9% + fixed fee). There are no upfront fees or monthly charges.',
    category: 'selling',
    order: 2,
    updatedAt: new Date('2026-04-01'),
  },
  {
    id: 'faq-9',
    slug: 'how-do-refunds-work',
    question: 'What\'s your return and refund policy?',
    answer:
      'Most sellers offer 14-30 day returns. Check the seller\'s policy before buying. To request a refund, go to "My Orders", select the item, and click "Request Return". The seller will approve or reject your request.',
    category: 'buying',
    order: 5,
    updatedAt: new Date('2026-04-01'),
  },
  {
    id: 'faq-10',
    slug: 'international-student-resources',
    question: 'Are there resources for international students?',
    answer:
      'Yes! Check out our International Resources section for guides on visas, housing, transportation, healthcare, and more. Our community forum is also a great place to ask questions and get advice from fellow students.',
    category: 'general',
    order: 1,
    updatedAt: new Date('2026-04-01'),
  },
];

// Mock support tickets
export const supportTickets: SupportTicket[] = [
  {
    id: 'ticket-1',
    userEmail: 'student@email.com',
    userType: 'student',
    subject: 'Order not delivered after 2 weeks',
    category: 'dispute',
    description: 'I ordered a textbook 14 days ago and it still hasn\'t arrived. The seller is not responding to my messages.',
    status: 'in-progress',
    priority: 'high',
    createdAt: new Date('2026-04-10'),
    updatedAt: new Date('2026-04-15'),
  },
  {
    id: 'ticket-2',
    userEmail: 'vendor@email.com',
    userType: 'vendor',
    subject: 'How do I update my store hours?',
    category: 'technical',
    description: 'I want to update my business hours in the settings but can\'t find the option. Can you help?',
    status: 'waiting-customer',
    priority: 'low',
    createdAt: new Date('2026-04-12'),
    updatedAt: new Date('2026-04-13'),
  },
  {
    id: 'ticket-3',
    userEmail: 'user@email.com',
    userType: 'student',
    subject: 'Can\'t log into my account',
    category: 'account',
    description: 'I keep getting an error when I try to log in. Says "Invalid credentials" but I\'m sure my password is correct.',
    status: 'resolved',
    priority: 'urgent',
    createdAt: new Date('2026-03-28'),
    updatedAt: new Date('2026-03-29'),
    resolvedAt: new Date('2026-03-29'),
  },
];

export function getFAQsByCategory(category: FAQ['category']): FAQ[] {
  return faqs.filter((faq) => faq.category === category).sort((a, b) => a.order - b.order);
}

export function searchFAQs(query: string): FAQ[] {
  const lowerQuery = query.toLowerCase();
  return faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(lowerQuery) || faq.answer.toLowerCase().includes(lowerQuery)
  );
}

export function getFAQBySlug(slug: string): FAQ | undefined {
  return faqs.find((faq) => faq.slug === slug);
}

export function getTicketsByStatus(status: SupportTicket['status']): SupportTicket[] {
  return supportTickets.filter((ticket) => ticket.status === status);
}

export function getTicketById(id: string): SupportTicket | undefined {
  return supportTickets.find((ticket) => ticket.id === id);
}

export function getTicketStatusLabel(status: SupportTicket['status']): string {
  const labels: Record<SupportTicket['status'], string> = {
    open: 'Open',
    'in-progress': 'In Progress',
    'waiting-customer': 'Waiting for You',
    resolved: 'Resolved',
    closed: 'Closed',
  };
  return labels[status];
}
