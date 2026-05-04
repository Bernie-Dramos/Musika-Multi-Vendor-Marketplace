import { useMemo, useState } from 'react';

type BrandLogoVariant = 'header' | 'footer';

interface BrandLogoProps {
  variant?: BrandLogoVariant;
  className?: string;
}

const logoSources: Record<BrandLogoVariant, string> = {
  header: '/images/logo-header.png',
  footer: '/images/logo-footer.png',
};

export function BrandLogo({ variant = 'header', className = '' }: BrandLogoProps) {
  const [imageFailed, setImageFailed] = useState(false);

  const config = useMemo(
    () =>
      variant === 'header'
        ? {
            imageClassName: 'h-7 w-auto sm:h-8',
            wordClassName: 'text-[28px] font-black tracking-[-0.08em] text-[#d8e1ee] sm:text-[34px]',
            pillClassName: 'rounded-full bg-[#1f6b78] px-3 py-1 text-sm font-medium tracking-normal text-white sm:px-4 sm:text-base',
            subtitleClassName: 'text-[7px] uppercase tracking-[0.14em] text-[#d8e1ee] sm:text-[8px]',
          }
        : {
            imageClassName: 'h-12 w-auto sm:h-14',
            wordClassName: 'text-[42px] font-black tracking-[-0.08em] text-[#cfd9e8] sm:text-[54px]',
            pillClassName: 'rounded-full bg-[#1f6b78] px-4 py-1.5 text-xl font-medium tracking-normal text-white sm:px-5 sm:text-2xl',
            subtitleClassName: 'text-[10px] uppercase tracking-[0.14em] text-[#cfd9e8] sm:text-[11px]',
          },
    [variant]
  );

  if (!imageFailed) {
    return (
      <img
        src={logoSources[variant]}
        alt="Musika"
        className={`${config.imageClassName} ${className}`.trim()}
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
    <div className={`inline-flex flex-col ${className}`.trim()}>
      <div className="flex items-center leading-none">
        <span className={config.wordClassName}>Mu</span>
        <span className={config.pillClassName}>sika</span>
        <span className={config.wordClassName}>a</span>
      </div>
      <span className={config.subtitleClassName}>International Student Multivendor Marketplace</span>
    </div>
  );
}