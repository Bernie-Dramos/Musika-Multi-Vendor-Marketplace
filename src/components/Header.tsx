import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bell,
  ChevronDown,
  Globe,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Search,
  ShoppingCart,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { BrandLogo } from '@/components/BrandLogo';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/features/auth/context/AuthContext';
import type { AppPage, NavigablePage } from '@/lib/navigation';

type CurrentPage = AppPage;

interface HeaderProps {
  navigateTo: (page: NavigablePage) => void;
  currentPage: CurrentPage;
}

const navLinks = [
  { label: 'Browse Services', page: 'services' as NavigablePage },
  { label: 'International Resources', page: 'international-resources' as NavigablePage },
  { label: 'Community Forum', page: 'community-forum' as NavigablePage },
  { label: 'Become a Vendor', page: 'become-vendor' as NavigablePage },
  { label: 'Help & Support', page: 'help-support' as NavigablePage },
];

const languageOptions = ['EN', 'AR', 'HI', 'PT', 'SN', 'XH', 'ZU'];

export function Header({ navigateTo, currentPage }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('EN');
  const [isElevated, setIsElevated] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement | null>(null);
  const languageButtonRef = useRef<HTMLButtonElement | null>(null);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const profileButtonRef = useRef<HTMLButtonElement | null>(null);
  const { totalItems, setIsCartOpen } = useCart();
  const { user, isAuthenticated, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setIsElevated(window.scrollY > 4);
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        languageMenuRef.current &&
        !languageMenuRef.current.contains(target) &&
        languageButtonRef.current &&
        !languageButtonRef.current.contains(target)
      ) {
        setLanguageMenuOpen(false);
      }

      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(target)
      ) {
        setProfileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', onScroll);
    document.addEventListener('mousedown', onPointerDown);

    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mousedown', onPointerDown);
    };
  }, []);

  const displayName = useMemo(() => {
    const fullName = typeof user?.user_metadata?.full_name === 'string' ? user.user_metadata.full_name.trim() : '';
    return fullName || user?.email || 'Musika User';
  }, [user]);

  const avatarSrc = useMemo(() => {
    const avatarUrl = typeof user?.user_metadata?.avatar_url === 'string' ? user.user_metadata.avatar_url.trim() : '';
    if (avatarUrl) {
      return avatarUrl;
    }

    const seed = encodeURIComponent(displayName || user?.email || 'musika-user');
    return `https://api.dicebear.com/9.x/initials/svg?seed=${seed}`;
  }, [displayName, user?.email, user?.user_metadata]);

  const dashboardPage = useMemo<NavigablePage>(() => {
    const role = typeof user?.user_metadata?.role === 'string' ? user.user_metadata.role : undefined;
    return role === 'vendor' ? 'vendor-dashboard' : 'profile';
  }, [user?.user_metadata]);

  const handleLogout = async () => {
    await signOut();
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
    navigateTo('home');
  };

  const handleNavigate = (page: NavigablePage) => {
    navigateTo(page);
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  };

  const isActive = (page: NavigablePage) => currentPage === page;

  return (
    <header
      className={`sticky top-0 z-50 border-b border-[#212632] bg-[#121722] text-white transition-shadow duration-200 ${
        isElevated ? 'shadow-[0_8px_30px_rgba(2,6,23,0.28)]' : ''
      }`}
    >
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-[68px] items-center gap-3 lg:gap-5">
          <button onClick={() => handleNavigate('home')} className="shrink-0" aria-label="Go to home page">
            <BrandLogo variant="header" />
          </button>

          <div className="hidden min-w-[116px] items-center gap-2 text-xs text-[#d8e1ee] xl:flex">
            <MapPin className="h-4 w-4 shrink-0 text-[#ff6b57]" />
            <div className="leading-tight">
              <p className="font-medium">Pune, India</p>
              <button type="button" className="text-[10px] text-[#aab7cc] transition-colors hover:text-white">
                Update Location
              </button>
            </div>
          </div>

          <div className="hidden flex-1 lg:block">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#d6dae3]" />
              <input
                type="text"
                placeholder="Search for Accommodation, Transportation..."
                className="h-[44px] w-full rounded-full border border-[#4a4e57] bg-[#2f323a] pl-11 pr-5 text-sm text-white placeholder:text-[#cbcfd6] focus:border-[#6a717c] focus:outline-none"
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <div className="relative hidden sm:block">
              <button
                ref={languageButtonRef}
                type="button"
                onClick={() => setLanguageMenuOpen((open) => !open)}
                className="flex items-center gap-1 rounded-full px-2 py-2 text-sm text-[#edf2fa] transition-colors hover:bg-white/5"
              >
                <Globe className="h-4 w-4" />
                <span>{selectedLanguage}</span>
                <ChevronDown className="h-3 w-3 text-[#aab7cc]" />
              </button>

              {languageMenuOpen ? (
                <div ref={languageMenuRef} className="absolute right-0 top-12 w-24 rounded-2xl border border-[#2f3340] bg-[#161b25] p-1 shadow-2xl">
                  {languageOptions.map((language) => (
                    <button
                      key={language}
                      type="button"
                      onClick={() => {
                        setSelectedLanguage(language);
                        setLanguageMenuOpen(false);
                      }}
                      className={`w-full rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                        selectedLanguage === language ? 'bg-[#2d3340] text-white' : 'text-[#c7d1de] hover:bg-[#232835]'
                      }`}
                    >
                      {language}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            {isAuthenticated ? (
              <button
                type="button"
                className="relative hidden rounded-full p-2 text-[#edf2fa] transition-colors hover:bg-white/5 sm:inline-flex"
                onClick={() => handleNavigate('my-tickets')}
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#f5c242]" />
              </button>
            ) : null}

            <button
              type="button"
              className="relative rounded-full p-2 text-[#edf2fa] transition-colors hover:bg-white/5"
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-[#f5c242] px-1 text-[10px] font-semibold text-[#10151f]">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              ) : null}
            </button>

            {isAuthenticated ? (
              <div className="relative hidden sm:block">
                <button
                  ref={profileButtonRef}
                  type="button"
                  onClick={() => setProfileMenuOpen((open) => !open)}
                  className="flex items-center rounded-full border border-white/10 p-0.5 transition-colors hover:border-white/20"
                  aria-label="Open user menu"
                >
                  <img src={avatarSrc} alt={displayName} className="h-9 w-9 rounded-full object-cover" />
                </button>

                {profileMenuOpen ? (
                  <div ref={profileMenuRef} className="absolute right-0 top-12 w-64 rounded-2xl border border-[#2d3340] bg-[#161b25] p-2 shadow-2xl">
                    <div className="mb-2 rounded-xl bg-white/5 px-3 py-3">
                      <p className="truncate text-sm font-semibold text-white">{displayName}</p>
                      <p className="truncate text-xs text-[#aab7cc]">{user?.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleNavigate(dashboardPage)}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#e7edf7] transition-colors hover:bg-[#232835]"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNavigate('profile')}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#e7edf7] transition-colors hover:bg-[#232835]"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#ffb3b0] transition-colors hover:bg-[#2b2023]"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="hidden items-center gap-2 lg:flex">
                <Button
                  variant="ghost"
                  className="rounded-full border border-white/15 px-5 text-white hover:bg-white/5 hover:text-white"
                  onClick={() => handleNavigate('signin')}
                >
                  Login
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full border-white/30 bg-transparent px-5 text-white hover:bg-white/5 hover:text-white"
                  onClick={() => handleNavigate('signup')}
                >
                  SignUp
                </Button>
              </div>
            )}

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button type="button" className="rounded-full p-2 text-white transition-colors hover:bg-white/5 lg:hidden" aria-label="Open navigation menu">
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] border-l border-[#202631] bg-[#121722] p-0 text-white">
                <div className="flex h-full flex-col">
                  <div className="border-b border-[#222734] px-5 py-5">
                    <button onClick={() => handleNavigate('home')} className="block" aria-label="Go to home page">
                      <BrandLogo variant="header" />
                    </button>
                    <div className="mt-4 flex items-center gap-2 text-xs text-[#c7d1de]">
                      <MapPin className="h-4 w-4 text-[#ff6b57]" />
                      <div>
                        <p className="font-medium">Pune, India</p>
                        <p className="text-[10px] text-[#9ba8bc]">Update Location</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-b border-[#222734] p-5">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#b3bdca]" />
                      <input
                        type="text"
                        placeholder="Search Musika"
                        className="h-11 w-full rounded-full border border-[#414651] bg-[#2f323a] pl-10 pr-4 text-sm text-white placeholder:text-[#c7cbd3] focus:border-[#596271] focus:outline-none"
                      />
                    </div>
                  </div>

                  {isAuthenticated ? (
                    <div className="border-b border-[#222734] px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img src={avatarSrc} alt={displayName} className="h-11 w-11 rounded-full object-cover" />
                        <div>
                          <p className="text-sm font-semibold text-white">{displayName}</p>
                          <p className="text-xs text-[#aab7cc]">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <nav className="flex-1 px-4 py-4">
                    <ul className="space-y-1">
                      {navLinks.map((link) => (
                        <li key={link.label}>
                          <button
                            type="button"
                            className={`block w-full rounded-2xl px-4 py-3 text-left text-sm transition-colors ${
                              isActive(link.page) ? 'bg-white/10 text-white' : 'text-[#d8e1ee] hover:bg-white/5'
                            }`}
                            onClick={() => handleNavigate(link.page)}
                          >
                            {link.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </nav>

                  <div className="border-t border-[#222734] p-4">
                    {isAuthenticated ? (
                      <div className="space-y-2">
                        <Button className="w-full rounded-full bg-white text-[#10151f] hover:bg-[#e8eef6]" onClick={() => handleNavigate(dashboardPage)}>
                          Dashboard
                        </Button>
                        <Button variant="outline" className="w-full rounded-full border-white/20 bg-transparent text-white hover:bg-white/5 hover:text-white" onClick={() => handleNavigate('profile')}>
                          Profile
                        </Button>
                        <Button variant="outline" className="w-full rounded-full border-white/20 bg-transparent text-white hover:bg-white/5 hover:text-white" onClick={handleLogout}>
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full rounded-full border-white/20 bg-transparent text-white hover:bg-white/5 hover:text-white" onClick={() => handleNavigate('signin')}>
                          Login
                        </Button>
                        <Button className="w-full rounded-full bg-white text-[#10151f] hover:bg-[#e8eef6]" onClick={() => handleNavigate('signup')}>
                          SignUp
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <nav className="hidden bg-[#0b0d11] lg:block">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
          <ul className="flex h-[52px] items-center justify-between gap-6 text-[15px] text-white">
            {navLinks.map((link) => (
              <li key={link.label} className="flex-1">
                <button
                  type="button"
                  onClick={() => handleNavigate(link.page)}
                  className={`h-full w-full whitespace-nowrap border-b-2 px-2 text-center transition-colors ${
                    isActive(link.page) ? 'border-white text-white' : 'border-transparent text-white/90 hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}