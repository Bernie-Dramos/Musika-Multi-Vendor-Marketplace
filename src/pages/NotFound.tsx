import { Button } from '@/components/ui/button';

type Page = 'home' | 'services' | 'categories' | 'marketplace' | 'signin' | 'signup';

interface NotFoundProps {
  navigateTo: (page: Page) => void;
}

export function NotFound({ navigateTo }: NotFoundProps) {
  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-sm font-semibold text-emerald-600 mb-3">404 Error</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-[#0F172A] mb-4">
          Page not found
        </h1>
        <p className="text-lg text-slate-600 mb-8">
          The page you are looking for does not exist or may have been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => navigateTo('home')}
            className="bg-[#0F172A] hover:bg-[#1E293B] text-white"
          >
            Back to Home
          </Button>
          <Button
            onClick={() => navigateTo('services')}
            variant="outline"
            className="border-slate-300"
          >
            Browse Services
          </Button>
        </div>
      </div>
    </div>
  );
}
