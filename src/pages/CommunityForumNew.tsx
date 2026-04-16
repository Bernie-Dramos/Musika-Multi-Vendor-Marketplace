import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useCreateForumPostMutation } from '@/features/forum/hooks/useForum';
import { PageSectionContainer, PageContentCard, PageHeroHeader } from '@/components/PageScaffold';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function CommunityForumNew() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createPostMutation = useCreateForumPostMutation();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'housing' | 'academics' | 'legal' | 'events' | 'general'>('general');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isSubmitting = createPostMutation.isPending;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user) {
      navigate('/signin', { state: { from: '/community-forum/new' } });
      return;
    }

    if (!title.trim() || !content.trim()) {
      setErrorMessage('Title and content are required.');
      return;
    }

    setErrorMessage(null);

    try {
      const created = await createPostMutation.mutateAsync({
        slug: title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-'),
        title: title.trim(),
        content: content.trim(),
        category,
        authorId: user.id,
        authorName: user.email?.split('@')[0] || 'Community Member',
        isAnswered: false,
        tags: tags
          .split(',')
          .map((entry) => entry.trim())
          .filter(Boolean),
      });

      navigate(`/community-forum/${created.slug}`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to create discussion.');
    }
  };

  return (
    <PageSectionContainer>
      <PageHeroHeader
        title="Start a Discussion"
        description="Ask a clear question and include details so the community can help quickly."
      />

      <PageContentCard className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMessage ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{errorMessage}</div>
          ) : null}

          <div>
            <label htmlFor="post-title" className="mb-2 block text-sm font-medium text-[#0F172A]">
              Title
            </label>
            <Input
              id="post-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="What do you need help with?"
              required
            />
          </div>

          <div>
            <label htmlFor="post-category" className="mb-2 block text-sm font-medium text-[#0F172A]">
              Category
            </label>
            <select
              id="post-category"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as 'housing' | 'academics' | 'legal' | 'events' | 'general')
              }
              className="h-10 w-full rounded-lg border border-slate-300 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="general">General</option>
              <option value="housing">Housing</option>
              <option value="academics">Academics</option>
              <option value="legal">Legal</option>
              <option value="events">Events</option>
            </select>
          </div>

          <div>
            <label htmlFor="post-content" className="mb-2 block text-sm font-medium text-[#0F172A]">
              Details
            </label>
            <Textarea
              id="post-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Share context, location, timeline, and anything you already tried."
              rows={7}
              required
            />
          </div>

          <div>
            <label htmlFor="post-tags" className="mb-2 block text-sm font-medium text-[#0F172A]">
              Tags (comma separated)
            </label>
            <Input
              id="post-tags"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              placeholder="visa, housing, pune"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => navigate('/community-forum')}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 text-white hover:bg-emerald-700">
              {isSubmitting ? 'Publishing…' : 'Publish Discussion'}
            </Button>
          </div>
        </form>
      </PageContentCard>
    </PageSectionContainer>
  );
}
