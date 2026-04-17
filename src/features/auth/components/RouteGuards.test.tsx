import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthRoute, ProtectedRoute } from '@/features/auth/components/RouteGuards';

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
    mockUseAuth.mockReturnValue({ isAuthenticated: true, isLoading: false });

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
});
