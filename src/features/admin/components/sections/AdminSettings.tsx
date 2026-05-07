import { useState } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { supabase } from '@/lib/supabase';

export function AdminSettings() {
  const { profile, user } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !user) return;
    setSaving(true);
    setMsg(null);
    setError(null);

    const { error: err } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', user.id);

    setSaving(false);
    if (err) {
      setError(err.message);
    } else {
      setMsg('Profile updated successfully.');
      setTimeout(() => setMsg(null), 3000);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#111111] sm:text-4xl">Settings</h1>
        <p className="text-[#6b7280]">Manage your admin profile and platform preferences.</p>
      </div>

      {/* Admin profile */}
      <div className="rounded-xl border border-[#e5e7eb] bg-white p-6">
        <h2 className="mb-4 font-semibold text-[#111111]">Admin Profile</h2>

        {msg && <div className="mb-3 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">{msg}</div>}
        {error && <div className="mb-3 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</div>}

        <form onSubmit={handleSave} className="max-w-md space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-[#374151]">Full Name</label>
            <input
              title="Full Name"
              placeholder="Your full name"
              className="w-full rounded-lg border border-[#d1d5db] px-3 py-2 text-sm outline-none focus:border-[#111111]"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#374151]">Email</label>
            <input
              title="Email address"
              placeholder="Email"
              className="w-full rounded-lg border border-[#d1d5db] bg-[#f9fafb] px-3 py-2 text-sm text-[#9ca3af] outline-none cursor-not-allowed"
              value={profile?.email ?? ''}
              readOnly
            />
            <p className="mt-1 text-xs text-[#9ca3af]">Email cannot be changed here.</p>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#374151]">Role</label>
            <input
              title="User role"
              placeholder="Role"
              className="w-full rounded-lg border border-[#d1d5db] bg-[#f9fafb] px-3 py-2 text-sm text-[#9ca3af] outline-none cursor-not-allowed capitalize"
              value={profile?.role ?? 'admin'}
              readOnly
            />
          </div>
          <button
            type="submit"
            title="Save profile changes"
            disabled={saving}
            className="rounded-full bg-[#111111] px-6 py-2 text-sm text-white hover:bg-black disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Platform settings (display-only toggles for now) */}
      <div className="rounded-xl border border-[#e5e7eb] bg-white p-6">
        <h2 className="mb-4 font-semibold text-[#111111]">Platform Preferences</h2>
        <ul className="space-y-4">
          {[
            { label: 'Email notifications for new vendor applications', enabled: true },
            { label: 'Email notifications for support tickets', enabled: true },
            { label: 'Auto-archive rejected applications after 30 days', enabled: false },
            { label: 'Require admin approval for all new resources', enabled: true },
          ].map((setting) => (
            <li key={setting.label} className="flex items-center justify-between gap-4">
              <span className="text-sm text-[#374151]">{setting.label}</span>
              <button
                title={`Toggle: ${setting.label}`}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  setting.enabled ? 'bg-[#111111]' : 'bg-[#d1d5db]'
                }`}
                type="button"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    setting.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-[#9ca3af]">
          Platform preferences are saved per admin session. Full persistence requires a settings table.
        </p>
      </div>
    </div>
  );
}
