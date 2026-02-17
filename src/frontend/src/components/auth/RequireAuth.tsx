import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { useStrings } from '../../i18n/useStrings';
import { Loader2 } from 'lucide-react';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { identity, login, loginStatus, isInitializing } = useInternetIdentity();
  const s = useStrings();

  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">{s.loading}</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return (
      <div className="flex h-screen items-center justify-center bg-background px-4">
        <div className="flex max-w-md flex-col items-center gap-6 text-center">
          <img src="/assets/generated/eventx-app-icon.dim_1024x1024.png" alt={s.appName} className="h-32 w-32" />
          <h1 className="text-4xl font-bold tracking-tight">{s.appName}</h1>
          <p className="text-lg text-muted-foreground">
            Gerencie eventos de cultura alternativa com estilo
          </p>
          <Button
            onClick={login}
            disabled={loginStatus === 'logging-in'}
            size="lg"
            className="w-full"
          >
            {loginStatus === 'logging-in' ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {s.loggingIn}
              </>
            ) : (
              s.login
            )}
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
