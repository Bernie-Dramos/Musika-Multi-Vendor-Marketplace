import { Check, Plus, Search, Mic, Camera } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

const imageKeywordMap: Array<{ patterns: RegExp[]; query: string }> = [
  { patterns: [/airport|bus|taxi|car|transport|road|train/], query: 'transportation' },
  { patterns: [/visa|passport|legal|document|law|attestation/], query: 'legal consultation' },
  { patterns: [/clinic|health|wellness|medical|hospital|doctor|dental/], query: 'healthcare' },
  { patterns: [/apartment|housing|house|room|dorm|hostel|home/], query: 'accommodation' },
  { patterns: [/food|meal|dining|restaurant|kitchen|cafe/], query: 'dining' },
  { patterns: [/phone|laptop|keyboard|mouse|headphone|gadget|electronic|speaker/], query: 'electronics' },
  { patterns: [/beauty|salon|spa|hair|makeup|skincare/], query: 'beauty' },
];

function deriveQueryFromImage(file: File): string {
  const name = file.name.toLowerCase();
  const mime = file.type.toLowerCase();
  const source = `${name} ${mime}`;

  for (const matcher of imageKeywordMap) {
    if (matcher.patterns.some((pattern) => pattern.test(source))) {
      return matcher.query;
    }
  }

  return 'services';
}

export function formatINR(value: number) {
  return `₹${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value)}`;
}

export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#3b82f6]', className)}>
      <Check className="h-3 w-3 text-white" />
    </span>
  );
}

type StatusTone = 'approved' | 'pending' | 'rejected';

const statusMap: Record<StatusTone, { dotClass: string; textClass: string }> = {
  approved: { dotClass: 'bg-[#22c55e]', textClass: 'text-[#16a34a]' },
  pending: { dotClass: 'bg-[#f59e0b]', textClass: 'text-[#d97706]' },
  rejected: { dotClass: 'bg-[#ef4444]', textClass: 'text-[#dc2626]' },
};

export function StatusDot({ tone, children }: { tone: StatusTone; children: string }) {
  const palette = statusMap[tone];
  return (
    <span className={cn('inline-flex items-center gap-2 text-sm font-medium', palette.textClass)}>
      <span className={cn('h-2 w-2 rounded-full', palette.dotClass)} />
      {children}
    </span>
  );
}

export function LanguageBadge({ label }: { label: string }) {
  return <span className="inline-flex rounded px-2 py-1 text-[11px] text-[#374151] bg-[#f3f4f6]">{label}</span>;
}

export function RatingStars({ rating, reviews }: { rating: number; reviews: number }) {
  const full = Math.round(rating);
  return (
    <span className="inline-flex items-center gap-1 text-[13px]">
      <span>
        {Array.from({ length: 5 }).map((_, index) => (
          <span key={index} className={index < full ? 'text-[#f5a623]' : 'text-[#d1d5db]'}>
            {index < full ? '★' : '☆'}
          </span>
        ))}
      </span>
      <span className="text-[#374151]">{rating.toFixed(1)} ({reviews})</span>
    </span>
  );
}

export function QuickAddButton({ onAdd }: { onAdd: () => void }) {
  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive(true);
    onAdd();
    setTimeout(() => setActive(false), 220);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#111111] text-white transition-all duration-150',
        active && 'scale-110'
      )}
      aria-label="Quick add"
    >
      <Plus className="h-4 w-4" />
    </button>
  );
}

export function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="rounded-2xl border border-[#e5e7eb] bg-white px-6 py-10 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f3f4f6] text-[#6b7280]">
        <Search className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-bold text-[#111111]">No results found</h3>
      <p className="mt-2 text-sm text-[#6b7280]">Try adjusting your filters or search terms</p>
      <Button onClick={onClear} className="mt-4 bg-[#111111] text-white hover:bg-black">
        Clear Filters
      </Button>
    </div>
  );
}

export function UnifiedSearchBar({
  placeholder,
  value,
  onChange,
  showSubmitButton = true,
  enableVoiceSearch = false,
  enableImageSearch = false,
}: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  showSubmitButton?: boolean;
  enableVoiceSearch?: boolean;
  enableImageSearch?: boolean;
}) {
  const [isListening, setIsListening] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [searchHint, setSearchHint] = useState<string | null>(null);
  const uploadRef = useRef<HTMLInputElement>(null);

  const handleVoiceSearch = () => {
    if (!enableVoiceSearch) {
      return;
    }

    const apiWindow = window as Window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };

    const RecognitionCtor = apiWindow.SpeechRecognition ?? apiWindow.webkitSpeechRecognition;

    if (!RecognitionCtor) {
      setSearchHint('Voice input is not supported in this browser.');
      return;
    }

    const recognition = new RecognitionCtor();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript ?? '')
        .join(' ')
        .trim();

      if (transcript.length > 0) {
        onChange(transcript);
        setSearchHint(`Voice search: "${transcript}"`);
      }
    };

    recognition.onerror = () => {
      setSearchHint('Voice search could not process audio. Try again.');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    setSearchHint('Listening...');
    setIsListening(true);
    recognition.start();
  };

  const applyImageFile = (file: File | null) => {
    if (!enableImageSearch || !file || !file.type.startsWith('image/')) {
      return;
    }

    const derivedQuery = deriveQueryFromImage(file);
    onChange(derivedQuery);
    setSearchHint(`Image search mapped to: "${derivedQuery}"`);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    applyImageFile(file);
    event.currentTarget.value = '';
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    if (!enableImageSearch) {
      return;
    }

    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0] ?? null;
    applyImageFile(file);
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div
        className={cn(
          'relative rounded-full transition-colors',
          dragActive && 'ring-2 ring-[#111111]'
        )}
        onDragOver={(event) => {
          if (!enableImageSearch) {
            return;
          }

          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => {
          if (!enableImageSearch) {
            return;
          }

          setDragActive(false);
        }}
        onDrop={handleDrop}
      >
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6b7280]" />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={cn(
            'h-12 w-full rounded-full border border-[#e5e7eb] bg-white pl-12 text-sm text-[#111111] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#111111]',
            showSubmitButton ? 'pr-32' : 'pr-24'
          )}
        />
        <input
          ref={uploadRef}
          type="file"
          accept="image/*"
          className="hidden"
          aria-label="Upload image for search"
          title="Upload image for search"
          onChange={handleFileChange}
        />
        <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1">
          <button
            onClick={handleVoiceSearch}
            className={cn(
              'rounded-full p-2 text-[#6b7280] transition-all duration-150 hover:bg-[#f3f4f6] hover:text-[#111111]',
              isListening && 'bg-[#111111] text-white hover:bg-[#111111] hover:text-white'
            )}
            aria-label="Voice search"
          >
            <Mic className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              if (!enableImageSearch) {
                return;
              }

              uploadRef.current?.click();
            }}
            className="rounded-full p-2 text-[#6b7280] transition-all duration-150 hover:bg-[#f3f4f6] hover:text-[#111111]"
            aria-label="Image search"
          >
            <Camera className="h-4 w-4" />
          </button>
          {showSubmitButton ? (
            <button className="rounded-full p-2 text-[#6b7280] transition-all duration-150 hover:bg-[#f3f4f6] hover:text-[#111111]" aria-label="Search submit">
              <Search className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      {searchHint ? (
        <p className="mt-2 px-3 text-xs text-[#6b7280]">{searchHint}</p>
      ) : null}
      {dragActive ? (
        <p className="mt-1 px-3 text-xs text-[#111111]">Drop image to search matching services</p>
      ) : null}
    </div>
  );
}
