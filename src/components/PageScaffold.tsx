import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageSectionContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageSectionContainer({ children, className }: PageSectionContainerProps) {
  return (
    <div className={cn('min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8', className)}>
      <div className="max-w-6xl mx-auto">{children}</div>
    </div>
  );
}

interface PageHeroHeaderProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function PageHeroHeader({ title, description, action }: PageHeroHeaderProps) {
  return (
    <section className="text-center mb-10">
      <h1 className="text-3xl lg:text-4xl font-bold text-[#0F172A] mb-3">{title}</h1>
      <p className="text-slate-600 max-w-2xl mx-auto">{description}</p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </section>
  );
}

interface PageSectionHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function PageSectionHeader({ title, description, action, className }: PageSectionHeaderProps) {
  return (
    <header className={cn('flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5', className)}>
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-[#0F172A]">{title}</h2>
        {description ? <p className="text-slate-600 mt-1">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

interface PageContentCardProps {
  children: ReactNode;
  className?: string;
}

export function PageContentCard({ children, className }: PageContentCardProps) {
  return <div className={cn('bg-white border border-slate-200 rounded-2xl p-6 shadow-sm', className)}>{children}</div>;
}

interface PageFilterSidebarProps {
  title: string;
  children: ReactNode;
}

export function PageFilterSidebar({ title, children }: PageFilterSidebarProps) {
  return (
    <aside className="bg-[#0F172A] rounded-2xl p-5 text-white sticky top-24">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-3 text-sm text-slate-300">{children}</div>
    </aside>
  );
}

interface PageStateBlockProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function PageStateBlock({ title, description, action }: PageStateBlockProps) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center">
      <h3 className="text-xl font-semibold text-[#0F172A] mb-3">{title}</h3>
      <p className="text-slate-700 mb-6 max-w-2xl mx-auto">{description}</p>
      {action ? action : null}
    </div>
  );
}

interface PageCTAFooterProps {
  title: string;
  description: string;
  action: ReactNode;
}

export function PageCTAFooter({ title, description, action }: PageCTAFooterProps) {
  return (
    <section className="mt-10 rounded-2xl bg-[#0F172A] p-8 text-white text-center">
      <h3 className="text-2xl font-semibold mb-2">{title}</h3>
      <p className="text-slate-300 max-w-2xl mx-auto mb-6">{description}</p>
      <div className="flex justify-center">{action}</div>
    </section>
  );
}
