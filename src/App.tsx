import { useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartSidebar } from './components/CartSidebar';
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { Categories } from './pages/Categories';
import { Marketplace } from './pages/Marketplace';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { NotFound } from './pages/NotFound';
import { InternationalResources } from './pages/InternationalResources';
import { CommunityForum } from './pages/CommunityForum';
import { BecomeVendor } from './pages/BecomeVendor';
import { HelpSupport } from './pages/HelpSupport';
import { Profile } from './pages/Profile';
import { VendorDashboard } from './pages/VendorDashboard';
import { MyPosts } from './pages/MyPosts';
import { SavedResources } from './pages/SavedResources';
import { MyTickets } from './pages/MyTickets';
import { CartProvider } from './hooks/useCart';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './features/auth/context/AuthContext';
import { AuthRoute, ProtectedRoute } from './features/auth/components/RouteGuards';
import { getPageFromPath, pageToPath, type NavigablePage } from './lib/navigation';

function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPage = getPageFromPath(location.pathname);

  const navigateTo = (page: NavigablePage) => {
    navigate(pageToPath[page]);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header navigateTo={navigateTo} currentPage={currentPage} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home navigateTo={navigateTo} />} />
          <Route path="/services" element={<Services navigateTo={navigateTo} />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/international-resources" element={<InternationalResources />} />
          <Route path="/community-forum" element={<CommunityForum />} />
          <Route path="/become-vendor" element={<BecomeVendor />} />
          <Route path="/help-support" element={<HelpSupport />} />

          <Route
            path="/signin"
            element={
              <AuthRoute>
                <SignIn navigateTo={navigateTo} />
              </AuthRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthRoute>
                <SignUp navigateTo={navigateTo} />
              </AuthRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor-dashboard"
            element={
              <ProtectedRoute>
                <VendorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-posts"
            element={
              <ProtectedRoute>
                <MyPosts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved-resources"
            element={
              <ProtectedRoute>
                <SavedResources />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-tickets"
            element={
              <ProtectedRoute>
                <MyTickets />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound navigateTo={navigateTo} />} />
        </Routes>
      </main>
      <Footer navigateTo={navigateTo} />
      <CartSidebar />
    </div>
  );
}

function App() {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
    []
  );

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <ErrorBoundary>
              <AppShell />
            </ErrorBoundary>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
