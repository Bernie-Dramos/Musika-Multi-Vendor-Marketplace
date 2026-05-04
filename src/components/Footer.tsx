import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BrandLogo } from '@/components/BrandLogo';
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
  const linkGroups = [
    { title: 'For Students', links: footerLinks.forStudents },
    { title: 'For Vendors', links: footerLinks.forVendors },
    { title: 'Support', links: footerLinks.support },
  ];

  return (
    <footer className="bg-[#121722] text-white">
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-[1180px] px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
            <div className="max-w-sm">
              <h3 className="text-[18px] font-semibold tracking-[-0.02em] text-[#d8e1ee]">Stay Updated</h3>
              <p className="mt-2 text-sm leading-6 text-[#e5e7eb]">
                Get the latest products, services , tips and resources delivered to your inbox
              </p>
            </div>

            <div className="flex w-full max-w-[560px] flex-col gap-3 sm:flex-row sm:items-center">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="h-[42px] rounded-full border border-[#6a707b] bg-[#2f323a] px-5 text-white placeholder:text-[#d0d3da] focus-visible:ring-0"
              />
              <Button className="h-[42px] rounded-full bg-[#2d3139] px-6 text-white hover:bg-[#3a404a]">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1180px] px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr_1fr_1fr]">
          <div className="max-w-[260px]">
            <button type="button" onClick={() => navigateTo('home')} className="block text-left" aria-label="Go to home page">
              <BrandLogo variant="footer" />
            </button>
          </div>

          {linkGroups.map((group) => (
            <div key={group.title}>
              <h4 className="text-[17px] font-medium text-[#d8e1ee]">{group.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => {
                  const page = resolvePage(link.href);

                  return (
                    <li key={link.label}>
                      <button
                        type="button"
                        onClick={() => {
                          if (page) {
                            navigateTo(page);
                          }
                        }}
                        className="text-left text-sm text-[#f3f4f6] transition-colors hover:text-white"
                      >
                        {link.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-[#646c78] pt-6">
          <div className="flex flex-col gap-4 text-sm text-[#c7ccd4] sm:flex-row sm:items-center sm:justify-between">
            <p>© 2025 Musika. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-6">
              <button type="button" className="transition-colors hover:text-white">
                Privacy Policy
              </button>
              <button type="button" className="transition-colors hover:text-white">
                Terms of Service
              </button>
              <button type="button" className="transition-colors hover:text-white">
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}