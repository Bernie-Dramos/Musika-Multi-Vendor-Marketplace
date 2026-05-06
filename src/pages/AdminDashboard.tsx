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
    <div className="flex min-h-screen bg-[#f9fafb]">
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
        <main className="flex-1 p-4 sm:p-8">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}


