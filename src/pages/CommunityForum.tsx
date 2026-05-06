import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import {
  useAllForumPostsQuery,
  useTrendingForumPostsQuery,
  useMyForumPostsQuery,
  useSearchForumPostsQuery,
  useForumPostRepliesQuery,
  useCreateForumReplyMutation,
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
import { MessageSquare, ChevronRight, ThumbsUp, Eye, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ForumPost } from '@/lib/forum';

type TabType = 'latest' | 'trending' | 'my-posts';

export function CommunityForum() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [discussionPage, setDiscussionPage] = useState(0);
  const [commentPage, setCommentPage] = useState(0);
  const [newComment, setNewComment] = useState('');
  const DISCUSSIONS_PER_PAGE = 4;
  const COMMENTS_PER_PAGE = 6;

  // Query hooks for different tabs
  const allPostsQuery = useAllForumPostsQuery();
  const trendingQuery = useTrendingForumPostsQuery();

  const myPostsQuery = useMyForumPostsQuery(user?.id);
  const searchQuery_ = useSearchForumPostsQuery(searchQuery);
  const repliesQuery = useForumPostRepliesQuery(expandedPostId ?? undefined);
  const createReplyMutation = useCreateForumReplyMutation();

  // Determine which query to use based on active tab
  const getActiveQuery = () => {
    if (searchQuery && searchQuery.length > 0) {
      return searchQuery_;
    }
    switch (activeTab) {
      case 'trending':
        return trendingQuery;
      case 'my-posts':
        return myPostsQuery;
      default:
        return allPostsQuery;
    }
  };

  const activeQuery = getActiveQuery();
  
  // Filter by category if selected
  const filteredPosts = useMemo(() => {
    let result = activeQuery.data ?? [];
    if (selectedCategory) {
      result = result.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }
    return result;
  }, [activeQuery.data, selectedCategory]);

  const posts = useMemo(() => {
    const start = discussionPage * DISCUSSIONS_PER_PAGE;
    return filteredPosts.slice(start, start + DISCUSSIONS_PER_PAGE);
  }, [filteredPosts, discussionPage]);

  // Category distribution for sidebar
  const categoryCount = useMemo(() => {
    const counts = { housing: 0, academics: 0, legal: 0, events: 0, general: 0 };
    allPostsQuery.data?.forEach((post) => {
      counts[post.category] += 1;
    });
    return counts;
  }, [allPostsQuery.data]);

  const toggleComments = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (expandedPostId === postId) {
      setExpandedPostId(null);
    } else {
      setExpandedPostId(postId);
      setCommentPage(0);
      setNewComment('');
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!newComment.trim() || !user) return;
    
    try {
      await createReplyMutation.mutateAsync({
        postId,
        content: newComment,
        authorId: user.id,
        authorName: user.user_metadata?.full_name || user.email || 'Anonymous',
      });
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const paginatedComments = useMemo(() => {
    if (!repliesQuery.data) return [];
    const start = commentPage * COMMENTS_PER_PAGE;
    return repliesQuery.data.slice(start, start + COMMENTS_PER_PAGE);
  }, [repliesQuery.data, commentPage]);

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
              <Badge variant="outline" className="text-[10px] capitalize bg-[#1E2530] text-gray-400 border-[rgba(255,255,255,0.1)]">
                {post.category}
              </Badge>
              {post.isAnswered && (
                <Badge className="text-xs bg-emerald-500/80 text-white">Answered</Badge>
              )}
              {post.trending && <Badge className="text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold tracking-wide uppercase">Trending</Badge>}
            </div>
            <h3 className="text-base font-semibold text-[#0D0D0D] transition-colors line-clamp-2">
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
          <div className="flex items-center gap-1 hover:text-gray-400 transition-none">
            <ThumbsUp className="w-4 h-4 hover:scale-100 transition-none" />
            <span>{post.upvotes}</span>
          </div>
          <div 
            className="flex items-center gap-1 cursor-pointer hover:text-gray-400 transition-none"
            onClick={(e) => toggleComments(post.id, e)}
          >
            <MessageSquare className="w-4 h-4 hover:scale-100 transition-none" />
            <span>{post.repliesCount ?? 0}</span>
          </div>
        </div>

        {/* Inline Comments Section */}
        {expandedPostId === post.id && (
          <div className="mt-4 pt-4 border-t border-gray-700 animate-in fade-in slide-in-from-top-2 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-200 mb-2">Comments</h4>
              {repliesQuery.isLoading ? (
                <div className="text-sm text-gray-400 py-2">Loading comments...</div>
              ) : repliesQuery.data && repliesQuery.data.length > 0 ? (
                <>
                  <div className="space-y-3">
                    {paginatedComments.map((reply) => (
                      <div key={reply.id} className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-gray-900">{reply.authorName}</span>
                          <span className="text-[10px] text-gray-400">
                            {Math.floor((new Date().getTime() - reply.createdAt.getTime()) / 1000 / 60 / 60)}h ago
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{reply.content}</p>
                      </div>
                    ))}
                  </div>

                  {repliesQuery.data.length > COMMENTS_PER_PAGE && (
                    <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={commentPage === 0}
                          onClick={() => setCommentPage(p => p - 1)}
                          className="h-8 px-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50"
                        >
                          <ChevronLeft className="w-4 h-4 mr-1" />
                          Prev
                        </Button>
                        <span className="text-[11px] font-medium text-gray-400">
                          {commentPage + 1} / {Math.ceil(repliesQuery.data.length / COMMENTS_PER_PAGE)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={(commentPage + 1) * COMMENTS_PER_PAGE >= repliesQuery.data.length}
                          onClick={() => setCommentPage(p => p + 1)}
                          className="h-8 px-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50"
                        >
                          Next
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                      <span className="text-[10px] text-gray-400 italic">
                        {repliesQuery.data.length} total comments
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-sm text-gray-500 py-2">No comments yet. Be the first to reply!</div>
              )}

              {/* Add Comment Form */}
              <div className="mt-4 space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <textarea
                  placeholder={user ? "Write a comment..." : "Sign in to join the discussion"}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  disabled={!user || createReplyMutation.isPending}
                  className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-none min-h-[80px] text-gray-800"
                />
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    onClick={() => handleAddComment(post.id)}
                    disabled={!user || !newComment.trim() || createReplyMutation.isPending}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-4 shadow-sm"
                  >
                    {createReplyMutation.isPending ? 'Posting...' : 'Post Comment'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
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
                className="pl-10 bg-[#1E2530] border-[rgba(255,255,255,0.15)] text-white placeholder:text-[#9CA3AF]"
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
                <TabsList className="bg-[#1E2530] border border-[rgba(255,255,255,0.15)] p-1 h-auto">
                  <TabsTrigger 
                    value="latest" 
                    className="data-[state=active]:bg-white data-[state=active]:text-[#1E2530] text-[#9CA3AF] px-4 py-2 transition-all"
                  >
                    Latest
                  </TabsTrigger>
                  <TabsTrigger 
                    value="trending" 
                    className="data-[state=active]:bg-white data-[state=active]:text-[#1E2530] text-[#9CA3AF] px-4 py-2 transition-all"
                  >
                    Trending
                  </TabsTrigger>
                  {user && (
                    <TabsTrigger 
                      value="my-posts" 
                      className="data-[state=active]:bg-white data-[state=active]:text-[#1E2530] text-[#9CA3AF] px-4 py-2 transition-all"
                    >
                      My Posts
                    </TabsTrigger>
                  )}
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

            {/* Discussion Pagination */}
            {filteredPosts.length > DISCUSSIONS_PER_PAGE && (
              <div className="flex items-center justify-center gap-6 pt-8 pb-4">
                <Button
                  variant="outline"
                  onClick={() => setDiscussionPage(p => Math.max(0, p - 1))}
                  disabled={discussionPage === 0}
                  className="flex items-center gap-2 border-gray-700 bg-[#1E2530] text-gray-300 hover:bg-gray-800 hover:text-white disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: Math.ceil(filteredPosts.length / DISCUSSIONS_PER_PAGE) }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setDiscussionPage(i)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        discussionPage === i ? 'bg-emerald-500 w-4' : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                      aria-label={`Page ${i + 1}`}
                    />
                  ))}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setDiscussionPage(p => p + 1)}
                  disabled={(discussionPage + 1) * DISCUSSIONS_PER_PAGE >= filteredPosts.length}
                  className="flex items-center gap-2 border-gray-700 bg-[#1E2530] text-gray-300 hover:bg-gray-800 hover:text-white disabled:opacity-30"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
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
                      onClick={() => {
                        setSelectedCategory(selectedCategory === category ? null : category);
                        setDiscussionPage(0);
                      }}
                      className={`w-full text-left px-1 py-1 rounded-lg transition-all group ${
                        selectedCategory === category ? 'bg-emerald-500/10' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant="outline" 
                          className={`text-[11px] capitalize font-medium px-3 py-1 transition-all group-hover:shadow-[0_0_12px_rgba(245,158,11,0.15)] group-hover:border-amber-500/30 group-hover:text-amber-500 ${
                            selectedCategory === category 
                              ? 'bg-emerald-500 text-white border-emerald-500' 
                              : 'bg-gray-800 text-gray-300 border-gray-700'
                          }`}
                        >
                          #{category}
                        </Badge>
                        <span className={`text-xs px-2 transition-colors ${
                          selectedCategory === category ? 'text-emerald-400 font-bold' : 'text-gray-500'
                        }`}>{count}</span>
                      </div>
                    </button>
                  ))}
                  {selectedCategory && (
                    <button 
                      onClick={() => {
                        setSelectedCategory(null);
                        setDiscussionPage(0);
                      }}
                      className="text-[10px] text-gray-500 hover:text-emerald-400 mt-2 flex items-center gap-1 mx-1"
                    >
                      Clear filter
                    </button>
                  )}
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
