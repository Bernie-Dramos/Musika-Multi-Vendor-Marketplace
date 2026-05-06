import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
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
import { AdminRoute, AuthRoute, ProtectedRoute } from './features/auth/components/RouteGuards';
import { getPageFromPath, pageToPath, type NavigablePage } from './lib/navigation';

const loadHome = () => import('./pages/Home');
const loadServices = () => import('./pages/Services');
const loadCategories = () => import('./pages/Categories');
const loadMarketplace = () => import('./pages/Marketplace');
const loadSignIn = () => import('./pages/SignIn');
const loadSignUp = () => import('./pages/SignUp');
const loadNotFound = () => import('./pages/NotFound');
const loadInternationalResources = () => import('./pages/InternationalResources');
const loadInternationalResourceDetail = () => import('./pages/InternationalResourceDetail');
const loadCommunityForum = () => import('./pages/CommunityForum');
const loadCommunityForumNew = () => import('./pages/CommunityForumNew');
const loadCommunityForumDetail = () => import('./pages/CommunityForumDetail');
const loadBecomeVendor = () => import('./pages/BecomeVendor');
const loadHelpSupport = () => import('./pages/HelpSupport');
const loadProfile = () => import('./pages/Profile');
const loadVendorDashboard = () => import('./pages/VendorDashboard');
const loadAdminDashboard = () => import('./pages/AdminDashboard');
const loadMyPosts = () => import('./pages/MyPosts');
const loadSavedResources = () => import('./pages/SavedResources');
const loadMyTickets = () => import('./pages/MyTickets');
const loadForgotPassword = () => import('./pages/ForgotPassword');
const loadServiceDetail = () => import('./pages/ServiceDetail');
const loadProductDetail = () => import('./pages/ProductDetail');
const loadVendorDetail = () => import('./pages/VendorDetail');
const loadAuthCallback = () => import('./pages/AuthCallback');

const Home = lazy(() => loadHome().then((module) => ({ default: module.Home })));
const Services = lazy(() => loadServices().then((module) => ({ default: module.Services })));
const Categories = lazy(() => loadCategories().then((module) => ({ default: module.Categories })));
const Marketplace = lazy(() => loadMarketplace().then((module) => ({ default: module.Marketplace })));
const SignIn = lazy(() => loadSignIn().then((module) => ({ default: module.SignIn })));
const SignUp = lazy(() => loadSignUp().then((module) => ({ default: module.SignUp })));
const NotFound = lazy(() => loadNotFound().then((module) => ({ default: module.NotFound })));
const InternationalResources = lazy(() =>
  loadInternationalResources().then((module) => ({ default: module.InternationalResources }))
);
const InternationalResourceDetail = lazy(() =>
  loadInternationalResourceDetail().then((module) => ({ default: module.InternationalResourceDetail }))
);
const CommunityForum = lazy(() =>
  loadCommunityForum().then((module) => ({ default: module.CommunityForum }))
);
const CommunityForumNew = lazy(() =>
  loadCommunityForumNew().then((module) => ({ default: module.CommunityForumNew }))
);
const CommunityForumDetail = lazy(() =>
  loadCommunityForumDetail().then((module) => ({ default: module.CommunityForumDetail }))
);
const BecomeVendor = lazy(() => loadBecomeVendor().then((module) => ({ default: module.BecomeVendor })));
const HelpSupport = lazy(() => loadHelpSupport().then((module) => ({ default: module.HelpSupport })));
const Profile = lazy(() => loadProfile().then((module) => ({ default: module.Profile })));
const VendorDashboard = lazy(() =>
  loadVendorDashboard().then((module) => ({ default: module.VendorDashboard }))
);
const AdminDashboard = lazy(() =>
  loadAdminDashboard().then((module) => ({ default: module.AdminDashboard }))
);
const MyPosts = lazy(() => loadMyPosts().then((module) => ({ default: module.MyPosts })));
const SavedResources = lazy(() =>
  loadSavedResources().then((module) => ({ default: module.SavedResources }))
);
const MyTickets = lazy(() => loadMyTickets().then((module) => ({ default: module.MyTickets })));
const ForgotPassword = lazy(() =>
  loadForgotPassword().then((module) => ({ default: module.ForgotPassword }))
);
const ServiceDetail = lazy(() =>
  loadServiceDetail().then((module) => ({ default: module.ServiceDetail }))
);
const ProductDetail = lazy(() =>
  loadProductDetail().then((module) => ({ default: module.ProductDetail }))
);
const VendorDetail = lazy(() =>
  loadVendorDetail().then((module) => ({ default: module.VendorDetail }))
);
const AuthCallback = lazy(() =>
  loadAuthCallback().then((module) => ({ default: module.AuthCallback }))
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

function DelayedRouteFallback() {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowFallback(true), 650);
    return () => clearTimeout(timer);
  }, []);

  if (!showFallback) {
    return <div className="min-h-[50vh]" />;
  }

  return <RouteFallback />;
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
        <Suspense fallback={<DelayedRouteFallback />}>
          <Routes>
            <Route path="/" element={<Home navigateTo={navigateTo} />} />
            <Route path="/services" element={<Services navigateTo={navigateTo} />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/service/:id" element={<ServiceDetail />} />
            <Route path="/vendor/:name" element={<VendorDetail />} />
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
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
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
  useEffect(() => {
    const timer = setTimeout(() => {
      void Promise.all([
        loadServices(),
        loadSignIn(),
        loadSignUp(),
        loadBecomeVendor(),
        loadHelpSupport(),
      ]).catch(() => undefined);
    }, 120);

    return () => clearTimeout(timer);
  }, []);

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
