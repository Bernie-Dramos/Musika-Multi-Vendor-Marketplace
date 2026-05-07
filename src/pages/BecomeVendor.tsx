import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Clock, FileText, ShieldCheck, Upload } from 'lucide-react';
import { useUpsertVendorApplicationMutation, useVendorApplicationQuery } from '@/features/vendor/hooks/useVendorApplication';

// ── File upload zone ──────────────────────────────────────────────────────────

function FileUploadZone({
  label,
  hint,
  icon: Icon,
  file,
  onFile,
  inputId,
}: {
  label: string;
  hint: string;
  icon: React.ElementType;
  file: File | null;
  onFile: (f: File | null) => void;
  inputId: string;
}) {
  return (
    <label
      htmlFor={inputId}
      className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#d1d5db] px-4 py-8 text-center transition-all hover:border-[#111111] hover:bg-[#f9fafb]"
    >
      <input
        id={inputId}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        aria-label={label}
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
      />
      <Icon className="h-7 w-7 text-[#9ca3af]" />
      <p className="text-sm font-medium text-[#374151]">{file ? file.name : label}</p>
      <p className="text-xs text-[#9ca3af]">{hint}</p>
    </label>
  );
}

// ── Success / Under Review screen ─────────────────────────────────────────────

function UnderReviewScreen({ firstName, userId }: { firstName: string; userId?: string }) {
  const refId = `#MSK-${(userId ?? '0000').slice(0, 4).toUpperCase()}-X`;
  const submissionDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const navigate = useNavigate();

  return (
    <main className="mx-auto flex max-w-4xl flex-col items-center gap-10 px-6 py-16 sm:flex-row sm:items-start sm:px-10">
        {/* Left: decorative image / status card */}
        <div className="relative w-full max-w-[340px] shrink-0">
          <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-[#e8eaf0]">
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#111111]">
                  <ShieldCheck className="h-8 w-8 text-white" />
                </div>
                <p className="text-sm font-semibold text-[#374151]">Application Submitted</p>
              </div>
            </div>
          </div>
          {/* Status badge overlay */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#111111] px-4 py-1.5 text-xs font-semibold text-white">
            ✓ STATUS: UNDER REVIEW
          </div>
        </div>

        {/* Right: content */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold leading-tight text-[#111111]">
            Your Business,<br />Your Control
          </h1>
          <p className="mt-4 text-[#374151]">
            Hello, <strong>{firstName}</strong>. We've received your application documents. Our team is currently reviewing your profile to ensure it meets Musika's global quality standards.
          </p>

          {/* Info card */}
          <div className="mt-6 rounded-2xl border border-[#e5e7eb] bg-white p-5">
            <div className="mb-4 flex gap-8 border-b border-[#e5e7eb] pb-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.6px] text-[#9ca3af]">Submission Date</p>
                <p className="mt-1 font-semibold text-[#111111]">{submissionDate}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.6px] text-[#9ca3af]">Reference ID</p>
                <p className="mt-1 font-semibold text-[#111111]">{refId}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[#9ca3af]" />
              <div>
                <p className="font-medium text-[#111111]">Estimated Wait Time</p>
                <p className="text-sm text-[#6b7280]">24-72 business hours for standard review.</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <Button
              onClick={() => navigate('/help-support')}
              className="rounded-full bg-[#111111] px-6 py-3 text-white hover:bg-black"
            >
              Support ↗
            </Button>
            <p className="text-sm text-[#9ca3af]">Need immediate assistance? Our support team is available 24/7.</p>
          </div>
        </div>
      </main>
  );
}

// ── Main BecomeVendor component ───────────────────────────────────────────────

type PageState = 'form' | 'success';

export function BecomeVendor() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const existingApplicationQuery = useVendorApplicationQuery(user?.id);
  const submitApplicationMutation = useUpsertVendorApplicationMutation(user?.id);

  const [pageState, setPageState] = useState<PageState>('form');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Redirect vendors and admins — they already have vendor access
  useEffect(() => {
    if (profile?.role === 'vendor' || profile?.role === 'admin') {
      navigate('/vendor-dashboard');
    }
  }, [profile?.role, navigate]);

  // Redirect already-applied users to their dashboard
  useEffect(() => {
    if (existingApplicationQuery.data?.status) {
      navigate('/vendor-dashboard');
    }
  }, [existingApplicationQuery.data?.status, navigate]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    legalBusinessName: '',
    businessCategory: '',
    taxId: '',
    websiteUrl: '',
  });

  const [businessLicenseFile, setBusinessLicenseFile] = useState<File | null>(null);
  const [governmentIdFile, setGovernmentIdFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/signin?next=/become-vendor');
      return;
    }
    if (!agreedToTerms) {
      setSubmitError('Please agree to the Terms of Service before submitting.');
      return;
    }

    setSubmitError(null);

    try {
      await submitApplicationMutation.mutateAsync({
        business_name: formData.legalBusinessName,
        business_type: 'individual',
        owner_name: `${formData.firstName} ${formData.lastName}`.trim(),
        owner_email: user.email ?? formData.email,
        owner_phone: formData.phone,
        business_description: '',
        category: formData.businessCategory,
        payment_method: 'bank_transfer',
      });
      setPageState('success');
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit application.');
    }
  };

  // ── Under Review screen ───────────────────────────────────────────────────
  if (pageState === 'success') {
    return (
      <UnderReviewScreen
        firstName={formData.firstName || user?.user_metadata?.full_name?.split(' ')[0] || 'there'}
        userId={user?.id}
      />
    );
  }

  // ── Application Form ──────────────────────────────────────────────────────
  if (pageState === 'form') {
    return (
      <main className="mx-auto max-w-xl px-6 py-12 sm:px-8">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-[#111111]">Partner with Musika</h1>
            <p className="mt-3 text-[#6b7280]">
              Join our curated ecosystem of global scholars and vendors. Complete the application below to start your journey.
            </p>
          </div>

          <form onSubmit={(e) => { void handleSubmit(e); }} className="space-y-8">
            {/* Section 1: Personal Details */}
            <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#111111] text-sm font-bold text-white">1</div>
                <h2 className="text-lg font-bold text-[#111111]">Personal Details</h2>
              </div>

              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#374151]">First Name</label>
                    <input
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="e.g. Julian"
                      className="h-11 w-full rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 text-sm text-[#111111] placeholder:text-[#9ca3af] focus:border-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#374151]">Last Name</label>
                    <input
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="e.g. Voss-Andreae"
                      className="h-11 w-full rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 text-sm text-[#111111] placeholder:text-[#9ca3af] focus:border-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#374151]">Email Address</label>
                  <input
                    type="email"
                    required
                    value={user?.email ?? formData.email}
                    disabled={!!user}
                    onChange={(e) => !user && setFormData({ ...formData, email: e.target.value })}
                    className={`h-11 w-full rounded-xl border border-[#e5e7eb] px-4 text-sm placeholder:text-[#9ca3af] focus:border-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 ${
                      user ? 'bg-[#f3f4f6] text-[#6b7280]' : 'bg-[#f9fafb] text-[#111111]'
                    }`}
                    placeholder="julian@institution.edu"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#374151]">Phone Number</label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="h-11 w-full rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 text-sm text-[#111111] placeholder:text-[#9ca3af] focus:border-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10"
                  />
                </div>
              </div>
            </section>

            {/* Divider */}
            <div className="h-px bg-[#e5e7eb]" />

            {/* Section 2: Business Information */}
            <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#111111] text-sm font-bold text-white">2</div>
                <h2 className="text-lg font-bold text-[#111111]">Business Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#374151]">Legal Business Name</label>
                  <input
                    required
                    value={formData.legalBusinessName}
                    onChange={(e) => setFormData({ ...formData, legalBusinessName: e.target.value })}
                    placeholder="Registered entity name"
                    className="h-11 w-full rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 text-sm text-[#111111] placeholder:text-[#9ca3af] focus:border-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="business-category" className="mb-1.5 block text-sm font-medium text-[#374151]">Business Category</label>
                    <select
                      id="business-category"
                      required
                      value={formData.businessCategory}
                      onChange={(e) => setFormData({ ...formData, businessCategory: e.target.value })}
                      className="h-11 w-full rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 text-sm text-[#374151] focus:border-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10"
                    >
                      <option value="">Academic Research</option>
                      <option value="books-education">Books &amp; Education</option>
                      <option value="services-tutoring">Services - Tutoring</option>
                      <option value="home-supplies">Home Supplies</option>
                      <option value="electronics">Electronics</option>
                      <option value="fashion">Fashion &amp; Accessories</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#374151]">Tax ID / EIN</label>
                    <input
                      value={formData.taxId}
                      onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                      placeholder="XX-XXXXXXXX"
                      className="h-11 w-full rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 text-sm text-[#111111] placeholder:text-[#9ca3af] focus:border-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#374151]">
                    Website URL <span className="text-[#9ca3af]">(Optional)</span>
                  </label>
                  <input
                    type="url"
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                    placeholder="https://www.your-studio.com"
                    className="h-11 w-full rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 text-sm text-[#111111] placeholder:text-[#9ca3af] focus:border-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10"
                  />
                </div>
              </div>
            </section>

            {/* Divider */}
            <div className="h-px bg-[#e5e7eb]" />

            {/* Section 3: Verification Documents */}
            <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#111111] text-sm font-bold text-white">3</div>
                <h2 className="text-lg font-bold text-[#111111]">Verification Documents</h2>
              </div>

              <div className="space-y-4">
                <FileUploadZone
                  label="Upload Business License"
                  hint="PDF, JPG or PNG (Max 10MB)"
                  icon={FileText}
                  file={businessLicenseFile}
                  onFile={setBusinessLicenseFile}
                  inputId="business-license-upload"
                />
                <FileUploadZone
                  label="Government-Issued ID"
                  hint="Scan of Passport or National ID"
                  icon={Upload}
                  file={governmentIdFile}
                  onFile={setGovernmentIdFile}
                  inputId="government-id-upload"
                />
              </div>
            </section>

            {/* Terms + Submit */}
            <div className="space-y-5">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#d1d5db] accent-[#111111]"
                />
                <span className="text-sm text-[#374151]">
                  I agree to the{' '}
                  <Link to="/help-support" className="font-medium text-[#111111] underline underline-offset-2">
                    Terms of Service
                  </Link>{' '}
                  and confirm that all provided information is accurate and legally binding.
                </span>
              </label>

              {submitError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</div>
              ) : null}

              <Button
                type="submit"
                disabled={submitApplicationMutation.isPending}
                className="h-14 w-full rounded-xl bg-[#111111] text-base font-semibold text-white hover:bg-black"
              >
                {submitApplicationMutation.isPending ? 'Submitting…' : 'Submit Application'}
              </Button>

              <p className="text-center text-[10px] font-semibold uppercase tracking-[1px] text-[#9ca3af]">
                Secure verification powered by Musika
              </p>
            </div>
          </form>
      </main>
    );
  }
}
