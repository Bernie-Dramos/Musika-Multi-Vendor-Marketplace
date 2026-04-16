import { useState } from 'react';
import {
  Search,
  MapPin,
  Globe,
  Bell,
  ShoppingCart,
  User,
  Menu,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/hooks/useCart';
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

export function Header({ navigateTo, currentPage }: HeaderProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();

  const isActive = (page: NavigablePage) => currentPage === page;

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Bar */}
      <div className="bg-[#0F172A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 lg:h-16">
            {/* Logo */}
            <button 
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2 flex-shrink-0"
            >
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <div className="hidden sm:block text-left">
                <span className="font-bold text-lg">Musika</span>
                <span className="text-xs text-slate-400 block -mt-1">International Student</span>
              </div>
            </button>

            {/* Location Selector - Desktop */}
            <div className="hidden lg:flex items-center gap-2 text-sm text-slate-300 ml-4">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Pune, India</span>
              <button className="text-emerald-400 hover:text-emerald-300 text-xs">
                Update Location
              </button>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-xl mx-4 lg:mx-8">
              <div
                className={`relative w-full transition-all duration-300 ${
                  isSearchFocused ? 'ring-2 ring-emerald-500 rounded-lg' : ''
                }`}
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search for Accommodation, Transportation..."
                  className="w-full h-10 pl-10 pr-4 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 lg:gap-4">
              {/* Language Selector */}
              <button className="hidden sm:flex items-center gap-1 text-sm text-slate-300 hover:text-white">
                <Globe className="w-4 h-4" />
                <span>EN</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {/* Icons */}
              <button className="relative p-2 text-slate-300 hover:text-white">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full" />
              </button>
              
              {/* Cart Icon with Badge */}
              <button 
                className="relative p-2 text-slate-300 hover:text-white"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold px-1.5">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </button>
              
              <button
                className="hidden sm:block p-2 text-slate-300 hover:text-white"
                onClick={() => navigateTo('profile')}
              >
                <User className="w-5 h-5" />
              </button>

              {/* Auth Buttons - Desktop */}
              <div className="hidden lg:flex items-center gap-2 ml-2">
                <Button 
                  variant="ghost" 
                  className="text-white hover:text-white hover:bg-slate-800"
                  onClick={() => navigateTo('signin')}
                >
                  Login
                </Button>
                <Button 
                  variant="outline" 
                  className="border-emerald-500 text-emerald-400 hover:bg-emerald-500/10"
                  onClick={() => navigateTo('signup')}
                >
                  Sign Up
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <button className="lg:hidden p-2 text-slate-300 hover:text-white">
                    <Menu className="w-6 h-6" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] bg-[#0F172A] border-slate-800 p-0">
                  <div className="flex flex-col h-full">
                    {/* Mobile Header */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-800">
                      <span className="text-white font-bold">Menu</span>
                    </div>

                    {/* Mobile Search */}
                    <div className="p-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search..."
                          className="w-full h-10 pl-10 pr-4 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    {/* Mobile Nav Links */}
                    <nav className="flex-1 px-4">
                      <ul className="space-y-1">
                        {navLinks.map((link) => (
                          <li key={link.label}>
                            <button
                              className="block w-full text-left py-3 px-4 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
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
                    <div className="p-4 border-t border-slate-800 space-y-2">
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
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                        onClick={() => {
                          navigateTo('signup');
                          setMobileMenuOpen(false);
                        }}
                      >
                        Sign Up
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar - Desktop */}
      <nav className="hidden lg:block bg-[#0F172A] border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <ul className="flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => navigateTo(link.page)}
                    className={`text-sm transition-colors ${
                      isActive(link.page)
                        ? 'text-white font-medium'
                        : 'text-slate-400 hover:text-white'
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
