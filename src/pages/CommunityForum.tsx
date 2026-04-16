import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import {
  useAllForumPostsQuery,
  useTrendingForumPostsQuery,
  useUnansweredForumPostsQuery,
  useMyForumPostsQuery,
  useSearchForumPostsQuery,
} from '@/features/forum/hooks/useForum';
import {
  PageSectionContainer,
  PageHeroHeader,
  PageContentCard,
  PageFilterSidebar,
} from '@/components/PageScaffold';
import { PageLoadingState, PageEmptyState, PageErrorState } from '@/components/QueryStates';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, ChevronRight, ThumbsUp, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ForumPost } from '@/lib/forum';

type TabType = 'latest' | 'trending' | 'unanswered' | 'my-posts';

export function CommunityForum() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('latest');
  const [searchQuery, setSearchQuery] = useState('');

  // Query hooks for different tabs
  const allPostsQuery = useAllForumPostsQuery();
  const trendingQuery = useTrendingForumPostsQuery();
  const unansweredQuery = useUnansweredForumPostsQuery();
  const myPostsQuery = useMyForumPostsQuery(user?.id);
  const searchQuery_ = useSearchForumPostsQuery(searchQuery);

  // Determine which query to use based on active tab
  const getActiveQuery = () => {
    if (searchQuery && searchQuery.length > 0) {
      return searchQuery_;
    }
    switch (activeTab) {
      case 'trending':
        return trendingQuery;
      case 'unanswered':
        return unansweredQuery;
      case 'my-posts':
        return myPostsQuery;
      default:
        return allPostsQuery;
    }
  };

  const activeQuery = getActiveQuery();
  const posts = useMemo(() => activeQuery.data ?? [], [activeQuery.data]);

  // Category distribution for sidebar
  const categoryCount = useMemo(() => {
    const counts = { housing: 0, academics: 0, legal: 0, events: 0, general: 0 };
    allPostsQuery.data?.forEach((post) => {
      counts[post.category] += 1;
    });
    return counts;
  }, [allPostsQuery.data]);

  const renderPostCard = (post: ForumPost) => (
    <div
      key={post.id}
      onClick={() => navigate(`/community-forum/${post.slug}`)}
      className="cursor-pointer"
    >
      <PageContentCard className="group hover:shadow-md transition-shadow">
      <div className="space-y-3">
        {/* Header with category and answered status */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant="secondary" className="text-xs capitalize">
                {post.category}
              </Badge>
              {post.isAnswered && (
                <Badge className="text-xs bg-emerald-500/80 text-white">Answered</Badge>
              )}
              {post.trending && <Badge className="text-xs bg-orange-500/80 text-white">Trending</Badge>}
            </div>
            <h3 className="text-base font-semibold text-white group-hover:text-emerald-500 transition-colors line-clamp-2">
              {post.title}
            </h3>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
        </div>

        {/* Author and date */}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          {post.authorAvatar && <span>{post.authorAvatar}</span>}
          <span>{post.authorName}</span>
          <span>•</span>
          <span>{Math.floor((new Date().getTime() - post.createdAt.getTime()) / 1000 / 60)} min ago</span>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-2 text-sm text-gray-400 pt-2 border-t border-gray-700">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{post.views}</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="w-4 h-4" />
            <span>{post.upvotes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            <span>{post.repliesCount}</span>
          </div>
        </div>
      </div>
    </PageContentCard>
    </div>
  );

  return (
    <PageSectionContainer>
      <div className="space-y-8">
        {/* Hero section */}
        <PageHeroHeader
          title="Community Forum"
          description="Ask questions, share experiences, and connect with fellow international students."
          action={
            <Button
              onClick={
                user
                  ? () => navigate('/community-forum/new')
                  : () => navigate('/signin', { state: { from: '/community-forum/new' } })
              }
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              Start a Discussion
            </Button>
          }
        />

        {/* Search and layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search */}
            <div className="relative">
              <Input
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500"
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

            {/* Tabs */}
            {!searchQuery && (
              <Tabs
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as TabType)}
                className="w-full"
              >
                <TabsList className="bg-gray-800 border border-gray-700 p-0">
                  <TabsTrigger value="latest">Latest</TabsTrigger>
                  <TabsTrigger value="trending">Trending</TabsTrigger>
                  <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
                  {user && <TabsTrigger value="my-posts">My Posts</TabsTrigger>}
                </TabsList>
              </Tabs>
            )}

            {/* Loading state */}
            {activeQuery.isLoading && (
              <PageLoadingState title="Loading discussions..." description="" />
            )}

            {/* Error state */}
            {activeQuery.isError && (
              <PageErrorState
                title="Failed to load discussions"
                onRetry={() => activeQuery.refetch()}
              />
            )}

            {/* Empty state */}
            {!activeQuery.isLoading && posts.length === 0 && (
              <PageEmptyState
                title={
                  searchQuery
                    ? 'No discussions match your search'
                    : activeTab === 'unanswered'
                      ? 'All questions have been answered! 🎉'
                      : activeTab === 'my-posts'
                        ? "You haven't started any discussions yet"
                        : 'No discussions yet'
                }
                description=""
                action={
                  !searchQuery && activeTab === 'my-posts'
                    ? (
                        <Button
                          onClick={() => navigate('/community-forum/new')}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white"
                        >
                          Start a Discussion
                        </Button>
                      )
                    : undefined
                }
              />
            )}

            {/* Posts list */}
            <div className="space-y-3">
              {posts.map((post) => renderPostCard(post))}
            </div>
          </div>

          {/* Sidebar */}
          <PageFilterSidebar title="Browse">
            <div className="space-y-6">
              {/* Categories */}
              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Categories</h3>
                <div className="space-y-2">
                  {Object.entries(categoryCount).map(([category, count]) => (
                    <button
                      key={category}
                      className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-colors capitalize"
                    >
                      <div className="flex items-center justify-between">
                        <span>{category}</span>
                        <span className="text-xs bg-gray-700 px-2 py-1 rounded">{count}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/30 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-emerald-400 mb-2">Forum Tips</h3>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li>• Be respectful and kind</li>
                  <li>• Search before posting</li>
                  <li>• Provide details in your questions</li>
                  <li>• Mark helpful answers</li>
                </ul>
              </div>
            </div>
          </PageFilterSidebar>
        </div>
      </div>
    </PageSectionContainer>
  );
}
