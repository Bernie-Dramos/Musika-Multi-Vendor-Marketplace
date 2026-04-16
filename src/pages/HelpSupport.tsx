import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import {
  PageSectionContainer,
  PageHeroHeader,
  PageContentCard,
  PageFilterSidebar,
} from '@/components/PageScaffold';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { faqs, searchFAQs, getFAQsByCategory } from '@/lib/support';
import { ChevronDown, Plus } from 'lucide-react';
import type { FAQ } from '@/lib/support';
import {
  formatSupportStatus,
  useCreateSupportTicketMutation,
  useMySupportTicketsQuery,
} from '@/features/support/hooks/useSupport';

type TabType = 'faq' | 'tickets' | 'submit';

export function HelpSupport() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('faq');
  const [selectedCategory, setSelectedCategory] = useState<FAQ['category'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('billing');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [description, setDescription] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const myTicketsQuery = useMySupportTicketsQuery(user?.id);
  const createTicketMutation = useCreateSupportTicketMutation(user?.id);

  // FAQ logic
  const displayedFAQs = useMemo(() => {
    let results = selectedCategory === 'all' ? faqs : getFAQsByCategory(selectedCategory);
    if (searchQuery) {
      results = searchFAQs(searchQuery);
    }
    return results;
  }, [selectedCategory, searchQuery]);

  const categories: Array<{ id: FAQ['category'] | 'all'; label: string; count: number }> = [
    { id: 'all', label: 'All Articles', count: faqs.length },
    { id: 'general', label: 'General', count: faqs.filter((f) => f.category === 'general').length },
    { id: 'buying', label: 'Buying', count: faqs.filter((f) => f.category === 'buying').length },
    { id: 'selling', label: 'Selling', count: faqs.filter((f) => f.category === 'selling').length },
    { id: 'payment', label: 'Payment', count: faqs.filter((f) => f.category === 'payment').length },
    { id: 'safety', label: 'Safety', count: faqs.filter((f) => f.category === 'safety').length },
    { id: 'account', label: 'Account', count: faqs.filter((f) => f.category === 'account').length },
  ];

  const userTickets = myTicketsQuery.data ?? [];

  const handleSubmitTicket = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user) {
      navigate('/signin');
      return;
    }

    if (!subject.trim() || !description.trim()) {
      setSubmitError('Subject and description are required.');
      return;
    }

    setSubmitError(null);

    try {
      await createTicketMutation.mutateAsync({
        subject: subject.trim(),
        category: ticketCategory,
        priority,
        description: description.trim(),
      });

      setSubject('');
      setDescription('');
      setTicketCategory('billing');
      setPriority('medium');
      setActiveTab('tickets');
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit ticket.');
    }
  };

  return (
    <PageSectionContainer>
      <div className="space-y-8">
        {/* Hero */}
        <PageHeroHeader
          title="Help & Support"
          description="Find answers to common questions or contact our support team."
        />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)} className="w-full">
          <TabsList className="bg-slate-100 p-0">
            <TabsTrigger value="faq">Knowledge Base</TabsTrigger>
            {user && <TabsTrigger value="tickets">My Tickets</TabsTrigger>}
            <TabsTrigger value="submit">Contact Support</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <PageFilterSidebar title="Categories">
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-emerald-600 text-white font-medium'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{cat.label}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${selectedCategory === cat.id ? 'bg-white/20' : 'bg-slate-200'}`}
                      >
                        {cat.count}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </PageFilterSidebar>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Search */}
              <div className="relative">
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {/* FAQs List */}
              {displayedFAQs.length === 0 ? (
                <PageContentCard className="text-center py-12">
                  <p className="text-slate-600">No articles found. Try a different search or category.</p>
                </PageContentCard>
              ) : (
                <div className="space-y-2">
                  {displayedFAQs.map((faq) => (
                    <PageContentCard key={faq.id} className="p-0 overflow-hidden">
                      <button
                        className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
                        onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-[#0F172A]">{faq.question}</h3>
                          <Badge variant="secondary" className="mt-2 text-xs">
                            {faq.category}
                          </Badge>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 text-slate-400 flex-shrink-0 ml-4 transition-transform ${
                            expandedFAQ === faq.id ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {expandedFAQ === faq.id && (
                        <div className="px-4 pb-4 border-t border-slate-200 bg-slate-50">
                          <p className="text-slate-700 text-sm leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </PageContentCard>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tickets Tab */}
        {activeTab === 'tickets' && user && (
          <div>
            {myTicketsQuery.isLoading ? (
              <PageContentCard className="py-10 text-center text-slate-600">Loading tickets…</PageContentCard>
            ) : null}

            {myTicketsQuery.isError ? (
              <PageContentCard className="py-10 text-center">
                <p className="mb-4 text-slate-600">Could not load your tickets right now.</p>
                <Button variant="outline" onClick={() => myTicketsQuery.refetch()}>
                  Retry
                </Button>
              </PageContentCard>
            ) : null}

            {!myTicketsQuery.isLoading && !myTicketsQuery.isError && userTickets.length === 0 ? (
              <PageContentCard className="text-center py-12 space-y-4">
                <p className="text-slate-600">You haven't submitted any support tickets yet.</p>
                <Button onClick={() => setActiveTab('submit')} className="bg-emerald-600 hover:bg-emerald-700">
                  Contact Support
                </Button>
              </PageContentCard>
            ) : null}

            {!myTicketsQuery.isLoading && !myTicketsQuery.isError && userTickets.length > 0 ? (
              <div className="space-y-4">
                {userTickets.map((ticket) => (
                  <PageContentCard key={ticket.id} className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#0F172A]">{ticket.subject}</h3>
                        <p className="text-sm text-slate-600 mt-1">Ticket #{ticket.id}</p>
                      </div>
                      <Badge>{formatSupportStatus(ticket.status)}</Badge>
                    </div>
                    <p className="text-sm text-slate-600">{ticket.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-200">
                      <span>Category: {ticket.category}</span>
                      <span>Priority: {ticket.priority}</span>
                      <span>Created: {new Date(ticket.created_at).toLocaleDateString()}</span>
                    </div>
                  </PageContentCard>
                ))}
              </div>
            ) : null}
          </div>
        )}

        {/* Submit Tab */}
        {activeTab === 'submit' && (
          <PageContentCard className="space-y-6 max-w-2xl">
            {user ? (
              <>
                <h2 className="text-xl font-bold text-[#0F172A]">Contact Support</h2>
                <form className="space-y-4" onSubmit={handleSubmitTicket}>
                  {submitError ? (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{submitError}</div>
                  ) : null}
                  <div>
                    <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Subject *</label>
                    <Input
                      placeholder="Brief description of your issue"
                      className="border-slate-300"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="support-category" className="block text-sm font-medium text-[#0F172A] mb-1.5">Category *</label>
                    <select
                      id="support-category"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value)}
                    >
                      <option value="billing">Billing</option>
                      <option value="technical">Technical Issue</option>
                      <option value="account">Account Problem</option>
                      <option value="seller-support">Seller Support</option>
                      <option value="dispute">Dispute</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="support-priority" className="block text-sm font-medium text-[#0F172A] mb-1.5">Priority *</label>
                    <select
                      id="support-priority"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high' | 'urgent')}
                    >
                      <option value="low">Low - General inquiry</option>
                      <option value="medium">Medium - Impacts usage</option>
                      <option value="high">High - Urgent issue</option>
                      <option value="urgent">Urgent - Critical problem</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Description *</label>
                    <textarea
                      placeholder="Please describe your issue in detail..."
                      rows={6}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-slate-300"
                      onClick={() => {
                        setSubject('');
                        setDescription('');
                        setSubmitError(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createTicketMutation.isPending}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      {createTicketMutation.isPending ? 'Submitting…' : 'Submit Ticket'}
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-12 space-y-4">
                <p className="text-slate-600">Sign in to submit a support ticket</p>
                <Button onClick={() => navigate('/signin')} className="bg-emerald-600 hover:bg-emerald-700">
                  Sign In
                </Button>
              </div>
            )}
          </PageContentCard>
        )}
      </div>
    </PageSectionContainer>
  );
}
