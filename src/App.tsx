import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartSidebar } from './components/CartSidebar';
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { Categories } from './pages/Categories';
import { Marketplace } from './pages/Marketplace';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { CartProvider } from './hooks/useCart';

type Page = 'home' | 'services' | 'categories' | 'marketplace' | 'signin' | 'signup';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.slice(1) as Page;
      if (['home', 'services', 'categories', 'marketplace', 'signin', 'signup'].includes(path)) {
        setCurrentPage(path || 'home');
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Set initial page based on URL
    const path = window.location.pathname.slice(1) as Page;
    if (['home', 'services', 'categories', 'marketplace', 'signin', 'signup'].includes(path)) {
      setCurrentPage(path || 'home');
    }

    return () => window.removeEventListener('popstate', handlePopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    window.history.pushState({}, '', page === 'home' ? '/' : `/${page}`);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home navigateTo={navigateTo} />;
      case 'services':
        return <Services navigateTo={navigateTo} />;
      case 'categories':
        return <Categories navigateTo={navigateTo} />;
      case 'marketplace':
        return <Marketplace navigateTo={navigateTo} />;
      case 'signin':
        return <SignIn navigateTo={navigateTo} />;
      case 'signup':
        return <SignUp navigateTo={navigateTo} />;
      default:
        return <Home navigateTo={navigateTo} />;
    }
  };

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-white">
        <Header navigateTo={navigateTo} currentPage={currentPage} />
        <main className="flex-1">
          {renderPage()}
        </main>
        <Footer navigateTo={navigateTo} />
        <CartSidebar />
      </div>
    </CartProvider>
  );
}

export default App;
