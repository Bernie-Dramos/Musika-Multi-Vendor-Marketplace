import {
  LayoutDashboard,
  Store,
  ShoppingBag,
  BarChart2,
  ShieldCheck,
  Settings,
  HeadphonesIcon,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ProfileRow } from '@/lib/database.types';

export type AdminSection = 'Dashboard' | 'Vendors' | 'Orders' | 'Analytics' | 'Compliance' | 'Settings';

interface AdminSidebarProps {
  activeSection: AdminSection;
  setActiveSection: (s: AdminSection) => void;
  profile: ProfileRow | null;
  onLogout: () => void;
}

const navItems: { label: AdminSection; icon: React.ReactNode }[] = [
  { label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: 'Vendors', icon: <Store className="h-4 w-4" /> },
  { label: 'Orders', icon: <ShoppingBag className="h-4 w-4" /> },
  { label: 'Analytics', icon: <BarChart2 className="h-4 w-4" /> },
  { label: 'Compliance', icon: <ShieldCheck className="h-4 w-4" /> },
  { label: 'Settings', icon: <Settings className="h-4 w-4" /> },
];

export function AdminSidebar({ activeSection, setActiveSection, profile, onLogout }: AdminSidebarProps) {
  const displayName = profile?.full_name ?? profile?.email?.split('@')[0] ?? 'Admin';

  return (
    <aside className="hidden min-h-full w-[260px] shrink-0 flex-col bg-[#0f1523] px-5 py-6 text-white lg:flex">
      <div>
        <h1 className="text-[30px] font-bold">Musika</h1>
        <p className="mt-1 text-[10px] uppercase tracking-[1px] text-[#6b7280]">
          International Student Multivendor Marketplace
        </p>
      </div>

      <nav className="mt-10 flex-1 space-y-1 text-sm">
        {navItems.map(({ label, icon }) => (
          <button
            key={label}
            onClick={() => setActiveSection(label)}
            className={`flex w-full items-center gap-3 rounded-r-xl px-4 py-3 text-left transition-all duration-150 ${
              activeSection === label
                ? 'border-l-[3px] border-white bg-[#1a1f2e] text-white'
                : 'text-[#9ca3af] hover:bg-[#1a1f2e] hover:text-[#e5e7eb]'
            }`}
          >
            {icon}
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-3 rounded-xl bg-[#1a1f2e] p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#374151] text-sm font-semibold uppercase">
            {displayName.slice(0, 1)}
          </div>
          <div>
            <p className="text-sm font-medium">{displayName}</p>
            <p className="text-xs text-[#9ca3af] capitalize">{profile?.role ?? 'Admin'}</p>
          </div>
        </div>
        <Button
          onClick={() => setActiveSection('Settings')}
          className="w-full justify-start gap-2 bg-[#1a1f2e] text-white hover:bg-[#222a3b]"
        >
          <HeadphonesIcon className="h-4 w-4" />
          Support Portal
        </Button>
        <Button
          variant="ghost"
          onClick={onLogout}
          className="w-full justify-start gap-2 text-[#d1d5db] hover:bg-[#1a1f2e]"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
