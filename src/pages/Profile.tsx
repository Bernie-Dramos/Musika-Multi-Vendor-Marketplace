import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useProfileQuery, useUpdateProfileMutation } from '@/features/profile/hooks/useProfile';
import { useUnreadMessageCountQuery } from '@/features/messaging/hooks/useMessaging';
import { PageSectionContainer, PageHeroHeader, PageContentCard } from '@/components/PageScaffold';
import { PageErrorState, PageLoadingState } from '@/components/QueryStates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Profile() {
  const navigate = useNavigate();
  const { user, signOut, profile: authProfile } = useAuth();
  const profileQuery = useProfileQuery(user?.id);
  const updateProfileMutation = useUpdateProfileMutation(user?.id);
  const unreadCount = useUnreadMessageCountQuery(user?.id, profileQuery.data?.role).data ?? 0;

  const [draftProfile, setDraftProfile] = useState<{
    full_name: string;
    university: string;
    country: string;
  } | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Redirect admins and vendors to their own dashboards — this page is students-only
  // (placed after hooks to satisfy Rules of Hooks)
  if (authProfile?.role === 'admin') return <Navigate to="/admin-dashboard" replace />;
  if (authProfile?.role === 'vendor') return <Navigate to="/vendor-dashboard" replace />;

  const profileValues = draftProfile ?? {
    full_name: profileQuery.data?.full_name ?? '',
    university: profileQuery.data?.university ?? '',
    country: profileQuery.data?.country ?? '',
  };

  const handleSave = async () => {
    setStatusMessage(null);
    try {
      await updateProfileMutation.mutateAsync({
        full_name: profileValues.full_name.trim() || null,
        university: profileValues.university.trim() || null,
        country: profileValues.country.trim() || null,
      });
      setDraftProfile(null);
      setStatusMessage('Profile updated successfully.');
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Failed to update profile.');
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate('/signin', { replace: true });
    }
  };

  return (
    <PageSectionContainer>
      <PageHeroHeader
        title="My Profile"
        description="Manage your account details, saved items, and activity."
      />

      {profileQuery.isLoading ? <PageLoadingState title="Loading profile" /> : null}

      {profileQuery.isError ? (
        <PageErrorState
          title="Unable to load profile"
          description="Try refreshing the page."
          onRetry={() => profileQuery.refetch()}
        />
      ) : null}

      {!profileQuery.isLoading && !profileQuery.isError ? (
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <PageContentCard className="space-y-5">
            <h2 className="text-lg font-semibold text-[#0F172A]">Account Details</h2>

            {statusMessage ? (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">{statusMessage}</div>
            ) : null}

            <div>
              <label htmlFor="profile-email" className="mb-1.5 block text-sm font-medium text-[#0F172A]">
                Email
              </label>
              <Input id="profile-email" value={user?.email ?? ''} disabled className="bg-slate-50" />
            </div>

            <div>
              <label htmlFor="profile-name" className="mb-1.5 block text-sm font-medium text-[#0F172A]">
                Full Name
              </label>
              <Input
                id="profile-name"
                value={profileValues.full_name}
                onChange={(event) =>
                  setDraftProfile((previous) => ({
                    full_name: event.target.value,
                    university: previous?.university ?? profileValues.university,
                    country: previous?.country ?? profileValues.country,
                  }))
                }
              />
            </div>

            <div>
              <label htmlFor="profile-university" className="mb-1.5 block text-sm font-medium text-[#0F172A]">
                University
              </label>
              <Input
                id="profile-university"
                value={profileValues.university}
                onChange={(event) =>
                  setDraftProfile((previous) => ({
                    full_name: previous?.full_name ?? profileValues.full_name,
                    university: event.target.value,
                    country: previous?.country ?? profileValues.country,
                  }))
                }
              />
            </div>

            <div>
              <label htmlFor="profile-country" className="mb-1.5 block text-sm font-medium text-[#0F172A]">
                Country
              </label>
              <Input
                id="profile-country"
                value={profileValues.country}
                onChange={(event) =>
                  setDraftProfile((previous) => ({
                    full_name: previous?.full_name ?? profileValues.full_name,
                    university: previous?.university ?? profileValues.university,
                    country: event.target.value,
                  }))
                }
              />
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => {
                  void handleSave();
                }}
                disabled={updateProfileMutation.isPending}
                className="bg-emerald-600 text-white hover:bg-emerald-700"
              >
                {updateProfileMutation.isPending ? 'Saving…' : 'Save Changes'}
              </Button>
            </div>
          </PageContentCard>

          <PageContentCard className="space-y-4">
            <h2 className="text-lg font-semibold text-[#0F172A]">Account</h2>
            <p className="text-sm text-slate-600">
              Role: <span className="font-medium capitalize">{profileQuery.data?.role ?? 'student'}</span>
            </p>
            <Button variant="outline" className="w-full border-slate-300" onClick={() => navigate('/my-posts')}>
              My Posts
            </Button>
            <Button variant="outline" className="w-full border-slate-300" onClick={() => navigate('/saved-resources')}>
              Saved Resources
            </Button>
            <Button variant="outline" className="w-full border-slate-300" onClick={() => navigate('/my-tickets')}>
              My Tickets
            </Button>
            <Button variant="outline" className="w-full border-slate-300" onClick={() => navigate('/messages')}>
              Open Message Inbox
              {unreadCount > 0 && (
                <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
            <Button variant="destructive" className="w-full" onClick={() => void handleSignOut()}>
              Sign Out
            </Button>
          </PageContentCard>
        </div>
      ) : null}
    </PageSectionContainer>
  );
}
