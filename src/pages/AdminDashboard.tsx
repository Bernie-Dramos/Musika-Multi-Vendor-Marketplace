import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import { AdminSidebar, type AdminSection } from '@/features/admin/components/AdminSidebar';
import { AdminInnerHeader } from '@/features/admin/components/AdminInnerHeader';
import { AdminOverview } from '@/features/admin/components/sections/AdminOverview';
import { AdminVendors } from '@/features/admin/components/sections/AdminVendors';
import { AdminOrders } from '@/features/admin/components/sections/AdminOrders';
import { AdminAnalytics } from '@/features/admin/components/sections/AdminAnalytics';
import { AdminCompliance } from '@/features/admin/components/sections/AdminCompliance';
import { AdminSettings } from '@/features/admin/components/sections/AdminSettings';

const adminSections: AdminSection[] = ['Dashboard', 'Vendors', 'Orders', 'Analytics', 'Compliance', 'Settings'];

export function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<AdminSection>('Vendors');
  const [searchQuery, setSearchQuery] = useState('');
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'Dashboard': return <AdminOverview />;
      case 'Vendors': return <AdminVendors searchQuery={searchQuery} />;
      case 'Orders': return <AdminOrders />;
      case 'Analytics': return <AdminAnalytics />;
      case 'Compliance': return <AdminCompliance />;
      case 'Settings': return <AdminSettings />;
      default: return <AdminOverview />;
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f9fafb] lg:flex-row">
      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        profile={profile}
        onLogout={handleLogout}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminInnerHeader
          section={activeSection}
          searchValue={searchQuery}
          onSearch={setSearchQuery}
          profile={profile}
        />
        <div className="border-b border-[#e5e7eb] bg-white px-4 py-3 lg:hidden">
          <nav className="flex gap-2 overflow-x-auto pb-1">
            {adminSections.map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeSection === section
                    ? 'bg-[#0F172A] text-white'
                    : 'border border-[#d1d5db] bg-white text-[#374151] hover:bg-[#f9fafb]'
                }`}
              >
                {section}
              </button>
            ))}
          </nav>
        </div>
        <main className="flex-1 p-4 sm:p-8">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              onClick={() => navigate('/admin-messages')}
              className="w-full rounded-full bg-[#0F172A] px-4 py-2 text-sm font-medium text-white hover:bg-[#1E293B] sm:w-auto"
            >
              Messaging Oversight
            </button>
          </div>
          {renderSection()}
        </main>
      </div>
    </div>
  );
}


