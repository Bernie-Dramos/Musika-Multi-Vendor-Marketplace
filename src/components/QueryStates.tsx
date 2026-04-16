import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { PageStateBlock } from '@/components/PageScaffold';

interface PageLoadingStateProps {
  title?: string;
  description?: string;
}

export function PageLoadingState({
  title = 'Loading content',
  description = 'Please wait while we load the latest data.',
}: PageLoadingStateProps) {
  return <PageStateBlock title={title} description={description} />;
}

interface PageEmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function PageEmptyState({ title, description, action }: PageEmptyStateProps) {
  return <PageStateBlock title={title} description={description} action={action} />;
}

interface PageErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function PageErrorState({
  title = 'Unable to load data',
  description = 'Something went wrong while loading this content. Please try again.',
  onRetry,
}: PageErrorStateProps) {
  return (
    <PageStateBlock
      title={title}
      description={description}
      action={
        onRetry ? (
          <Button className="bg-[#0F172A] hover:bg-[#1E293B] text-white" onClick={onRetry}>
            Retry
          </Button>
        ) : null
      }
    />
  );
}
