import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchVendorApplications, updateVendorApplicationStatus, fetchForumPosts, deleteForumPost } from '@/lib/admin';

export function AdminCompliance() {
  const queryClient = useQueryClient();
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  // Vendor applications needing revision
  const { data: revisionData, isLoading: revLoading } = useQuery({
    queryKey: ['adminCompliance', 'revision'],
    queryFn: () => fetchVendorApplications('revision_required', 1, 10),
    staleTime: 30_000,
  });

  // Forum posts for moderation
  const { data: forumData, isLoading: forumLoading } = useQuery({
    queryKey: ['adminCompliance', 'forum'],
    queryFn: () => fetchForumPosts(1, 10),
    staleTime: 30_000,
  });

  const requestRevision = useMutation({
    mutationFn: (id: string) => updateVendorApplicationStatus(id, 'revision_required', 'Further documentation required.'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCompliance'] });
      queryClient.invalidateQueries({ queryKey: ['adminVendors'] });
      setActionMsg('Vendor marked for revision.');
      setTimeout(() => setActionMsg(null), 2500);
    },
  });

  const approveVendor = useMutation({
    mutationFn: (id: string) => updateVendorApplicationStatus(id, 'approved'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCompliance'] });
      queryClient.invalidateQueries({ queryKey: ['adminVendors'] });
      setActionMsg('Vendor approved.');
      setTimeout(() => setActionMsg(null), 2500);
    },
  });

  const removePost = useMutation({
    mutationFn: (id: string) => deleteForumPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCompliance'] });
      setActionMsg('Forum post removed.');
      setTimeout(() => setActionMsg(null), 2500);
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#111111] sm:text-4xl">Compliance</h1>
        <p className="text-[#6b7280]">Review vendor applications requiring revision and moderate forum content.</p>
      </div>

      {actionMsg && (
        <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">{actionMsg}</div>
      )}

      {/* Revision-required vendor applications */}
      <div className="rounded-xl border border-[#e5e7eb] bg-white">
        <div className="border-b border-[#f3f4f6] px-6 py-4">
          <h2 className="font-semibold text-[#111111]">Vendor Applications – Revision Required</h2>
        </div>
        {revLoading ? (
          <p className="px-6 py-8 text-center text-sm text-[#9ca3af]">Loading…</p>
        ) : (revisionData?.data ?? []).length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-[#9ca3af]">No applications requiring revision.</p>
        ) : (
          <ul className="divide-y divide-[#f3f4f6]">
            {(revisionData?.data ?? []).map((app) => (
              <li key={app.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-[#111111]">{app.business_name}</p>
                  <p className="text-xs text-[#9ca3af]">{app.owner_name} · {app.owner_email}</p>
                  {app.review_notes && (
                    <p className="mt-1 text-xs text-orange-600">Note: {app.review_notes}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => approveVendor.mutate(app.id)}
                    disabled={approveVendor.isPending}
                    className="rounded-full bg-[#111111] px-4 py-1.5 text-xs text-white hover:bg-black disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => requestRevision.mutate(app.id)}
                    disabled={requestRevision.isPending}
                    className="rounded-full border border-[#d1d5db] px-4 py-1.5 text-xs hover:bg-[#f3f4f6] disabled:opacity-50"
                  >
                    Re-flag
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Forum moderation */}
      <div className="rounded-xl border border-[#e5e7eb] bg-white">
        <div className="border-b border-[#f3f4f6] px-6 py-4">
          <h2 className="font-semibold text-[#111111]">Forum Moderation</h2>
          <p className="mt-0.5 text-xs text-[#9ca3af]">Review and remove posts if necessary.</p>
        </div>
        {forumLoading ? (
          <p className="px-6 py-8 text-center text-sm text-[#9ca3af]">Loading…</p>
        ) : (forumData?.data ?? []).length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-[#9ca3af]">No forum posts found.</p>
        ) : (
          <ul className="divide-y divide-[#f3f4f6]">
            {(forumData?.data ?? []).map((post) => (
              <li key={post.id} className="flex flex-wrap items-start justify-between gap-3 px-6 py-4">
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-[#111111]">{post.title}</p>
                  <p className="text-xs text-[#9ca3af]">
                    {post.category} · {post.replies_count} replies · {post.upvotes} upvotes ·{' '}
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => removePost.mutate(post.id)}
                  disabled={removePost.isPending}
                  className="rounded-full border border-red-200 px-4 py-1.5 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
