/**
 * AuthCallback page
 *
 * Handles all Supabase redirect-based auth flows:
 *  - Email confirmation (type=signup)
 *  - Password recovery link (type=recovery)
 *  - Magic link sign-in (type=magiclink)
 *
 * URL format from Supabase:
 *   /auth/callback#access_token=...&type=signup
 *   /auth/callback?type=recovery#access_token=...
 *
 * Supabase JS v2 automatically exchanges the hash fragment for a session
 * via onAuthStateChange. We just need to detect the type and render the
 * correct UI accordingly.
 */
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AnimatedSection } from '@/components/AnimatedSection';
import { useAuth } from '@/features/auth/context/AuthContext';

type CallbackType = 'recovery' | 'signup' | 'magiclink' | 'unknown';
type PageState = 'loading' | 'set-password' | 'confirmed' | 'error';

export function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { updatePassword, isAuthenticated, isLoading } = useAuth();

  // Derive callbackType directly — no useState needed
  const callbackType = (
    searchParams.get('type') ??
    new URLSearchParams(window.location.hash.replace('#', '?')).get('type') ??
    'unknown'
  ) as CallbackType;

  // Track whether the recovery password form was submitted successfully
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // New password form (recovery flow)
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fully derived page state — no useEffect needed
  const pageState: PageState = isLoading
    ? 'loading'
    : !isAuthenticated
    ? 'error'
    : callbackType === 'recovery' && !isPasswordUpdated
    ? 'set-password'
    : 'confirmed';

  const authError =
    !isLoading && !isAuthenticated
      ? 'This link has expired or is invalid. Please request a new one.'
      : null;

  const errorMessage = formError ?? authError;


  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setFormError('Password must be at least 8 characters.');
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    const { error } = await updatePassword(newPassword);

    setIsSubmitting(false);

    if (error) {
      setFormError(error.message ?? 'Failed to update password. Please try again.');
      return;
    }

    setIsPasswordUpdated(true);
  };

  const passwordRequirements = [
    { label: 'At least 8 characters', met: newPassword.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(newPassword) },
    { label: 'One number', met: /\d/.test(newPassword) },
    { label: 'One special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) },
  ];

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <AnimatedSection className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">

          {/* Loading */}
          {pageState === 'loading' && (
            <div className="text-center py-8 space-y-3">
              <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-slate-600 text-sm">Verifying your link…</p>
            </div>
          )}

          {/* Error */}
          {pageState === 'error' && (
            <div className="text-center py-8 space-y-4">
              <XCircle className="w-12 h-12 text-red-500 mx-auto" />
              <h2 className="text-xl font-bold text-[#0F172A]">Link is invalid</h2>
              <p className="text-slate-600 text-sm">{errorMessage}</p>
              <Button onClick={() => navigate('/signin')} className="bg-[#0F172A] hover:bg-[#1E293B] text-white">
                Back to Sign In
              </Button>
            </div>
          )}

          {/* Confirmed (email verified or magic link) */}
          {pageState === 'confirmed' && (
            <div className="text-center py-8 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h2 className="text-xl font-bold text-[#0F172A]">
                {callbackType === 'recovery' ? 'Password updated!' : 'Email confirmed!'}
              </h2>
              <p className="text-slate-600 text-sm">
                {callbackType === 'recovery'
                  ? 'Your password has been changed successfully. You are now signed in.'
                  : 'Your account is now verified. Welcome to Musika!'}
              </p>
              <Button
                onClick={() => navigate('/profile', { replace: true })}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Go to My Profile
              </Button>
            </div>
          )}

          {/* Set new password (recovery flow) */}
          {pageState === 'set-password' && (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Set new password</h1>
                <p className="text-sm text-slate-600">Choose a strong password for your account.</p>
              </div>

              {errorMessage && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSetPassword} className="space-y-5">
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-[#0F172A] mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full h-12 border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-12"
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {/* Requirements */}
                  <ul className="mt-2 space-y-1">
                    {passwordRequirements.map((req) => (
                      <li
                        key={req.label}
                        className={`flex items-center gap-2 text-xs ${req.met ? 'text-emerald-600' : 'text-slate-400'}`}
                      >
                        <CheckCircle2 className={`w-3.5 h-3.5 ${req.met ? 'opacity-100' : 'opacity-30'}`} />
                        {req.label}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-[#0F172A] mb-2">
                    Confirm Password
                  </label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-12 border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                    autoComplete="new-password"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold disabled:opacity-60"
                >
                  {isSubmitting ? 'Updating…' : 'Update Password'}
                </Button>
              </form>
            </>
          )}
        </div>
      </AnimatedSection>
    </div>
  );
}
