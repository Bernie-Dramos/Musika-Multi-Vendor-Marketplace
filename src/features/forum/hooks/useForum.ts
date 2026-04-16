import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchAllForumPosts,
  fetchTrendingForumPosts,
  fetchUnansweredForumPosts,
  fetchMyForumPosts,
  fetchForumPostBySlug,
  fetchForumPostReplies,
  searchForumPosts,
  createForumPost,
  createForumReply,
  upvoteForumPost,
  upvoteForumReply,
} from '../api/forumApi';

// Query hooks
export function useAllForumPostsQuery() {
  return useQuery({
    queryKey: ['forum-posts', 'all'],
    queryFn: fetchAllForumPosts,
  });
}

export function useTrendingForumPostsQuery() {
  return useQuery({
    queryKey: ['forum-posts', 'trending'],
    queryFn: fetchTrendingForumPosts,
  });
}

export function useUnansweredForumPostsQuery() {
  return useQuery({
    queryKey: ['forum-posts', 'unanswered'],
    queryFn: fetchUnansweredForumPosts,
  });
}

export function useMyForumPostsQuery(authorId: string | undefined) {
  return useQuery({
    queryKey: ['forum-posts', 'my-posts', authorId],
    queryFn: () => fetchMyForumPosts(authorId!),
    enabled: !!authorId,
  });
}

export function useForumPostBySlugQuery(slug: string | undefined) {
  return useQuery({
    queryKey: ['forum-post', slug],
    queryFn: () => fetchForumPostBySlug(slug!),
    enabled: !!slug,
  });
}

export function useForumPostRepliesQuery(postId: string | undefined) {
  return useQuery({
    queryKey: ['forum-replies', postId],
    queryFn: () => fetchForumPostReplies(postId!),
    enabled: !!postId,
  });
}

export function useSearchForumPostsQuery(query: string | undefined) {
  return useQuery({
    queryKey: ['forum-posts', 'search', query],
    queryFn: () => searchForumPosts(query!),
    enabled: !!query && query.length > 0,
  });
}

// Mutation hooks
export function useCreateForumPostMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createForumPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
    },
  });
}

export function useCreateForumReplyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createForumReply,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-replies'] });
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
    },
  });
}

export function useUpvoteForumPostMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: upvoteForumPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
    },
  });
}

export function useUpvoteForumReplyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: upvoteForumReply,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-replies'] });
    },
  });
}
