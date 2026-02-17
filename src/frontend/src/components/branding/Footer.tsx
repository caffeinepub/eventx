import { useStrings } from '../../i18n/useStrings';
import { Heart } from 'lucide-react';

export function Footer() {
  const s = useStrings();
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(window.location.hostname || 'eventx-app');
  
  return (
    <footer className="border-t border-border bg-card py-6 text-center text-sm text-muted-foreground">
      <p className="flex items-center justify-center gap-1">
        {s.builtWithLove}{' '}
        <Heart className="h-4 w-4 fill-red-500 text-red-500" />{' '}
        {s.by}{' '}
        <a
          href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary hover:underline"
        >
          caffeine.ai
        </a>
      </p>
      <p className="mt-1">© {currentYear} EventX</p>
    </footer>
  );
}
