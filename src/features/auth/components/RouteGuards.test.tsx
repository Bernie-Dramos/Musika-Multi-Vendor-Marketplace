import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthRoute, NonVendorRoute, ProtectedRoute } from '@/features/auth/components/RouteGuards';

const mockUseAuth = jest.fn();

jest.mock('@/features/auth/context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('Authentication module - RouteGuards', () => {
  beforeEach(() => {
    mockUseAuth.mockReset();
  });

  it('shows loading state while auth status is unresolved', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, isLoading: true });

    render(
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route
            path="/private"
            element={
              <ProtectedRoute>
                <div>Private area</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('redirects unauthenticated users to signin route', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, isLoading: false });

    render(
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route
            path="/private"
            element={
              <ProtectedRoute>
                <div>Private area</div>
              </ProtectedRoute>
            }
          />
          <Route path="/signin" element={<div>Sign In Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Sign In Page')).toBeInTheDocument();
  });

  it('allows authenticated users in protected route', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true, isLoading: false });

    render(
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route
            path="/private"
            element={
              <ProtectedRoute>
                <div>Private area</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Private area')).toBeInTheDocument();
  });

  it('redirects authenticated users away from auth pages', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      profile: { role: 'student' },
      user: { user_metadata: {} },
    });

    render(
      <MemoryRouter initialEntries={['/signin']}>
        <Routes>
          <Route
            path="/signin"
            element={
              <AuthRoute>
                <div>Sign In Form</div>
              </AuthRoute>
            }
          />
          <Route path="/profile" element={<div>Profile Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Profile Page')).toBeInTheDocument();
  });

  it('shows loading state in non-vendor route while auth status is unresolved', () => {
    mockUseAuth.mockReturnValue({ isLoading: true, profile: null, user: null });

    render(
      <MemoryRouter initialEntries={['/become-vendor']}>
        <Routes>
          <Route
            path="/become-vendor"
            element={
              <NonVendorRoute>
                <div>Become Vendor Page</div>
              </NonVendorRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('allows guests in non-vendor route', () => {
    mockUseAuth.mockReturnValue({ isLoading: false, profile: null, user: null });

    render(
      <MemoryRouter initialEntries={['/become-vendor']}>
        <Routes>
          <Route
            path="/become-vendor"
            element={
              <NonVendorRoute>
                <div>Become Vendor Page</div>
              </NonVendorRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Become Vendor Page')).toBeInTheDocument();
  });

  it('allows student users in non-vendor route', () => {
    mockUseAuth.mockReturnValue({
      isLoading: false,
      profile: { role: 'student' },
      user: { user_metadata: {} },
    });

    render(
      <MemoryRouter initialEntries={['/become-vendor']}>
        <Routes>
          <Route
            path="/become-vendor"
            element={
              <NonVendorRoute>
                <div>Become Vendor Page</div>
              </NonVendorRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Become Vendor Page')).toBeInTheDocument();
  });

  it('redirects vendor users away from non-vendor route', () => {
    mockUseAuth.mockReturnValue({
      isLoading: false,
      profile: { role: 'vendor' },
      user: { user_metadata: { role: 'vendor' } },
    });

    render(
      <MemoryRouter initialEntries={['/become-vendor']}>
        <Routes>
          <Route
            path="/become-vendor"
            element={
              <NonVendorRoute>
                <div>Become Vendor Page</div>
              </NonVendorRoute>
            }
          />
          <Route path="/vendor-dashboard" element={<div>Vendor Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Vendor Dashboard')).toBeInTheDocument();
  });

  it('redirects admin users away from non-vendor route', () => {
    mockUseAuth.mockReturnValue({
      isLoading: false,
      profile: { role: 'admin' },
      user: { user_metadata: { role: 'admin' } },
    });

    render(
      <MemoryRouter initialEntries={['/become-vendor']}>
        <Routes>
          <Route
            path="/become-vendor"
            element={
              <NonVendorRoute>
                <div>Become Vendor Page</div>
              </NonVendorRoute>
            }
          />
          <Route path="/admin-dashboard" element={<div>Admin Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
  });
});
