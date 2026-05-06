import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';

function GuardLoading() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <p className="text-slate-600">Loading...</p>
    </div>
  );
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <GuardLoading />;
  }

  if (!isAuthenticated) {
    const from = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to="/signin" state={{ from }} replace />;
  }

  return <>{children}</>;
}

export function AuthRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, profile, user } = useAuth();

  if (isLoading) {
    return <GuardLoading />;
  }

  if (isAuthenticated) {
    const metadataRole = typeof user?.user_metadata?.role === 'string'
      ? user.user_metadata.role
      : undefined;
    const role = profile?.role ?? metadataRole;

    if (!role) {
      return <GuardLoading />;
    }

    if (role === 'admin') return <Navigate to="/admin-dashboard" replace />;
    if (role === 'vendor') return <Navigate to="/vendor-dashboard" replace />;
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
}

export function AdminRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isAdmin, isLoading, profile, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <GuardLoading />;
  }

  if (!isAuthenticated) {
    const from = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to="/signin" state={{ from }} replace />;
  }

  const metadataRole = typeof user?.user_metadata?.role === 'string'
    ? user.user_metadata.role
    : undefined;
  const hasAdminRole = isAdmin || profile?.role === 'admin' || metadataRole === 'admin';

  if (!profile?.role && !metadataRole) {
    return <GuardLoading />;
  }

  if (!hasAdminRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export function VendorRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, profile, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <GuardLoading />;
  }

  if (!isAuthenticated) {
    const from = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to="/signin" state={{ from }} replace />;
  }

  const metadataRole = typeof user?.user_metadata?.role === 'string'
    ? user.user_metadata.role
    : undefined;
  const role = profile?.role ?? metadataRole;

  if (!role) {
    return <GuardLoading />;
  }

  if (role === 'admin') {
    return <Navigate to="/admin-dashboard" replace />;
  }

  if (role !== 'vendor') {
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
}
