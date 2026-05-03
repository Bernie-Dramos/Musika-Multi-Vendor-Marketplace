import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Search,
  MapPin,
  Globe,
  Bell,
  ShoppingCart,
  Menu,
  ChevronDown,
  Mic,
  Camera,
  LogOut,
  MessageSquare,
  Package,
  LayoutDashboard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
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

const languageOptions = ['Arabic', 'English', 'Hindi', 'Portuguese', 'Shona', 'Xhosa', 'Zulu'];

export function Header({ navigateTo, currentPage }: HeaderProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isElevated, setIsElevated] = useState(false);
  const langCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const profileCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { totalItems, setIsCartOpen } = useCart();
  const { user, isAuthenticated, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setIsElevated(window.scrollY > 4);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const avatarLabel = useMemo(() => {
    const name =
      (typeof user?.user_metadata?.full_name === 'string' && user.user_metadata.full_name.trim()) ||
      user?.email ||
      'Student';
    return name.charAt(0).toUpperCase();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    setProfileMenuOpen(false);
    navigateTo('home');
  };

  const isActive = (page: NavigablePage) => currentPage === page;

  return (
    <header className={`sticky top-0 z-50 w-full bg-[#0F172A] transition-all duration-150 ${isElevated ? 'shadow-[0_1px_4px_rgba(0,0,0,0.08)]' : ''}`}>
      <div className="border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between gap-2 lg:h-16">
            {/* Logo */}
            <button 
              onClick={() => navigateTo('home')}
              className="flex flex-shrink-0 items-center gap-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <div className="hidden text-left sm:block">
                <span className="text-lg font-bold text-white">Musika</span>
                <span className="-mt-1 block text-xs text-slate-400">International Student</span>
              </div>
            </button>

            {/* Location Selector - Desktop */}
            <div className="ml-4 hidden items-center gap-2 text-sm text-slate-300 lg:flex">
              <MapPin className="h-4 w-4 text-emerald-400" />
              <span>Pune, India</span>
              <button className="text-xs text-emerald-400 hover:text-emerald-300">
                Update Location
              </button>
            </div>

            {/* Search Bar - Desktop */}
            <div className="mx-3 hidden max-w-xl flex-1 md:flex lg:mx-8">
              <div
                className={`relative w-full transition-all duration-150 ${
                  isSearchFocused ? 'rounded-lg ring-2 ring-emerald-500' : ''
                }`}
              >
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search for Accommodation, Transportation..."
                  className="h-10 w-full rounded-lg border border-slate-700 bg-slate-800/50 pl-10 pr-20 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1 text-slate-300">
                  <button className="rounded-full p-1.5 hover:bg-slate-700 hover:text-white" aria-label="Voice search">
                    <Mic className="h-4 w-4" />
                  </button>
                  <button className="rounded-full p-1.5 hover:bg-slate-700 hover:text-white" aria-label="Image search">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 lg:gap-3">
              {/* Language Selector */}
              <div
                className="relative hidden sm:block"
                onMouseEnter={() => { if (langCloseTimer.current) clearTimeout(langCloseTimer.current); }}
                onMouseLeave={() => { langCloseTimer.current = setTimeout(() => setLanguageMenuOpen(false), 80); }}
              >
                <button
                  onClick={() => setLanguageMenuOpen((prev) => !prev)}
                  className="flex items-center gap-1 text-sm text-slate-300 hover:text-white"
                >
                  <Globe className="h-4 w-4" />
                  <span>{selectedLanguage}</span>
                  <ChevronDown className="h-3 w-3" />
                </button>
                {languageMenuOpen ? (
                  <div className="absolute right-0 top-8 z-10 w-40 rounded-xl border border-slate-700 bg-[#0F172A] p-1 shadow-lg">
                    {languageOptions.map((language) => (
                      <button
                        key={language}
                        onClick={() => {
                          setSelectedLanguage(language);
                          setLanguageMenuOpen(false);
                        }}
                        className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                          selectedLanguage === language
                            ? 'bg-slate-800 text-white'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        {language}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              {isAuthenticated ? (
                <>
                  <button
                    className="relative rounded-full p-2 text-slate-300 hover:bg-slate-800 hover:text-white"
                    onClick={() => navigateTo('my-tickets')}
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-1 top-1 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-[#111111] px-1 text-[10px] text-white">
                      3
                    </span>
                  </button>

                  <button
                    className="relative rounded-full p-2 text-slate-300 hover:bg-slate-800 hover:text-white"
                    onClick={() => setIsCartOpen(true)}
                    aria-label="Shopping cart"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#111111] px-1.5 text-[10px] font-semibold text-white">
                      {totalItems > 99 ? '99+' : totalItems}
                    </span>
                  </button>

                  <div
                    className="relative hidden sm:block"
                    onMouseEnter={() => { if (profileCloseTimer.current) clearTimeout(profileCloseTimer.current); }}
                    onMouseLeave={() => { profileCloseTimer.current = setTimeout(() => setProfileMenuOpen(false), 80); }}
                  >
                    <button
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111111] text-sm font-semibold text-white"
                      onClick={() => setProfileMenuOpen((prev) => !prev)}
                      aria-label="User menu"
                    >
                      {avatarLabel}
                    </button>
                    {profileMenuOpen ? (
                      <div className="absolute right-0 top-11 w-52 rounded-xl border border-slate-700 bg-[#0F172A] p-1 shadow-lg">
                        <button onClick={() => { navigateTo('vendor-dashboard'); setProfileMenuOpen(false); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-slate-800">
                          <LayoutDashboard className="h-4 w-4" />
                          My Dashboard
                        </button>
                        <button onClick={() => { navigateTo('my-posts'); setProfileMenuOpen(false); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-slate-800">
                          <Package className="h-4 w-4" />
                          My Orders
                        </button>
                        <button onClick={() => { navigateTo('community-forum'); setProfileMenuOpen(false); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-slate-800">
                          <MessageSquare className="h-4 w-4" />
                          Messages
                        </button>
                        <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#ef4444] hover:bg-[#fef2f2]">
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    ) : null}
                  </div>
                </>
              ) : (
                <div className="hidden items-center gap-2 lg:flex">
                  <Button
                    variant="ghost"
                    className="rounded-full text-white hover:bg-slate-800 hover:text-white"
                    onClick={() => navigateTo('signin')}
                  >
                    Login
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full border-emerald-500 text-emerald-400 hover:bg-emerald-500/10"
                    onClick={() => navigateTo('signup')}
                  >
                    SignUp
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <button className="p-2 text-slate-300 hover:text-white lg:hidden" aria-label="Open navigation menu">
                    <Menu className="h-6 w-6" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] border-slate-800 bg-[#0F172A] p-0">
                  <div className="flex flex-col h-full">
                    {/* Mobile Header */}
                    <div className="flex items-center justify-between border-b border-slate-800 p-4">
                      <span className="font-bold text-white">Menu</span>
                    </div>

                    <div className="border-b border-slate-800 px-4 py-3">
                      <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">Language</p>
                      <div className="grid grid-cols-2 gap-2">
                        {languageOptions.map((language) => (
                          <button
                            key={language}
                            onClick={() => setSelectedLanguage(language)}
                            className={`rounded-md px-2 py-1.5 text-xs ${
                              selectedLanguage === language
                                ? 'bg-slate-700 text-white'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {language}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Mobile Search */}
                    <div className="p-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search..."
                          className="h-10 w-full rounded-lg border border-slate-700 bg-slate-800 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    {/* Mobile Nav Links */}
                    <nav className="flex-1 px-4">
                      <ul className="space-y-1">
                        {navLinks.map((link) => (
                          <li key={link.label}>
                            <button
                              className="block w-full rounded-lg px-4 py-3 text-left text-slate-300 transition-all duration-150 hover:bg-slate-800 hover:text-white"
                              onClick={() => {
                                navigateTo(link.page);
                                setMobileMenuOpen(false);
                              }}
                            >
                              {link.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </nav>

                    {/* Mobile Auth */}
                    <div className="space-y-2 border-t border-slate-800 p-4">
                      {isAuthenticated ? (
                        <>
                          <Button className="w-full bg-[#111111] text-white hover:bg-black" onClick={() => { navigateTo('vendor-dashboard'); setMobileMenuOpen(false); }}>
                            My Dashboard
                          </Button>
                          <Button variant="outline" className="w-full border-slate-600 text-white hover:bg-slate-800" onClick={handleLogout}>
                            Logout
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            className="w-full border-slate-600 text-white hover:bg-slate-800"
                            onClick={() => {
                              navigateTo('signin');
                              setMobileMenuOpen(false);
                            }}
                          >
                            Login
                          </Button>
                          <Button
                            className="w-full bg-[#111111] text-white hover:bg-black"
                            onClick={() => {
                              navigateTo('signup');
                              setMobileMenuOpen(false);
                            }}
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

      {/* Navigation Bar - Desktop */}
      <nav className="hidden border-t border-slate-800 bg-[#0F172A] lg:block">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-12 items-center justify-between">
            <ul className="flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => navigateTo(link.page)}
                    className={`border-b-2 pb-[13px] text-sm transition-all duration-150 ${
                      isActive(link.page)
                        ? 'border-white font-medium text-white'
                        : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
