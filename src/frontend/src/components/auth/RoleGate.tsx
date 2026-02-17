import { useIsCallerAdmin } from '../../hooks/useQueries';
import { useStrings } from '../../i18n/useStrings';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface RoleGateProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function RoleGate({ children, requireAdmin = false }: RoleGateProps) {
  const s = useStrings();
  const { data: isAdmin, isLoading } = useIsCallerAdmin();

  if (isLoading) {
    return null;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{s.accessDenied}</AlertTitle>
          <AlertDescription>{s.accessDeniedDesc}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}
