import {
  forumPosts,
  forumReplies,
  getForumPostBySlug,
  getForumPostReplies,
  getTrendingForumPosts,
  getMyForumPosts,
  type ForumPost,
  type ForumReply,
} from '@/lib/forum';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { ForumCommentRow, ForumPostRow, ProfileRow } from '@/lib/database.types';

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchAllForumPosts(): Promise<ForumPost[]> {
  if (!isSupabaseConfigured || !supabase) {
    await delay(120);
    return forumPosts;
  }

  const { data, error } = await supabase
    .from('forum_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message || 'Failed to load forum posts');
  }

  return mapPostsWithProfiles(data ?? []);
}

export async function fetchTrendingForumPosts(): Promise<ForumPost[]> {
  if (!isSupabaseConfigured || !supabase) {
    await delay(120);
    return getTrendingForumPosts();
  }

  const { data, error } = await supabase
    .from('forum_posts')
    .select('*')
    .eq('is_trending', true)
    .order('upvotes', { ascending: false });

  if (error) {
    throw new Error(error.message || 'Failed to load trending forum posts');
  }

  return mapPostsWithProfiles(data ?? []);
}



export async function fetchMyForumPosts(authorId: string): Promise<ForumPost[]> {
  if (!isSupabaseConfigured || !supabase) {
    await delay(120);
    return getMyForumPosts(authorId);
  }

  const { data, error } = await supabase
    .from('forum_posts')
    .select('*')
    .eq('author_id', authorId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message || 'Failed to load your posts');
  }

  return mapPostsWithProfiles(data ?? []);
}

export async function fetchForumPostBySlug(slug: string): Promise<ForumPost | null> {
  if (!isSupabaseConfigured || !supabase) {
    await delay(120);
    const post = getForumPostBySlug(slug);
    return post || null;
  }

  const { data, error } = await supabase
    .from('forum_posts')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || 'Failed to load forum thread');
  }

  if (!data) {
    return null;
  }

  const mapped = await mapPostsWithProfiles([data]);
  return mapped[0] ?? null;
}

export async function fetchForumPostReplies(postId: string): Promise<ForumReply[]> {
  if (!isSupabaseConfigured || !supabase) {
    await delay(120);
    return getForumPostReplies(postId);
  }

  const { data, error } = await supabase
    .from('forum_comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(error.message || 'Failed to load replies');
  }

  return mapRepliesWithProfiles(data ?? []);
}

export async function searchForumPosts(query: string): Promise<ForumPost[]> {
  if (!isSupabaseConfigured || !supabase) {
    await delay(150);
    const lowerQuery = query.toLowerCase();
    return forumPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowerQuery) ||
        post.content.toLowerCase().includes(lowerQuery) ||
        post.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  }

  const safeQuery = `%${query.trim()}%`;
  const { data, error } = await supabase
    .from('forum_posts')
    .select('*')
    .or(`title.ilike.${safeQuery},content.ilike.${safeQuery}`)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message || 'Failed to search posts');
  }

  return mapPostsWithProfiles(data ?? []);
}

export async function createForumPost(
  post: Omit<ForumPost, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'upvotes' | 'repliesCount' | 'savedCount'>
): Promise<ForumPost> {
  if (!isSupabaseConfigured || !supabase) {
    await delay(200);
    const newPost: ForumPost = {
      ...post,
      id: `post-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
      upvotes: 0,
      repliesCount: 0,
      savedCount: 0,
    };
    forumPosts.push(newPost);
    return newPost;
  }

  const { data, error } = await supabase
    .from('forum_posts')
    .insert({
      slug: post.slug?.trim() ? post.slug : slugify(post.title),
      title: post.title,
      content: post.content,
      category: post.category,
      author_id: post.authorId,
      tags: post.tags,
    })
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message || 'Failed to create post');
  }

  const mapped = await mapPostsWithProfiles([data]);
  return mapped[0];
}

export async function createForumReply(
  reply: Omit<ForumReply, 'id' | 'createdAt' | 'updatedAt' | 'upvotes'>
): Promise<ForumReply> {
  if (!isSupabaseConfigured || !supabase) {
    await delay(150);
    const newReply: ForumReply = {
      ...reply,
      id: `reply-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      upvotes: 0,
    };
    forumReplies.push(newReply);
    const post = forumPosts.find((p) => p.id === reply.postId);
    if (post) {
      post.repliesCount += 1;
    }
    return newReply;
  }

  const { data, error } = await supabase
    .from('forum_comments')
    .insert({
      post_id: reply.postId,
      content: reply.content,
      author_id: reply.authorId,
    })
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message || 'Failed to post reply');
  }

  const mapped = await mapRepliesWithProfiles([data]);
  return mapped[0];
}

export async function upvoteForumPost(postId: string): Promise<ForumPost | null> {
  if (!isSupabaseConfigured || !supabase) {
    await delay(100);
    const post = forumPosts.find((p) => p.id === postId);
    if (post) {
      post.upvotes += 1;
    }
    return post || null;
  }

  const { data: current, error: currentError } = await supabase
    .from('forum_posts')
    .select('*')
    .eq('id', postId)
    .maybeSingle();

  if (currentError) {
    throw new Error(currentError.message || 'Failed to upvote post');
  }

  if (!current) {
    return null;
  }

  const { data, error } = await supabase
    .from('forum_posts')
    .update({ upvotes: current.upvotes + 1 })
    .eq('id', postId)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message || 'Failed to upvote post');
  }

  const mapped = await mapPostsWithProfiles([data]);
  return mapped[0] ?? null;
}

export async function upvoteForumReply(replyId: string): Promise<ForumReply | null> {
  if (!isSupabaseConfigured || !supabase) {
    await delay(100);
    const reply = forumReplies.find((r) => r.id === replyId);
    if (reply) {
      reply.upvotes += 1;
    }
    return reply || null;
  }

  const { data: current, error: currentError } = await supabase
    .from('forum_comments')
    .select('*')
    .eq('id', replyId)
    .maybeSingle();

  if (currentError) {
    throw new Error(currentError.message || 'Failed to upvote reply');
  }

  if (!current) {
    return null;
  }

  const { data, error } = await supabase
    .from('forum_comments')
    .update({ upvotes: current.upvotes + 1 })
    .eq('id', replyId)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message || 'Failed to upvote reply');
  }

  const mapped = await mapRepliesWithProfiles([data]);
  return mapped[0] ?? null;
}

async function mapPostsWithProfiles(rows: ForumPostRow[]): Promise<ForumPost[]> {
  if (!supabase || rows.length === 0) {
    return rows.map((row) => mapPostRow(row));
  }

  const authorIds = [...new Set(rows.map((row) => row.author_id))];
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .in('id', authorIds);

  const profileMap = new Map((profiles ?? []).map((profile) => [profile.id, profile]));

  return rows.map((row) => mapPostRow(row, profileMap.get(row.author_id)));
}

async function mapRepliesWithProfiles(rows: ForumCommentRow[]): Promise<ForumReply[]> {
  if (!supabase || rows.length === 0) {
    return rows.map((row) => mapReplyRow(row));
  }

  const authorIds = [...new Set(rows.map((row) => row.author_id))];
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .in('id', authorIds);

  const profileMap = new Map((profiles ?? []).map((profile) => [profile.id, profile]));

  return rows.map((row) => mapReplyRow(row, profileMap.get(row.author_id)));
}

function mapPostRow(row: ForumPostRow, profile?: ProfileRow): ForumPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    content: row.content,
    category: row.category,
    authorId: row.author_id,
    authorName: profile?.full_name || profile?.email || 'Community Member',
    authorAvatar: profile?.avatar_url || undefined,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    views: row.views,
    upvotes: row.upvotes,
    repliesCount: row.replies_count,
    savedCount: row.saved_count,
    isAnswered: row.is_answered,
    tags: row.tags,
    trending: row.is_trending,
  };
}

function mapReplyRow(row: ForumCommentRow, profile?: ProfileRow): ForumReply {
  return {
    id: row.id,
    postId: row.post_id,
    content: row.content,
    authorId: row.author_id,
    authorName: profile?.full_name || profile?.email || 'Community Member',
    authorAvatar: profile?.avatar_url || undefined,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    upvotes: row.upvotes,
    isAnswer: row.is_answer,
  };
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
