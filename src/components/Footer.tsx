import { Shield, Building2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { footerLinks } from '@/lib/data';
import type { NavigablePage } from '@/lib/navigation';

interface FooterProps {
  navigateTo: (page: NavigablePage) => void;
}

export function Footer({ navigateTo }: FooterProps) {
  return (
    <footer className="bg-[#0F172A] text-white">
      {/* Newsletter Section */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Stay Updated</h3>
              <p className="text-sm text-slate-400">
                Get the latest products, services, tips and resources delivered to your inbox
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="w-full md:w-80 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:ring-emerald-500"
              />
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <button 
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2 mb-4"
            >
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <div className="text-left">
                <span className="font-bold text-lg">Musika</span>
                <span className="text-xs text-slate-400 block -mt-1">International Student</span>
              </div>
            </button>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-slate-400">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>100% Verified Services</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-400">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>25+ University Partnerships</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-400">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>50 000+ Users</span>
              </li>
            </ul>
          </div>

          {/* For Students */}
          <div>
            <h4 className="font-semibold mb-4">For Students</h4>
            <ul className="space-y-2">
              {footerLinks.forStudents.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => link.href.startsWith('/') ? navigateTo(link.href.slice(1) as NavigablePage) : null}
                    className="text-sm text-slate-400 hover:text-white transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* For Vendors */}
          <div>
            <h4 className="font-semibold mb-4">For Vendors</h4>
            <ul className="space-y-2">
              {footerLinks.forVendors.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => link.href.startsWith('/') ? navigateTo(link.href.slice(1) as NavigablePage) : null}
                    className="text-sm text-slate-400 hover:text-white transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => link.href.startsWith('/') ? navigateTo(link.href.slice(1) as NavigablePage) : null}
                    className="text-sm text-slate-400 hover:text-white transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-400">
              © 2025 Musika. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <button className="hover:text-white transition-colors">
                Privacy Policy
              </button>
              <button className="hover:text-white transition-colors">
                Terms of Service
              </button>
              <button className="hover:text-white transition-colors">
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
