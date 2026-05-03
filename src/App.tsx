import { lazy, Suspense, useMemo } from 'react';
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
import { CartProvider } from './hooks/useCart';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './features/auth/context/AuthContext';
import { AuthRoute, ProtectedRoute } from './features/auth/components/RouteGuards';
import { getPageFromPath, pageToPath, type NavigablePage } from './lib/navigation';

const Home = lazy(() => import('./pages/Home').then((module) => ({ default: module.Home })));
const Services = lazy(() => import('./pages/Services').then((module) => ({ default: module.Services })));
const Categories = lazy(() => import('./pages/Categories').then((module) => ({ default: module.Categories })));
const Marketplace = lazy(() => import('./pages/Marketplace').then((module) => ({ default: module.Marketplace })));
const SignIn = lazy(() => import('./pages/SignIn').then((module) => ({ default: module.SignIn })));
const SignUp = lazy(() => import('./pages/SignUp').then((module) => ({ default: module.SignUp })));
const NotFound = lazy(() => import('./pages/NotFound').then((module) => ({ default: module.NotFound })));
const InternationalResources = lazy(() =>
  import('./pages/InternationalResources').then((module) => ({ default: module.InternationalResources }))
);
const InternationalResourceDetail = lazy(() =>
  import('./pages/InternationalResourceDetail').then((module) => ({ default: module.InternationalResourceDetail }))
);
const CommunityForum = lazy(() =>
  import('./pages/CommunityForum').then((module) => ({ default: module.CommunityForum }))
);
const CommunityForumNew = lazy(() =>
  import('./pages/CommunityForumNew').then((module) => ({ default: module.CommunityForumNew }))
);
const CommunityForumDetail = lazy(() =>
  import('./pages/CommunityForumDetail').then((module) => ({ default: module.CommunityForumDetail }))
);
const BecomeVendor = lazy(() => import('./pages/BecomeVendor').then((module) => ({ default: module.BecomeVendor })));
const HelpSupport = lazy(() => import('./pages/HelpSupport').then((module) => ({ default: module.HelpSupport })));
const Profile = lazy(() => import('./pages/Profile').then((module) => ({ default: module.Profile })));
const VendorDashboard = lazy(() =>
  import('./pages/VendorDashboard').then((module) => ({ default: module.VendorDashboard }))
);
const AdminDashboard = lazy(() =>
  import('./pages/AdminDashboard').then((module) => ({ default: module.AdminDashboard }))
);
const MyPosts = lazy(() => import('./pages/MyPosts').then((module) => ({ default: module.MyPosts })));
const SavedResources = lazy(() =>
  import('./pages/SavedResources').then((module) => ({ default: module.SavedResources }))
);
const MyTickets = lazy(() => import('./pages/MyTickets').then((module) => ({ default: module.MyTickets })));
const ForgotPassword = lazy(() =>
  import('./pages/ForgotPassword').then((module) => ({ default: module.ForgotPassword }))
);
const AuthCallback = lazy(() =>
  import('./pages/AuthCallback').then((module) => ({ default: module.AuthCallback }))
);

function RouteFallback() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-[#0F172A] font-semibold mb-2">Loading page...</p>
        <p className="text-slate-500 text-sm">Preparing your view.</p>
      </div>
    </div>
  );
}

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
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home navigateTo={navigateTo} />} />
            <Route path="/services" element={<Services navigateTo={navigateTo} />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/international-resources" element={<InternationalResources />} />
            <Route path="/international-resources/:slug" element={<InternationalResourceDetail />} />
            <Route path="/community-forum" element={<CommunityForum />} />
            <Route
              path="/community-forum/new"
              element={
                <ProtectedRoute>
                  <CommunityForumNew />
                </ProtectedRoute>
              }
            />
            <Route path="/community-forum/:slug" element={<CommunityForumDetail />} />
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
              path="/admin-dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
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

            <Route path="/forgot-password" element={<ForgotPassword />} />
            {/* Auth callback: handles email confirmation, password recovery, magic link */}
            <Route path="/auth/callback" element={<AuthCallback />} />

            <Route path="*" element={<NotFound navigateTo={navigateTo} />} />
          </Routes>
        </Suspense>
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
