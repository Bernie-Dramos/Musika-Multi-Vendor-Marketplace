import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import {
  useForumPostBySlugQuery,
  useForumPostRepliesQuery,
  useCreateForumReplyMutation,
  useUpvoteForumPostMutation,
  useUpvoteForumReplyMutation,
} from '@/features/forum/hooks/useForum';
import {
  PageSectionContainer,
  PageContentCard,
} from '@/components/PageScaffold';
import { PageLoadingState, PageEmptyState, PageErrorState } from '@/components/QueryStates';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, MessageSquare, BookmarkIcon, Flag, ChevronLeft } from 'lucide-react';

export function CommunityForumDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const postQuery = useForumPostBySlugQuery(slug);
  const repliesQuery = useForumPostRepliesQuery(postQuery.data?.id);
  const createReplyMutation = useCreateForumReplyMutation();
  const upvotePostMutation = useUpvoteForumPostMutation();
  const upvoteReplyMutation = useUpvoteForumReplyMutation();

  const post = postQuery.data;
  const replies = useMemo(() => repliesQuery.data ?? [], [repliesQuery.data]);

  const handleReplySubmit = async () => {
    if (!replyContent.trim() || !user || !post) return;

    setIsSubmitting(true);
    try {
      await createReplyMutation.mutateAsync({
        postId: post.id,
        content: replyContent,
        authorId: user.id || 'user-anonymous',
        authorName: user.email?.split('@')[0] || 'Anonymous',
      });
      setReplyContent('');
    } catch (error) {
      console.error('Failed to submit reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpvotePost = async () => {
    if (!post) return;
    try {
      await upvotePostMutation.mutateAsync(post.id);
    } catch (error) {
      console.error('Failed to upvote post:', error);
    }
  };

  const handleUpvoteReply = async (replyId: string) => {
    try {
      await upvoteReplyMutation.mutateAsync(replyId);
    } catch (error) {
      console.error('Failed to upvote reply:', error);
    }
  };

  // Loading state
  if (postQuery.isLoading) {
    return (
      <PageSectionContainer>
        <PageLoadingState title="Loading thread..." description="" />
      </PageSectionContainer>
    );
  }

  // Error state
  if (postQuery.isError) {
    return (
      <PageSectionContainer>
        <PageErrorState
          title="Failed to load thread"
          onRetry={() => postQuery.refetch()}
        />
      </PageSectionContainer>
    );
  }

  // Empty state
  if (!post) {
    return (
      <PageSectionContainer>
        <PageEmptyState title="Thread not found" description="" />
      </PageSectionContainer>
    );
  }

  return (
    <PageSectionContainer>
      <div className="space-y-6">
        {/* Back button */}
        <button
          onClick={() => navigate('/community-forum')}
          className="flex items-center gap-2 text-emerald-500 hover:text-emerald-400 transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Forum
        </button>

        {/* Post */}
        <PageContentCard className="space-y-6">
          {/* Header */}
          <div className="space-y-3 border-b border-gray-700 pb-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <Badge variant="secondary" className="text-xs capitalize">
                    {post.category}
                  </Badge>
                  {post.isAnswered && (
                    <Badge className="text-xs bg-emerald-500/80 text-white">Answered</Badge>
                  )}
                  {post.trending && (
                    <Badge className="text-xs bg-orange-500/80 text-white">Trending</Badge>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-white">{post.title}</h1>
              </div>
            </div>

            {/* Author info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-lg">
                {post.authorAvatar || post.authorName[0]}
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">{post.authorName}</p>
                <p className="text-sm text-gray-400">
                  {Math.floor((new Date().getTime() - post.createdAt.getTime()) / 1000 / 60)} min ago
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{post.content}</p>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-700">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-4 border-t border-gray-700">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUpvotePost}
              className="text-gray-400 hover:text-emerald-500"
            >
              <ThumbsUp className="w-4 h-4 mr-1" />
              {post.upvotes}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-emerald-500"
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              {replies.length}
            </Button>
            {user && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-emerald-500"
                >
                  <BookmarkIcon className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-emerald-500"
                >
                  <Flag className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </PageContentCard>

        {/* Reply form */}
        {user ? (
          <PageContentCard className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Add Your Reply</h2>
            <div className="space-y-3">
              <Textarea
                placeholder="Share your thoughts..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-24 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => setReplyContent('')}
                  variant="outline"
                  className="border-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReplySubmit}
                  disabled={!replyContent.trim() || isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {isSubmitting ? 'Posting...' : 'Post Reply'}
                </Button>
              </div>
            </div>
          </PageContentCard>
        ) : (
          <PageContentCard className="text-center py-8">
            <p className="text-gray-400 mb-4">Sign in to post a reply</p>
            <Button
              onClick={() => navigate('/signin')}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Sign In
            </Button>
          </PageContentCard>
        )}

        {/* Replies */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white">
            {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
          </h2>

          {repliesQuery.isLoading ? (
            <PageLoadingState title="Loading replies..." description="" />
          ) : replies.length === 0 ? (
            <PageEmptyState title="No replies yet. Be the first to respond!" description="" />
          ) : (
            replies.map((reply) => (
              <PageContentCard key={reply.id} className="space-y-3">
                {/* Reply author */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-lg">
                      {reply.authorAvatar || reply.authorName[0]}
                    </div>
                    <div>
                      <p className="text-white font-medium">{reply.authorName}</p>
                      <p className="text-sm text-gray-400">
                        {Math.floor((new Date().getTime() - reply.createdAt.getTime()) / 1000 / 60)} min ago
                      </p>
                    </div>
                  </div>
                  {reply.isAnswer && (
                    <Badge className="bg-emerald-500/80 text-white text-xs">Answered</Badge>
                  )}
                </div>

                {/* Reply content */}
                <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{reply.content}</p>

                {/* Reply actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-700">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUpvoteReply(reply.id)}
                    className="text-gray-400 hover:text-emerald-500"
                  >
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    {reply.upvotes}
                  </Button>
                  {user && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-emerald-500"
                      >
                        Reply
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-emerald-500"
                      >
                        <Flag className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </PageContentCard>
            ))
          )}
        </div>
      </div>
    </PageSectionContainer>
  );
}
