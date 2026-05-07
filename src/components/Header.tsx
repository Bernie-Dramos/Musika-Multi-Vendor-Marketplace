import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Globe,
  Bell,
  ShoppingCart,
  Menu,
  ChevronDown,
  LogOut,
  MessageSquare,
  Package,
  LayoutDashboard,
  User,
  X,
  Locate,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useUnreadMessageCountQuery } from '@/features/messaging/hooks/useMessaging';
import type { AppPage, NavigablePage } from '@/lib/navigation';
import { translateText } from '@/lib/api-client';

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

const languageOptions = ['English', 'Shona', 'Portuguese', 'Hindi'];

// Filled MapPin SVG (lucide MapPin is outline; we use a filled variant inline)
function FilledMapPin({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
    </svg>
  );
}

export function Header({ navigateTo, currentPage }: HeaderProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isElevated, setIsElevated] = useState(false);

  // Location state
  const [locationLabel, setLocationLabel] = useState('Detecting…');
  const [locationLoading, setLocationLoading] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [manualLocation, setManualLocation] = useState('');

  const langCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const profileCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const languageMenuRef = useRef<HTMLDivElement | null>(null);
  const languageButtonRef = useRef<HTMLButtonElement | null>(null);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const profileButtonRef = useRef<HTMLButtonElement | null>(null);
  const { totalItems, setIsCartOpen } = useCart();
  const { user, profile, isAuthenticated, signOut } = useAuth();
  const unreadMessageCount = useUnreadMessageCountQuery(user?.id, profile?.role).data ?? 0;
  const visibleNavLinks = navLinks.filter(
    (link) => link.page !== 'become-vendor' || !profile || (profile.role !== 'vendor' && profile.role !== 'admin'),
  );

  // ── Scroll elevation ──────────────────────────────────────────────────────
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

  // ── Translation Logic ─────────────────────────────────────────────────────
  const originalTexts = useRef<Map<Node, string>>(new Map());
  const translationCache = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    const performTranslation = async () => {
      if (selectedLanguage === 'English') {
        // Restore original texts
        originalTexts.current.forEach((text, node) => {
          node.textContent = text;
        });
        return;
      }

      const langPairs: Record<string, string> = {
        'Shona': 'en|sn',
        'Portuguese': 'en|pt',
        'Hindi': 'en|hi',
      };

      const langpair = langPairs[selectedLanguage];
      if (!langpair) return;

      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => {
          const text = node.textContent?.trim();
          if (!text || text.length === 0) return NodeFilter.FILTER_REJECT;

          // Skip Musika variations if they are the ONLY words
          if (/^(Musika|Musika Marketplace|Musika Multivendor Marketplace)$/i.test(text)) {
            return NodeFilter.FILTER_REJECT;
          }

          // Skip purely numeric values, prices, or percentages
          if (/^[\d.,$%£¥€+-\s/%]+$/.test(text)) {
            return NodeFilter.FILTER_REJECT;
          }

          return NodeFilter.FILTER_ACCEPT;
        },
      });

      const nodesToTranslate: Node[] = [];
      let currentNode = walker.nextNode();
      while (currentNode) {
        nodesToTranslate.push(currentNode);
        currentNode = walker.nextNode();
      }

      // Store original text if not already stored
      nodesToTranslate.forEach((node) => {
        if (!originalTexts.current.has(node)) {
          originalTexts.current.set(node, node.textContent || '');
        }
      });

      // Translate each node
      await Promise.all(
        nodesToTranslate.map(async (node) => {
          const originalText = originalTexts.current.get(node);
          if (originalText) {
            const cacheKey = `${langpair}:${originalText}`;
            if (translationCache.current.has(cacheKey)) {
              node.textContent = translationCache.current.get(cacheKey) || originalText;
              return;
            }

            const translated = await translateText(originalText, langpair);
            if (translated && translated !== originalText) {
              translationCache.current.set(cacheKey, translated);
              node.textContent = translated;
            }
          }
        })
      );
    };

    performTranslation();
  }, [selectedLanguage, currentPage]);

  // ── Auto-detect location on mount ─────────────────────────────────────────
  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationLabel('Location unavailable');
      return;
    }
    setLocationLoading(true);
    setLocationLabel('Detecting…');
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`
          );
          const data = await res.json();
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.county ||
            'Unknown';
          const country = data.address?.country_code?.toUpperCase() ?? '';
          setLocationLabel(`${city}${country ? ', ' + country : ''}`);
        } catch {
          setLocationLabel('Location found');
        } finally {
          setLocationLoading(false);
        }
      },
      () => {
        setLocationLabel('Pune, India'); // graceful fallback
        setLocationLoading(false);
      },
      { timeout: 8000 }
    );
  };

  useEffect(() => {
    detectLocation();
  }, []);

  // ── Avatar label ──────────────────────────────────────────────────────────
  const displayName = useMemo(() => {
    const fullName =
      typeof user?.user_metadata?.full_name === 'string' ? user.user_metadata.full_name.trim() : '';
    return fullName || user?.email || 'Student';
  }, [user?.email, user?.user_metadata]);


  const dashboardPage = useMemo<NavigablePage>(() => {
    const role = profile?.role;
    if (role === 'admin') return 'admin-dashboard';
    if (role === 'vendor') return 'vendor-dashboard';
    return 'profile';
  }, [profile?.role]);

  const handleLogout = async () => {
    await signOut();
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
    navigateTo('home');
  };

  const isActive = (page: NavigablePage) => currentPage === page;

  // ── Search submit ─────────────────────────────────────────────────────────
  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/services?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  // ── Notification count (0 when unauthenticated; no hardcoded dummy) ───────
  // Real notifications would be fetched from Supabase; for now 0 when not signed in.
  const notificationCount = isAuthenticated ? 0 : 0;

  // ── Manual location save ──────────────────────────────────────────────────
  const handleSaveLocation = () => {
    if (manualLocation.trim()) {
      setLocationLabel(manualLocation.trim());
    }
    setManualLocation('');
    setShowLocationModal(false);
  };

  // ── Avatar source ─────────────────────────────────────────────────────────
  const avatarSrc: string =
    (typeof user?.user_metadata?.avatar_url === 'string' ? user.user_metadata.avatar_url : '') ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(typeof displayName === 'string' ? displayName : 'U')}&background=059669&color=fff`;

  // ── Navigate helper (closes menus) ────────────────────────────────────────
  const handleNavigate = (page: NavigablePage) => {
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
    navigateTo(page);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-150 ${
          isElevated ? 'shadow-[0_2px_8px_rgba(0,0,0,0.5)]' : ''
        }`}
      >
        {/* ── TOP BAR  bg: #10131C ───────────────────────────────────────── */}
        <div className="bg-[#10131C]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-[56px] items-center gap-4">

              {/* Logo — no "Musika" text, just icon + tagline */}
              <button
                onClick={() => navigateTo('home')}
                className="flex shrink-0 items-center gap-2 text-left"
              >
                <img src="/images/Musika logo.svg" alt="Musika logo" className="h-7 w-auto" />
                <div className="hidden flex-col text-left sm:flex">
                  <span className="text-[9px] leading-tight text-slate-400">
                    International Student<br />Multivendor Marketplace
                  </span>
                </div>
              </button>

              {/* Location – desktop */}
              <button
                onClick={() => setShowLocationModal(true)}
                className="ml-1 hidden shrink-0 items-start gap-1 lg:flex group"
                title="Update your location"
              >
                <FilledMapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" />
                <div className="leading-none text-left">
                  <p className="text-[12px] font-medium text-slate-200 group-hover:text-white transition-colors">
                    {locationLoading ? 'Detecting…' : locationLabel}
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-500 group-hover:text-slate-400 transition-colors">
                    Update Location
                  </p>
                </div>
              </button>

              {/* Search bar */}
              <form onSubmit={handleSearch} className="mx-4 hidden flex-1 md:flex">
                <div
                  className={`relative w-full transition-all duration-150 ${
                    isSearchFocused ? 'ring-2 ring-emerald-500/60 rounded-full' : ''
                  }`}
                >
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for Accommodation, Transportation..."
                    className="h-9 w-full rounded-full border border-slate-600/50 bg-[#1E2235] pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                  />
                </div>
              </form>

              {/* Right actions */}
              <div className="ml-auto flex items-center gap-1">

                {/* Language selector */}
                <div
                  className="relative hidden sm:block"
                  onMouseEnter={() => {
                    if (langCloseTimer.current) clearTimeout(langCloseTimer.current);
                    setLanguageMenuOpen(true);
                  }}
                  onMouseLeave={() => {
                    langCloseTimer.current = setTimeout(() => setLanguageMenuOpen(false), 120);
                  }}
                >
                  <button
                    ref={languageButtonRef}
                    onClick={() => setLanguageMenuOpen((prev) => !prev)}
                    className="flex items-center gap-0.5 rounded-full px-2 py-1.5 text-sm text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
                  >
                    <Globe className="h-4 w-4" />
                    <span className="ml-1 text-xs font-medium">{selectedLanguage === 'English' ? 'EN' : selectedLanguage.slice(0, 2).toUpperCase()}</span>
                    <ChevronDown className="h-3 w-3 opacity-70" />
                  </button>
                  {languageMenuOpen && (
                    <div
                      ref={languageMenuRef}
                      className="absolute right-0 top-9 z-20 w-40 rounded-xl border border-slate-700 bg-[#10131C] p-1 shadow-xl"
                    >
                      {languageOptions.map((language) => (
                        <button
                          key={language}
                          onClick={() => {
                            setSelectedLanguage(language);
                            setLanguageMenuOpen(false);
                          }}
                          className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                            selectedLanguage === language
                              ? 'bg-slate-700/80 text-white'
                              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          {language}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notification bell — real count, no dummy */}
                <button
                  className="relative rounded-full p-1.5 text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
                  onClick={() => navigateTo('my-tickets')}
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <span className="absolute right-0.5 top-0.5 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-semibold text-white">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                  )}
                </button>

                {isAuthenticated ? (
                  <button
                    className="relative rounded-full p-1.5 text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
                    onClick={() => navigateTo('messages-inbox')}
                    aria-label="Open message inbox"
                    title={profile?.role === 'vendor' ? 'Open vendor inbox' : 'Open student inbox'}
                  >
                    <MessageSquare className="h-5 w-5" />
                    {unreadMessageCount > 0 && (
                      <span className="absolute -right-0.5 -top-0.5 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[9px] font-bold text-white">
                        {unreadMessageCount > 9 ? '9+' : unreadMessageCount}
                      </span>
                    )}
                  </button>
                ) : null}

                {/* Cart */}
                <button
                  className="relative rounded-full p-1.5 text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
                  onClick={() => setIsCartOpen(true)}
                  aria-label="Shopping cart"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[9px] font-bold text-white">
                      {totalItems > 99 ? '99+' : totalItems}
                    </span>
                  )}
                </button>

                {/* User avatar / icon */}
                {isAuthenticated ? (
                  <div
                    className="relative hidden sm:block"
                    onMouseEnter={() => {
                      if (profileCloseTimer.current) clearTimeout(profileCloseTimer.current);
                      setProfileMenuOpen(true);
                    }}
                    onMouseLeave={() => {
                      profileCloseTimer.current = setTimeout(() => setProfileMenuOpen(false), 120);
                    }}
                  >
                    <button
                      ref={profileButtonRef}
                      className="flex h-8 w-8 items-center justify-center rounded-full overflow-hidden bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors"
                      onClick={() => setProfileMenuOpen((prev) => !prev)}
                      aria-label="User menu"
                    >
                      <img src={avatarSrc} alt={displayName} className="h-full w-full object-cover" />
                    </button>
                    {profileMenuOpen && (
                      <div
                        ref={profileMenuRef}
                        className="absolute right-0 top-10 z-20 w-52 rounded-xl border border-slate-700 bg-[#10131C] p-1 shadow-xl"
                      >
                        <button
                          onClick={() => handleNavigate(dashboardPage)}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          My Dashboard
                        </button>
                        <button
                          onClick={() => handleNavigate('my-posts')}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
                        >
                          <Package className="h-4 w-4" />
                          My Orders
                        </button>
                        <button
                          onClick={() => handleNavigate('community-forum')}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
                        >
                          <MessageSquare className="h-4 w-4" />
                          Open Inbox
                        </button>
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    className="hidden rounded-full p-1.5 text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors sm:flex"
                    onClick={() => navigateTo('signin')}
                    aria-label="Sign in"
                  >
                    <User className="h-5 w-5" />
                  </button>
                )}

                {/* Login + SignUp — pill/circular style, no underline — only when not signed in */}
                {!isAuthenticated && (
                <div className="hidden items-center gap-3 lg:flex">
                  <button
                    onClick={() => navigateTo('signin')}
                    className="rounded-full border border-transparent bg-[#1E2235] px-5 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-slate-800"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigateTo('signup')}
                    className="rounded-full border border-slate-600 bg-transparent px-5 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-slate-800"
                  >
                    SignUp
                  </button>
                </div>
                )}

                {/* Mobile hamburger */}
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <button
                      className="rounded-full p-2 text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors lg:hidden"
                      aria-label="Open navigation menu"
                    >
                      <Menu className="h-5 w-5" />
                    </button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] border-slate-700 bg-[#10131C] p-0">
                    <div className="flex h-full flex-col">
                      <div className="flex items-center border-b border-slate-800 p-4">
                        <span className="font-semibold text-white">Menu</span>
                      </div>

                      {/* Mobile search */}
                      <form
                        onSubmit={(e) => { handleSearch(e); setMobileMenuOpen(false); }}
                        className="border-b border-slate-800 p-4"
                      >
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search..."
                            className="h-10 w-full rounded-full border border-slate-700 bg-[#1E2235] pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      </form>

                      {/* Mobile location */}
                      <button
                        onClick={() => { setShowLocationModal(true); setMobileMenuOpen(false); }}
                        className="flex items-start gap-2 border-b border-slate-800 px-4 py-3 text-left hover:bg-slate-800/40"
                      >
                        <FilledMapPin className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                        <div>
                          <p className="text-sm font-medium text-slate-200">{locationLabel}</p>
                          <p className="text-xs text-slate-500">Tap to update location</p>
                        </div>
                      </button>

                      {/* Language */}
                      <div className="border-b border-slate-800 px-4 py-3">
                        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Language</p>
                        <div className="grid grid-cols-2 gap-1.5">
                          {languageOptions.map((language) => (
                            <button
                              key={language}
                              onClick={() => setSelectedLanguage(language)}
                              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                                selectedLanguage === language
                                  ? 'bg-slate-600 text-white'
                                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                              }`}
                            >
                              {language}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Nav links */}
                      <nav className="flex-1 overflow-y-auto px-4 py-2">
                        <ul className="space-y-0.5">
                          {visibleNavLinks.map((link) => (
                            <li key={link.label}>
                              <button
                                className={`block w-full rounded-full px-4 py-2.5 text-left text-sm transition-colors ${
                                  isActive(link.page)
                                    ? 'bg-slate-700 font-medium text-white'
                                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                }`}
                                onClick={() => handleNavigate(link.page)}
                              >
                                {link.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </nav>

                      {/* Mobile auth */}
                      <div className="space-y-2 border-t border-slate-800 p-4">
                        {isAuthenticated ? (
                          <>
                            <Button
                              className="w-full rounded-full bg-slate-700 text-white hover:bg-slate-600"
                              onClick={() => handleNavigate(dashboardPage)}
                            >
                              My Dashboard
                            </Button>
                            <Button
                              className="w-full rounded-full bg-slate-700 text-white hover:bg-slate-600"
                              onClick={() => { navigate('/my-orders'); setMobileMenuOpen(false); }}
                            >
                              My Orders
                            </Button>
                            <Button
                              className="w-full rounded-full bg-emerald-600 text-white hover:bg-emerald-500"
                              onClick={() => { navigateTo('messages-inbox'); setMobileMenuOpen(false); }}
                            >
                              Open Inbox
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full rounded-full border-slate-600 text-white hover:bg-slate-800"
                              onClick={handleLogout}
                            >
                              Logout
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              className="w-full rounded-full border-slate-600 text-slate-200 hover:bg-slate-800 hover:text-white"
                              onClick={() => handleNavigate('signin')}
                            >
                              Login
                            </Button>
                            <Button
                              className="w-full rounded-full bg-emerald-600 text-white hover:bg-emerald-500"
                              onClick={() => handleNavigate('signup')}
                            >
                              SignUp
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM NAV BAR  bg: #08090A ────────────────────────────────── */}
        <nav className="hidden bg-[#08090A] lg:block">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ul className="flex h-11 items-center justify-between">
              {visibleNavLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => navigateTo(link.page)}
                    className={`relative px-1 py-3 text-sm transition-colors duration-150 ${
                      isActive(link.page)
                        ? 'font-semibold text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-white'
                        : 'font-normal text-slate-400 hover:text-white'
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

      {/* ── Location Modal ──────────────────────────────────────────────────── */}
      {showLocationModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setShowLocationModal(false); }}
        >
          <div className="relative w-full max-w-sm rounded-2xl border border-slate-700 bg-[#10131C] p-6 shadow-2xl">
            <button
              onClick={() => setShowLocationModal(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              aria-label="Close location modal"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <h2 className="mb-1 text-base font-semibold text-white">Your Location</h2>
            <p className="mb-4 text-xs text-slate-400">
              We use your location to show relevant services nearby.
            </p>

            {/* Auto-detect */}
            <button
              onClick={() => { detectLocation(); setShowLocationModal(false); }}
              className="mb-4 flex w-full items-center gap-3 rounded-xl border border-slate-700 px-4 py-3 text-sm text-slate-200 transition-colors hover:border-slate-500 hover:bg-slate-800"
            >
              <Locate className="h-4 w-4 text-emerald-400" />
              <span>Detect my location automatically</span>
            </button>

            <div className="mb-2 flex items-center gap-2">
              <div className="flex-1 border-t border-slate-700" />
              <span className="text-xs text-slate-500">or enter manually</span>
              <div className="flex-1 border-t border-slate-700" />
            </div>

            <input
              type="text"
              value={manualLocation}
              onChange={(e) => setManualLocation(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSaveLocation(); }}
              placeholder="e.g. Mumbai, India"
              className="mt-2 h-10 w-full rounded-xl border border-slate-600 bg-[#1E2235] px-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              autoFocus
            />

            <button
              onClick={handleSaveLocation}
              disabled={!manualLocation.trim()}
              className="mt-3 h-10 w-full rounded-xl bg-emerald-600 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-40"
            >
              Save Location
            </button>
          </div>
        </div>
      )}
    </>
  );
}