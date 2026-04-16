import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import { PageSectionContainer, PageHeroHeader, PageContentCard, PageCTAFooter } from '@/components/PageScaffold';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { vendorBenefits, vendorRequirements } from '@/lib/vendor';
import { ChevronRight, CheckCircle2 } from 'lucide-react';
import { useUpsertVendorApplicationMutation, useVendorApplicationQuery } from '@/features/vendor/hooks/useVendorApplication';

type WizardStep = 'landing' | 'info' | 'business' | 'payment' | 'review' | 'success';

export function BecomeVendor() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const existingApplicationQuery = useVendorApplicationQuery(user?.id);
  const submitApplicationMutation = useUpsertVendorApplicationMutation(user?.id);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<WizardStep>('landing');
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: 'individual' as 'individual' | 'business' | 'non_profit',
    ownerName: '',
    ownerPhone: '',
    businessDescription: '',
    category: '',
    businessRegistration: '',
    paymentMethod: 'bank_transfer' as 'bank_transfer' | 'stripe' | 'paypal',
  });

  const handleStartOnboarding = () => {
    if (!user) {
      navigate('/signin?next=/become-vendor');
      return;
    }

    if (existingApplicationQuery.data?.status) {
      navigate('/vendor-dashboard');
      return;
    }

    setCurrentStep('info');
  };

  const handleNext = () => {
    const steps: WizardStep[] = ['info', 'business', 'payment', 'review'];
    const currentIndex = steps.indexOf(currentStep as WizardStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    const steps: WizardStep[] = ['info', 'business', 'payment', 'review'];
    const currentIndex = steps.indexOf(currentStep as WizardStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      return;
    }

    setSubmitError(null);

    try {
      await submitApplicationMutation.mutateAsync({
        business_name: formData.businessName,
        business_type: formData.businessType,
        owner_name: formData.ownerName,
        owner_email: user.email ?? '',
        owner_phone: formData.ownerPhone,
        business_description: formData.businessDescription,
        category: formData.category,
        payment_method: formData.paymentMethod,
      });
      setCurrentStep('success');
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit application.');
    }
  };

  // Landing Page
  if (currentStep === 'landing') {
    return (
      <PageSectionContainer>
        <div className="space-y-12">
          <PageHeroHeader
            title="Become a Vendor"
            description="Join thousands of sellers reaching international students. Start selling on Musika today."
            action={
              <Button onClick={handleStartOnboarding} className="bg-emerald-600 hover:bg-emerald-700">
                Get Started
              </Button>
            }
          />

          {/* Benefits Section */}
          <div>
            <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Why Sell on Musika?</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {vendorBenefits.map((benefit) => (
                <PageContentCard key={benefit.id} className="space-y-3 hover:shadow-md transition-shadow">
                  <div className="text-4xl">{benefit.icon}</div>
                  <h3 className="font-semibold text-[#0F172A]">{benefit.title}</h3>
                  <p className="text-slate-600 text-sm">{benefit.description}</p>
                </PageContentCard>
              ))}
            </div>
          </div>

          {/* Requirements Section */}
          <div>
            <h2 className="text-2xl font-bold text-[#0F172A] mb-6">What We Require</h2>
            <div className="grid md:grid-cols-2 gap-4 max-w-4xl">
              {vendorRequirements.map((req) => (
                <div key={req.id} className="flex gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <CheckCircle2
                    className={`w-5 h-5 flex-shrink-0 mt-0.5 ${req.required ? 'text-emerald-600' : 'text-slate-400'}`}
                  />
                  <div>
                    <h4 className="font-semibold text-[#0F172A] text-sm">{req.title}</h4>
                    <p className="text-slate-600 text-xs">{req.description}</p>
                    {req.required && <Badge className="mt-2 text-xs">Required</Badge>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <PageCTAFooter
            title="Ready to Start Selling?"
            description="Join Musika's vendor community and reach thousands of students."
            action={
              <Button onClick={handleStartOnboarding} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Complete Onboarding
              </Button>
            }
          />
        </div>
      </PageSectionContainer>
    );
  }

  // Wizard Steps
  const wizardSteps = [
    { id: 'info', label: 'Your Info', completed: !!formData.ownerName },
    { id: 'business', label: 'Business Details', completed: !!formData.businessName },
    { id: 'payment', label: 'Payment Setup', completed: !!formData.paymentMethod },
    { id: 'review', label: 'Review', completed: false },
  ];

  const currentStepIndex = wizardSteps.findIndex((s) => s.id === currentStep);

  return (
    <PageSectionContainer>
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Progress */}
        <div>
          <div className="flex justify-between mb-4">
            {wizardSteps.map((step, idx) => (
              <div key={step.id} className="flex-1">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                      idx <= currentStepIndex ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span className="text-sm font-medium text-[#0F172A] hidden sm:inline">{step.label}</span>
                </div>
                {idx < wizardSteps.length - 1 && (
                  <div className={`h-1 mt-2 rounded ${idx < currentStepIndex ? 'bg-emerald-600' : 'bg-slate-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step: Your Info */}
        {currentStep === 'info' && (
          <PageContentCard className="space-y-5">
            <h2 className="text-xl font-bold text-[#0F172A]">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Full Name *</label>
                <Input
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="border-slate-300"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Email Address *</label>
                <Input value={user?.email || ''} disabled className="border-slate-300 bg-slate-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Phone Number *</label>
                <Input
                  value={formData.ownerPhone}
                  onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                  className="border-slate-300"
                  placeholder="+1 (416) 555-0123"
                />
              </div>
            </div>
          </PageContentCard>
        )}

        {/* Step: Business Details */}
        {currentStep === 'business' && (
          <PageContentCard className="space-y-5">
            <h2 className="text-xl font-bold text-[#0F172A]">Business Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Business Name *</label>
                <Input
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="border-slate-300"
                  placeholder="Your business name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Business Type *</label>
                <select
                  value={formData.businessType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      businessType: e.target.value as 'individual' | 'business' | 'non_profit',
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="individual">Individual/Sole Proprietor</option>
                  <option value="business">Business/Partnership</option>
                  <option value="non_profit">Non-Profit Organization</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select a category</option>
                  <option value="books-education">Books & Education</option>
                  <option value="services-tutoring">Services - Tutoring</option>
                  <option value="home-supplies">Home Supplies</option>
                  <option value="electronics">Electronics</option>
                  <option value="fashion">Fashion & Accessories</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Business Description *</label>
                <Textarea
                  value={formData.businessDescription}
                  onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
                  className="border-slate-300"
                  placeholder="Tell us about your business..."
                  rows={4}
                />
              </div>
            </div>
          </PageContentCard>
        )}

        {/* Step: Payment Setup */}
        {currentStep === 'payment' && (
          <PageContentCard className="space-y-5">
            <h2 className="text-xl font-bold text-[#0F172A]">Payment Method</h2>
            <div className="space-y-4">
              <p className="text-sm text-slate-600">Choose how you'd like to receive payouts from your sales.</p>
              <div className="space-y-3">
                {['bank_transfer', 'stripe', 'paypal'].map((method) => (
                  <label
                    key={method}
                    className="flex items-center gap-3 p-3 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50"
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method}
                      checked={formData.paymentMethod === method}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paymentMethod: e.target.value as 'bank_transfer' | 'stripe' | 'paypal',
                        })
                      }
                      className="w-4 h-4"
                    />
                    <span className="font-medium text-[#0F172A]">
                      {{
                        bank_transfer: 'Direct Bank Transfer',
                        stripe: 'Stripe Connect',
                        paypal: 'PayPal',
                      }[method]}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </PageContentCard>
        )}

        {/* Step: Review */}
        {currentStep === 'review' && (
          <PageContentCard className="space-y-5">
            <h2 className="text-xl font-bold text-[#0F172A]">Review Your Information</h2>
            <div className="space-y-4 bg-slate-50 p-4 rounded-lg">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Name</p>
                <p className="text-[#0F172A] font-medium">{formData.ownerName}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Business</p>
                <p className="text-[#0F172A] font-medium">{formData.businessName}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Category</p>
                <p className="text-[#0F172A] font-medium capitalize">{formData.category}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Payment Method</p>
                <p className="text-[#0F172A] font-medium capitalize">
                  {formData.paymentMethod === 'bank_transfer'
                    ? 'Bank Transfer'
                    : formData.paymentMethod === 'stripe'
                      ? 'Stripe'
                      : 'PayPal'}
                </p>
              </div>
            </div>
            {submitError ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{submitError}</div>
            ) : null}
            <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-lg">
              <p className="text-sm text-emerald-900">
                ✓ By submitting, you agree to our Vendor Terms of Service and confirm that all information is accurate.
              </p>
            </div>
          </PageContentCard>
        )}

        {/* Success */}
        {currentStep === 'success' && (
          <PageContentCard className="text-center py-12 space-y-4">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-[#0F172A]">Application Submitted!</h2>
            <p className="text-slate-600">Thank you for your submission. Our team will review your application within 2-3 business days.</p>
            <p className="text-sm text-slate-500">You'll receive an email update at {user?.email} with the status of your application.</p>
            <Button onClick={() => navigate('/vendor-dashboard')} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Go to Dashboard
            </Button>
          </PageContentCard>
        )}

        {/* Navigation */}
        {currentStep !== 'success' && (
          <div className="flex justify-between gap-4">
            <Button
              onClick={() => (currentStep === 'info' ? navigate('/') : handlePrevious())}
              variant="outline"
              className="border-slate-300"
            >
              {currentStep === 'info' ? 'Cancel' : 'Previous'}
            </Button>
            <Button
              onClick={() => {
                if (currentStep === 'review') {
                  void handleSubmit();
                  return;
                }
                handleNext();
              }}
              disabled={submitApplicationMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {currentStep === 'review'
                ? submitApplicationMutation.isPending
                  ? 'Submitting…'
                  : 'Submit Application'
                : 'Next'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </PageSectionContainer>
  );
}
