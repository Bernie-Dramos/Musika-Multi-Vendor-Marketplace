import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useMyForumPostsQuery } from '@/features/forum/hooks/useForum';
import { Button } from '@/components/ui/button';
import { PageSectionContainer, PageHeroHeader, PageContentCard } from '@/components/PageScaffold';
import { PageEmptyState, PageErrorState, PageLoadingState } from '@/components/QueryStates';

export function MyPosts() {
  const { user } = useAuth();
  const myPostsQuery = useMyForumPostsQuery(user?.id);
  const posts = myPostsQuery.data ?? [];

  return (
    <PageSectionContainer>
      <PageHeroHeader
        title="My Posts"
        description="Manage your discussions, drafts, and community engagement."
      />

      {myPostsQuery.isLoading ? <PageLoadingState title="Loading your posts" /> : null}

      {myPostsQuery.isError ? (
        <PageErrorState
          title="Unable to load your posts"
          description="Please try again."
          onRetry={() => myPostsQuery.refetch()}
        />
      ) : null}

      {!myPostsQuery.isLoading && !myPostsQuery.isError && posts.length === 0 ? (
        <PageEmptyState
          title="You have not started a discussion yet"
          description="Create your first post to get help from the community."
          action={
            <Link to="/community-forum/new">
              <Button className="bg-emerald-600 text-white hover:bg-emerald-700">Start Discussion</Button>
            </Link>
          }
        />
      ) : null}

      {!myPostsQuery.isLoading && !myPostsQuery.isError && posts.length > 0 ? (
        <div className="space-y-3">
          {posts.map((post) => (
            <Link key={post.id} to={`/community-forum/${post.slug}`}>
              <PageContentCard className="transition-shadow hover:shadow-md">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-[#0F172A]">{post.title}</h3>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600 capitalize">
                    {post.category}
                  </span>
                </div>
                <p className="mb-4 line-clamp-2 text-sm text-slate-600">{post.content}</p>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  <span className="inline-flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5" />
                    {post.repliesCount} replies
                  </span>
                  <span>{post.upvotes} upvotes</span>
                </div>
              </PageContentCard>
            </Link>
          ))}
        </div>
      ) : null}
    </PageSectionContainer>
  );
}
