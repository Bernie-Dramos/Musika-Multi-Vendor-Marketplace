import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AnimatedSection } from '@/components/AnimatedSection';
import { useAuth } from '@/features/auth/context/AuthContext';

export function ForgotPassword() {
  const { resetPassword, isSupabaseReady } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const { error } = await resetPassword(email);

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message ?? 'Failed to send reset email. Please try again.');
      return;
    }

    setEmailSent(true);
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <AnimatedSection className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          {emailSent ? (
            /* ── Success state ── */
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#0F172A]">Check your inbox</h2>
              <p className="text-slate-600 text-sm max-w-xs mx-auto">
                We've sent a password reset link to <strong>{email}</strong>. The link expires in 1 hour.
              </p>
              <p className="text-slate-500 text-xs">
                Didn't receive it? Check your spam folder or{' '}
                <button
                  type="button"
                  className="text-emerald-600 hover:underline"
                  onClick={() => {
                    setEmailSent(false);
                    setEmail('');
                  }}
                >
                  try again
                </button>
                .
              </p>
              <Link
                to="/signin"
                className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Link>
            </div>
          ) : (
            /* ── Request form ── */
            <>
              <div className="mb-8">
                <Link
                  to="/signin"
                  className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </Link>
                <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Reset your password</h1>
                <p className="text-sm text-slate-600">
                  Enter the email address linked to your account and we'll send you a reset link.
                </p>
              </div>

              {/* Supabase not configured banner */}
              {!isSupabaseReady && (
                <div className="mb-6 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                  Backend is not connected. Password reset requires <code className="font-mono text-xs">VITE_SUPABASE_URL</code> and <code className="font-mono text-xs">VITE_SUPABASE_ANON_KEY</code>.
                </div>
              )}

              {/* Error */}
              {errorMessage && (
                <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="reset-email" className="block text-sm font-medium text-[#0F172A] mb-2">
                    Email Address
                  </label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                    autoComplete="email"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || !isSupabaseReady}
                  className="w-full h-12 bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold disabled:opacity-60"
                >
                  {isSubmitting ? 'Sending…' : 'Send Reset Link'}
                </Button>
              </form>
            </>
          )}
        </div>
      </AnimatedSection>
    </div>
  );
}
