import { useState } from 'react';
import { footerLinks } from '@/lib/data';
import type { NavigablePage } from '@/lib/navigation';

interface FooterProps {
  navigateTo: (page: NavigablePage) => void;
}

function resolvePage(href: string): NavigablePage | null {
  if (!href.startsWith('/')) {
    return null;
  }

  const route = href.slice(1);
  if (
    route === 'services' ||
    route === 'international-resources' ||
    route === 'community-forum' ||
    route === 'become-vendor' ||
    route === 'help-support' ||
    route === 'signup' ||
    route === 'signin' ||
    route === 'profile' ||
    route === 'vendor-dashboard' ||
    route === 'saved-resources' ||
    route === 'my-tickets' ||
    route === 'my-posts' ||
    route === 'marketplace' ||
    route === 'categories' ||
    route === ''
  ) {
    return (route === '' ? 'home' : route) as NavigablePage;
  }

  return null;
}

export function Footer({ navigateTo }: FooterProps) {
  const [email, setEmail] = useState('');

  const handleSubscribe = async () => {
    if (!email.trim()) {
      // eslint-disable-next-line no-alert
      alert('Please enter an email address');
      return;
    }
    try {
      // eslint-disable-next-line no-console
      console.log('subscribe', email);
      // eslint-disable-next-line no-alert
      alert('Thanks — subscription received (placeholder)');
      setEmail('');
    } catch {
      // eslint-disable-next-line no-alert
      alert('Subscription failed. Please try again.');
    }
  };

  const handleLinkClick = (href: string) => {
    if (href.startsWith('#') && href.length > 1) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigateTo('home');
        setTimeout(() => {
          document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else if (href.startsWith('/')) {
      navigateTo(href.slice(1) as NavigablePage);
    } else {
      navigateTo('home');
    }
  };

  return (
    <footer className="bg-[#10131C] text-slate-300">
      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        
        {/* ── Newsletter strip ── */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between mb-16">
          <div>
            <h3 className="text-[18px] font-semibold text-white">Stay Updated</h3>
            <p className="mt-1.5 text-[13px] text-[#888888] leading-relaxed">
              Get the latest products, services , tips and resources
              <br className="hidden sm:block" /> delivered to your inbox
            </p>
          </div>
          <div className="flex w-full items-center gap-3 md:w-auto mt-2 md:mt-0">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
              placeholder="Enter your email address"
              className="h-[38px] w-full rounded-full border border-[#2E3343] bg-[#1E212B]/60 px-5 text-[13px] text-white placeholder:text-[#666] focus:outline-none focus:border-slate-500 md:w-[340px]"
            />
            <button
              onClick={handleSubscribe}
              className="h-[38px] shrink-0 rounded-full bg-[#2A2E3D] px-5 text-[13px] font-medium text-slate-300 hover:bg-[#3B4054] transition-colors"
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* ── Main columns ── */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 pb-16 border-b border-[#222]">
          
          {/* Column 1 – Brand */}
          <div>
            <button
              onClick={() => navigateTo('home')}
              className="mb-4 flex items-center gap-2 text-left"
            >
              <img src="/images/Musika logo.svg" alt="Musika logo" className="h-7 w-auto" />
            </button>
            <p className="mt-3 text-[13px] leading-snug text-[#888888]">
              International Student<br />Multivendor Marketplace
            </p>
          </div>

          {/* Column 2 – For Students */}
          <div>
            <h4 className="mb-4 text-[15px] font-medium text-white">For Students</h4>
            <ul className="space-y-3">
              {footerLinks.forStudents.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleLinkClick(link.href)}
                    className="text-[13px] text-[#888888] transition-colors hover:text-white"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 – For Vendors */}
          <div>
            <h4 className="mb-4 text-[15px] font-medium text-white">For Vendors</h4>
            <ul className="space-y-3">
              {footerLinks.forVendors.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleLinkClick(link.href)}
                    className="text-[13px] text-[#888888] transition-colors hover:text-white"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 – Support */}
          <div>
            <h4 className="mb-4 text-[15px] font-medium text-white">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleLinkClick(link.href)}
                    className="text-[13px] text-[#888888] transition-colors hover:text-white"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="py-6">
          <div className="flex flex-wrap items-center gap-x-12 gap-y-4">
            <p className="text-[12px] text-[#888888]">© 2025 Musika. All rights reserved.</p>
            <div className="flex items-center gap-8">
              <button className="text-[12px] text-[#888888] transition-colors hover:text-white">
                Privacy Policy
              </button>
              <button className="text-[12px] text-[#888888] transition-colors hover:text-white">
                Terms of Service
              </button>
              <button className="text-[12px] text-[#888888] transition-colors hover:text-white">
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}