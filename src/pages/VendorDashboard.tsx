import { useState } from 'react';
import { Bell, Camera, ChevronDown, LayoutDashboard, MessageSquare, Settings, ShoppingCart, ArrowRight, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = ['Dashboard', 'My Listings', 'Orders', 'Messages', 'Analytics', 'Earnings', 'Settings'];

const initialTags = ['Shona', 'Vegan', 'Cultural'];

export function VendorDashboard() {
  const [active, setActive] = useState(true);
  const [tags, setTags] = useState(initialTags);

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <div className="flex">
        <aside className="hidden min-h-screen w-[260px] shrink-0 bg-[#0f1523] px-5 py-6 text-white lg:block">
          <h1 className="text-[30px] font-bold">Musika</h1>
          <p className="mt-1 text-[10px] uppercase tracking-[1px] text-[#6b7280]">International Student Multivendor Marketplace</p>

          <nav className="mt-10 space-y-2 text-sm">
            {navItems.map((item) => (
              <button
                key={item}
                className={`flex w-full items-center rounded-xl px-4 py-3 text-left transition-all duration-150 ${
                  item === 'Dashboard' ? 'bg-[#1a1f2e] text-white' : 'text-[#9ca3af] hover:bg-[#1a1f2e] hover:text-[#e5e7eb]'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="mt-auto rounded-xl bg-[#1a1f2e] p-3">
            <p className="text-sm font-medium text-white">Global Student</p>
            <p className="text-xs text-[#22c55e]">● Verified</p>
          </div>
        </aside>

        <div className="flex-1">
          <header className="border-b border-[#e5e7eb] bg-white px-4 py-4 sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6 text-sm">
                <button className="font-semibold text-[#111111]">Musika</button>
                <button className="border-b-2 border-[#111111] pb-1 font-semibold text-[#111111]">Marketplace</button>
                <button className="text-[#6b7280]">Help Center</button>
              </div>

              <div className="flex items-center gap-3 text-[#374151]">
                <Bell className="h-4 w-4" />
                <Settings className="h-4 w-4" />
                <Button className="rounded-full bg-[#111111] text-white hover:bg-black">Quick Actions</Button>
              </div>
            </div>
          </header>

          <main className="px-4 py-6 sm:px-8">
            <nav className="mb-4 text-sm text-[#6b7280]">Marketplace &gt; My Listings &gt; New Listing</nav>

            <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
              <section className="rounded-2xl border border-[#e5e7eb] bg-white p-7">
                <h1 className="text-3xl font-bold text-[#111111]">Listing Details</h1>
                <p className="mt-1 text-[#6b7280]">Define your product and its global appeal.</p>

                <div className="mt-6 space-y-5">
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[#374151]">Listing Title</label>
                    <input
                      className="mt-2 h-12 w-full rounded-lg border border-[#e5e7eb] px-4 text-[#111111] focus:border-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10"
                      placeholder="e.g. Handcrafted Moroccan Ceramic Vase"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[#374151]">Description</label>
                    <textarea
                      className="mt-2 min-h-[160px] w-full rounded-lg border border-[#e5e7eb] px-4 py-3 text-[#111111] focus:border-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10"
                      placeholder="Describe the origin, craftsmanship, and unique value..."
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[#374151]">Category</label>
                      <button className="mt-2 flex h-12 w-full items-center justify-between rounded-lg border border-[#e5e7eb] px-4 text-left text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#111111]/10">
                        Select a category
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[#374151]">Price (INR)</label>
                      <div className="mt-2 flex h-12 items-center rounded-lg border border-[#e5e7eb] px-4 focus-within:ring-2 focus-within:ring-[#111111]/10">
                        <span className="mr-2 text-[#374151]">₹</span>
                        <input className="w-full text-[#111111] outline-none" placeholder="0.00" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6">
                  <h2 className="text-2xl font-bold text-[#111111]">Media Gallery</h2>
                  <p className="text-sm text-[#6b7280]">High-resolution editorial photography (Max 10MB)</p>

                  <div className="mt-4 space-y-4">
                    <button className="flex h-56 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#d1d5db] text-[#9ca3af] transition-all duration-150 hover:border-[#111111] hover:bg-[#f9fafb]">
                      <Camera className="mb-2 h-7 w-7" />
                      Upload Main Image
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                      <button className="flex h-24 items-center justify-center rounded-xl border-2 border-dashed border-[#d1d5db] text-[#6b7280]" aria-label="Upload additional image 1">
                        <Plus className="h-5 w-5" />
                      </button>
                      <button className="flex h-24 items-center justify-center rounded-xl border-2 border-dashed border-[#d1d5db] text-[#6b7280]" aria-label="Upload additional image 2">
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>

                <Button className="h-13 w-full rounded-xl bg-[#111111] py-6 text-base text-white hover:bg-black">
                  Post New Listing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="secondary" className="h-13 w-full rounded-xl bg-[#f3f4f6] py-6 text-base text-[#111111] hover:bg-[#e5e7eb]">
                  Save as Draft
                </Button>
                <p className="text-center text-[11px] uppercase tracking-[0.5px] text-[#9ca3af]">By posting, you agree to the vendor terms</p>
              </section>
            </div>

            <section className="mt-6 rounded-2xl border border-[#e5e7eb] bg-white p-7">
              <h2 className="text-2xl font-bold text-[#111111]">Attributes & Cultural Tags</h2>

              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button key={tag} className="inline-flex items-center gap-1 rounded-full bg-[#111111] px-3 py-1.5 text-sm text-white">
                    <Check className="h-3 w-3" />
                    {tag}
                  </button>
                ))}
                <button
                  onClick={() => setTags((prev) => [...prev, `Tag ${prev.length + 1}`])}
                  className="rounded-full border border-dashed border-[#9ca3af] px-3 py-1.5 text-sm text-[#6b7280]"
                >
                  + Add Tag
                </button>
              </div>

              <div className="mt-6 flex items-center justify-between rounded-xl bg-[#f9fafb] px-4 py-3">
                <div className="flex items-start gap-3">
                  <LayoutDashboard className="mt-0.5 h-5 w-5 text-[#22c55e]" />
                  <div>
                    <p className="font-medium text-[#111111]">Active & Available</p>
                    <p className="text-sm text-[#6b7280]">Listing will be visible to all international students immediately.</p>
                  </div>
                </div>

                <button
                  onClick={() => setActive((prev) => !prev)}
                  className={`relative h-7 w-12 rounded-full transition-all duration-150 ${active ? 'bg-[#111111]' : 'bg-[#d1d5db]'}`}
                  aria-label="Active and available"
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all duration-150 ${active ? 'left-6' : 'left-1'}`}
                  />
                </button>
              </div>
            </section>
          </main>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-[#e5e7eb] bg-white py-2 lg:hidden">
        <button className="flex flex-col items-center text-xs text-[#111111]">
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </button>
        <button className="flex flex-col items-center text-xs text-[#6b7280]">
          <ShoppingCart className="h-4 w-4" />
          Browse
        </button>
        <button className="flex flex-col items-center text-xs text-[#6b7280]">
          <ShoppingCart className="h-4 w-4" />
          Cart
        </button>
        <button className="flex flex-col items-center text-xs text-[#6b7280]">
          <MessageSquare className="h-4 w-4" />
          Profile
        </button>
      </nav>
    </div>
  );
}
