// Vendor onboarding data types and mock data

export interface VendorApplication {
  id: string;
  vendorId: string;
  businessName: string;
  businessType: 'individual' | 'business' | 'non-profit';
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  businessDescription: string;
  category: string;
  businessRegistration?: string;
  taxId?: string;
  paymentMethod: 'bank-transfer' | 'stripe' | 'paypal';
  bankAccount?: {
    bankName: string;
    accountHolder: string;
    accountNumber: string;
  };
  status: 'draft' | 'submitted' | 'review' | 'approved' | 'rejected' | 'revision-required';
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VendorBenefit {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface VendorRequirement {
  id: string;
  title: string;
  description: string;
  required: boolean;
}

// Mock vendor benefits
export const vendorBenefits: VendorBenefit[] = [
  {
    id: 'benefit-1',
    title: 'Reach Students Worldwide',
    description: 'List your products and services to thousands of international students seeking what you offer.',
    icon: '🌍',
  },
  {
    id: 'benefit-2',
    title: 'Trusted Verification',
    description: 'Our verification process ensures buyer confidence and protects your business reputation.',
    icon: '✓',
  },
  {
    id: 'benefit-3',
    title: 'Easy Dashboard',
    description: 'Manage orders, inventory, and communications all in one intuitive place.',
    icon: '📊',
  },
  {
    id: 'benefit-4',
    title: 'Flexible Payments',
    description: 'Choose your preferred payout method: bank transfer, Stripe Connect, or PayPal.',
    icon: '💳',
  },
  {
    id: 'benefit-5',
    title: 'Built-in Support',
    description: 'Priority support for vendors with dedicated help and performance insights.',
    icon: '🎯',
  },
  {
    id: 'benefit-6',
    title: 'No Setup Fees',
    description: 'Start selling for free. We only take a commission on successful sales.',
    icon: '💰',
  },
];

// Mock vendor requirements
export const vendorRequirements: VendorRequirement[] = [
  {
    id: 'req-1',
    title: 'Valid Business Registration',
    description: 'Registered business with valid tax ID or personal identification',
    required: true,
  },
  {
    id: 'req-2',
    title: 'Compliant Product/Service',
    description: 'Products and services must comply with local laws and our policies',
    required: true,
  },
  {
    id: 'req-3',
    title: 'Professional Presence',
    description: 'Well-written business description and quality product images',
    required: true,
  },
  {
    id: 'req-4',
    title: 'Payment Account',
    description: 'Valid bank account or payment processor for receiving payouts',
    required: true,
  },
  {
    id: 'req-5',
    title: 'Customer Service Commitment',
    description: 'Commitment to respond to customer inquiries within 48 hours',
    required: false,
  },
  {
    id: 'req-6',
    title: 'Return/Refund Policy',
    description: 'Clear policy on returns, refunds, and customer satisfaction',
    required: false,
  },
];

// Mock vendor applications
export const vendorApplications: VendorApplication[] = [
  {
    id: 'app-1',
    vendorId: 'vendor-1',
    businessName: 'StudyBooks Plus',
    businessType: 'business',
    ownerName: 'Aisha Mohamed',
    ownerEmail: 'aisha@studybooksplus.com',
    ownerPhone: '+1-416-555-0123',
    businessDescription: 'Selling used textbooks and study materials to university students.',
    category: 'books-education',
    businessRegistration: 'ON1234567890',
    taxId: 'TR123456789',
    paymentMethod: 'bank-transfer',
    status: 'approved',
    submittedAt: new Date('2026-02-15'),
    reviewedAt: new Date('2026-02-18'),
    createdAt: new Date('2026-02-10'),
    updatedAt: new Date('2026-02-18'),
  },
  {
    id: 'app-2',
    vendorId: 'vendor-2',
    businessName: 'Tutor Express',
    businessType: 'individual',
    ownerName: 'Marcus Johnson',
    ownerEmail: 'marcus@tutorexpress.com',
    ownerPhone: '+1-416-555-0124',
    businessDescription: 'Online tutoring services in Math, Physics, and Computer Science.',
    category: 'services-tutoring',
    paymentMethod: 'stripe',
    status: 'review',
    submittedAt: new Date('2026-04-10'),
    createdAt: new Date('2026-04-05'),
    updatedAt: new Date('2026-04-10'),
  },
  {
    id: 'app-3',
    vendorId: 'vendor-3',
    businessName: 'Home Supplies Co',
    businessType: 'business',
    ownerName: 'Sarah Chen',
    ownerEmail: 'sarah@homesupplies.com',
    ownerPhone: '+1-416-555-0125',
    businessDescription: 'Dorm essentials, furniture, and home decor for students.',
    category: 'home-supplies',
    businessRegistration: 'ON9876543210',
    paymentMethod: 'paypal',
    status: 'submitted',
    submittedAt: new Date('2026-04-14'),
    createdAt: new Date('2026-04-14'),
    updatedAt: new Date('2026-04-14'),
  },
];

export function getVendorApplicationByVendorId(vendorId: string): VendorApplication | undefined {
  return vendorApplications.find((app) => app.vendorId === vendorId);
}

export function getVendorApplicationStatus(status: VendorApplication['status']): {
  label: string;
  description: string;
} {
  const statuses = {
    draft: { label: 'Draft', description: 'Your application is not yet submitted' },
    submitted: {
      label: 'Submitted',
      description: 'Your application has been received and is awaiting review',
    },
    review: {
      label: 'Under Review',
      description: 'Our team is reviewing your application. This usually takes 2-3 business days',
    },
    'revision-required': {
      label: 'Revision Required',
      description: 'We need some additional information or corrections before approval',
    },
    approved: {
      label: 'Approved',
      description: 'Congratulations! You can now start selling on Musika',
    },
    rejected: {
      label: 'Declined',
      description: 'Unfortunately, your application does not meet our requirements at this time',
    },
  };
  return statuses[status];
}
