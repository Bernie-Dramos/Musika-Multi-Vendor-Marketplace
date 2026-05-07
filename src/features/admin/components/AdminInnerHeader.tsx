import { Search, Globe, Bell } from 'lucide-react';
import type { AdminSection } from './AdminSidebar';
import type { ProfileRow } from '@/lib/database.types';

interface AdminInnerHeaderProps {
  section: AdminSection;
  searchValue: string;
  onSearch: (v: string) => void;
  profile: ProfileRow | null;
}

const sectionLabels: Record<AdminSection, string> = {
  Dashboard: 'Dashboard',
  Vendors: 'Vendor Listings',
  Orders: 'Orders & Activity',
  Analytics: 'Analytics',
  Compliance: 'Compliance',
  Settings: 'Settings',
};

export function AdminInnerHeader({ section, searchValue, onSearch, profile }: AdminInnerHeaderProps) {
  const displayName = profile?.full_name ?? profile?.email?.split('@')[0] ?? 'Admin';

  return (
    <header className="border-b border-[#e5e7eb] bg-white px-4 py-4 sm:px-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between gap-4 md:min-w-[180px]">
          <h2 className="text-sm font-semibold text-[#111111]">{sectionLabels[section]}</h2>
          <div className="flex items-center gap-4 text-[#374151] md:hidden">
            <Globe className="h-4 w-4 cursor-pointer hover:text-[#111111]" />
            <Bell className="h-4 w-4 cursor-pointer hover:text-[#111111]" />
            <div
              title={displayName}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a1f2e] text-xs font-semibold uppercase text-white"
            >
              {displayName.slice(0, 1)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 md:flex-1 md:justify-end">
          <div className="flex w-full items-center gap-2 rounded-full bg-[#f3f4f6] px-3 py-2 md:max-w-md">
            <Search className="h-4 w-4 text-[#9ca3af]" />
            <input
              className="w-full bg-transparent text-sm outline-none"
              placeholder="Search listings..."
              value={searchValue}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
          <div className="hidden items-center gap-4 text-[#374151] md:flex">
            <Globe className="h-4 w-4 cursor-pointer hover:text-[#111111]" />
            <Bell className="h-4 w-4 cursor-pointer hover:text-[#111111]" />
            <div
              title={displayName}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a1f2e] text-xs font-semibold uppercase text-white"
            >
              {displayName.slice(0, 1)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
