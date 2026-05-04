import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Upload, Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { AnimatedSection } from '@/components/AnimatedSection';
import { useAuth } from '@/features/auth/context/AuthContext';
import type { NavigablePage } from '@/lib/navigation';

interface SignUpProps {
  navigateTo?: (page: NavigablePage) => void;
}

export function SignUp({ navigateTo }: SignUpProps) {
  const navigate = useNavigate();
  const { signUp, isSupabaseReady } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);

  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [university, setUniversity] = useState('');
  const [country, setCountry] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('You must agree to the Terms of Service to create an account.');
      return;
    }

    setIsSubmitting(true);

    const { error } = await signUp(email, password, {
      full_name: `${firstName} ${lastName}`.trim() || undefined,
      university: university || undefined,
      country: country || undefined,
      phone: phone || undefined,
      marketing_consent: marketingConsent,
      role: 'student',
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message ?? 'Sign up failed. Please try again.');
      return;
    }

    // Supabase sends a confirmation email; advance to Step 2
    setStep(2);
  };

  const handleNavigateToSignIn = () => {
    if (navigateTo) {
      navigateTo('signin');
    } else {
      navigate('/signin');
    }
  };

  const passwordRequirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'One number', met: /\d/.test(password) },
    { label: 'One special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <AnimatedSection className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 animate-fade-in-up">

          {/* Step 3 — Complete */}
          {step === 3 ? (
            <div className="py-6 space-y-6">
              {/* Step indicator */}
              <div className="flex items-center justify-center gap-4 mb-2">
                {[{ num: 1, label: 'Account Setup' }, { num: 2, label: 'Verification' }, { num: 3, label: 'Complete' }].map((s, index) => (
                  <div key={s.num} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold bg-[#0F172A] text-white">
                        {s.num < 3 ? <Check className="w-4 h-4" /> : s.num}
                      </div>
                      <span className="text-xs text-slate-500 mt-1">{s.label}</span>
                    </div>
                    {index < 2 && <div className="w-12 h-px bg-[#0F172A] mx-2 mb-5" />}
                  </div>
                ))}
              </div>

              <div className="text-center space-y-4 pt-2">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#0F172A]">
                    You're all set{firstName ? `, ${firstName}` : ''}!
                  </h2>
                  <p className="text-slate-600 text-sm mt-2 max-w-sm mx-auto">
                    Your account is being activated. Here's what happens next:
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-3">
                <p className="text-sm font-semibold text-[#0F172A]">What happens next?</p>
                {[
                  'Your activation email has been sent to ' + email,
                  'Click the link in that email to confirm your address',
                  'Sign in and start exploring verified student services',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-emerald-600" />
                    </div>
                    <p className="text-sm text-slate-600">{item}</p>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                onClick={handleNavigateToSignIn}
                className="w-full h-12 bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold"
              >
                Go to Sign In
              </Button>
            </div>

          ) : step === 2 ? (
            /* Step 2 — Verification */
            <div className="py-4 space-y-6">
              {/* Step indicator */}
              <div className="flex items-center justify-center gap-4 mb-2">
                {[{ num: 1, label: 'Account Setup' }, { num: 2, label: 'Verification' }, { num: 3, label: 'Complete' }].map((s, index) => (
                  <div key={s.num} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        s.num <= 2 ? 'bg-[#0F172A] text-white' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {s.num === 1 ? <Check className="w-4 h-4" /> : s.num}
                      </div>
                      <span className="text-xs text-slate-500 mt-1">{s.label}</span>
                    </div>
                    {index < 2 && <div className={`w-12 h-px mx-2 mb-5 ${s.num === 1 ? 'bg-[#0F172A]' : 'bg-slate-300'}`} />}
                  </div>
                ))}
              </div>

              <div className="text-center space-y-3">
                <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#0F172A]">Verify your email</h2>
                  <p className="text-slate-600 text-sm mt-1">
                    A verification link was sent to <strong>{email}</strong>
                  </p>
                </div>
              </div>

              {/* Application summary */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Application Summary</p>
                {[
                  { label: 'Name', value: `${firstName} ${lastName}`.trim() },
                  { label: 'Email', value: email },
                  { label: 'University', value: university },
                  { label: 'Country', value: country },
                ].map(({ label, value }) => value ? (
                  <div key={label} className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">{label}</span>
                    <span className="font-medium text-[#0F172A] text-right max-w-[60%] truncate">{value}</span>
                  </div>
                ) : null)}
              </div>

              <Button
                type="button"
                onClick={() => setStep(3)}
                className="w-full h-12 bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold"
              >
                I've verified my email →
              </Button>
              <p className="text-center text-sm text-slate-500">
                Didn't receive the email?{' '}
                <button type="button" className="text-emerald-600 hover:text-emerald-700 font-medium">
                  Resend
                </button>
              </p>
            </div>

          ) : (
            /* Step 1 — Form */
            <>
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#0F172A] mb-2">
              Join Musika
            </h1>
            <p className="text-sm text-slate-600">
              Create your account to connect with verified services
            </p>
          </div>

          {/* Supabase not configured banner */}
          {!isSupabaseReady && (
            <div className="mb-6 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
              Backend is not connected. Add <code className="font-mono text-xs">VITE_SUPABASE_URL</code> and <code className="font-mono text-xs">VITE_SUPABASE_ANON_KEY</code> to your <code className="font-mono text-xs">.env.local</code> to enable sign up.
            </div>
          )}

          {/* Error message */}
          {errorMessage && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {errorMessage}
            </div>
          )}

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {[
              { num: 1, label: 'Account Setup' },
              { num: 2, label: 'Verification' },
              { num: 3, label: 'Complete' },
            ].map((s, index) => (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step >= s.num
                        ? 'bg-[#0F172A] text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {s.num}
                  </div>
                  <span className="text-xs text-slate-500 mt-1">{s.label}</span>
                </div>
                {index < 2 && (
                  <div className="w-12 h-px bg-slate-300 mx-2 mb-5" />
                )}
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-[#0F172A]">
                Personal Information
              </h3>

              {/* First Name / Last Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-slate-600 mb-2">
                    First Name<span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Alex"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full h-12 border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-2">
                    Last Name<span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Johnson"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full h-12 border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm text-slate-600 mb-2">
                  Phone Number<span className="text-red-500">*</span>
                </label>
                <Input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-12 border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm text-slate-600 mb-2">
                  Email Address<span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>

              {/* University */}
              <div>
                <label className="block text-sm text-slate-600 mb-2">
                  University Name<span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="Enter your university name"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full h-12 border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">
                  Must be a valid university email ending in .edu, etc.
                </p>
              </div>

              {/* Country */}
              <div>
                <label htmlFor="signup-country" className="block text-sm text-slate-600 mb-2">
                  Country/Region<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="signup-country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full h-12 border border-slate-300 rounded-lg px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                    required
                  >
                    <option value="">Select your country/region</option>
                    <option value="india">India</option>
                    <option value="usa">United States</option>
                    <option value="uk">United Kingdom</option>
                    <option value="canada">Canada</option>
                    <option value="australia">Australia</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Student ID Upload */}
              <div>
                <label className="block text-sm text-slate-600 mb-2">
                  Upload Student ID Document<span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-emerald-500 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                  <p className="text-sm text-slate-600 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-slate-400">
                    PNG, JPG, PDF up to 10MB
                  </p>
                </div>
              </div>
            </div>

            {/* Password Setup */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-[#0F172A]">Password Setup</h3>

              {/* Password */}
              <div>
                <label className="block text-sm text-slate-600 mb-2">
                  Password<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm text-slate-600 mb-2">
                  Confirm Password<span className="text-red-500">*</span>
                </label>
                <Input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-12 border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Password Requirements */}
              <div className="space-y-2">
                <p className="text-sm text-slate-600">Password requirements:</p>
                <ul className="space-y-1">
                  {passwordRequirements.map((req) => (
                    <li
                      key={req.label}
                      className={`flex items-center gap-2 text-sm ${
                        req.met ? 'text-emerald-600' : 'text-slate-500'
                      }`}
                    >
                      <Check
                        className={`w-4 h-4 ${req.met ? 'opacity-100' : 'opacity-0'}`}
                      />
                      <span className={req.met ? 'line-through' : ''}>{req.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                  className="mt-0.5 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                  required
                />
                <span className="text-sm text-slate-600">
                  I agree to the{' '}
                  <button type="button" className="text-emerald-600 hover:text-emerald-700">
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button type="button" className="text-emerald-600 hover:text-emerald-700">
                    Privacy Policy
                  </button>
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={marketingConsent}
                  onCheckedChange={(checked) => setMarketingConsent(checked as boolean)}
                  className="mt-0.5 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                />
                <span className="text-sm text-slate-600">
                  I would like to receive marketing communications and updates (optional)
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || !isSupabaseReady}
              className="w-full h-12 bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold disabled:opacity-60"
            >
              {isSubmitting ? 'Creating account…' : 'Create Account'}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-slate-600 mt-6">
            Signing up as a vendor?{' '}
            <Link
              to="/become-vendor"
              className="text-[#0F172A] hover:text-[#1E293B] font-medium underline underline-offset-2"
            >
              Sign up as a vendor
            </Link>
          </p>
          <p className="text-center text-sm text-slate-600 mt-3">
            Already have an account?{' '}
            <button
              type="button"
              onClick={handleNavigateToSignIn}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Sign In
            </button>
          </p>
            </>
          )}
        </div>
      </AnimatedSection>
    </div>
  );
}
