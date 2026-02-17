import { useStrings } from '../i18n/useStrings';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetBalance, useIsCallerAdmin } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LogOut, Wallet, User, Shield } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export function PerfilPage() {
  const s = useStrings();
  const { clear, identity } = useInternetIdentity();
  const { data: profile } = useGetCallerUserProfile();
  const { data: balance } = useGetBalance();
  const { data: isAdmin } = useIsCallerAdmin();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const getRoleLabel = (role: any) => {
    if (!role) return s.roleParticipante;
    if ('admin' in role) return s.roleOrganizador;
    if ('user' in role) return s.roleParticipante;
    return s.roleParticipante;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatBalance = (bal: bigint) => {
    return `R$ ${Number(bal).toFixed(2)}`;
  };

  return (
    <div className="min-h-full bg-background">
      <header className="border-b border-border bg-card p-4">
        <h1 className="text-2xl font-bold">{s.navPerfil}</h1>
      </header>

      <div className="space-y-4 p-4">
        {/* Profile Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-lg text-primary-foreground">
                  {profile ? getInitials(profile.name) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{profile?.name || 'Usuário'}</h2>
                <p className="text-sm text-muted-foreground">{profile?.email}</p>
                <Badge variant="secondary" className="mt-1">
                  {profile && getRoleLabel(profile.role)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wallet Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Wallet className="h-5 w-5" />
              {s.minhaCarteira}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-3">
              <p className="text-sm text-muted-foreground">{s.balance}</p>
              <p className="text-2xl font-bold">{formatBalance(balance || BigInt(0))}</p>
            </div>
            <Button variant="outline" className="w-full">
              Ver Transações
            </Button>
          </CardContent>
        </Card>

        {/* Admin Tools */}
        {isAdmin && (
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-5 w-5" />
                Ferramentas do Organizador
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Gerenciar Eventos
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Validar Ingressos
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Gerenciar Carteiras
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Logout */}
        <Button variant="destructive" className="w-full" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          {s.logout}
        </Button>

        {/* Principal ID (for debugging) */}
        {identity && (
          <Card>
            <CardContent className="pt-4">
              <p className="text-xs text-muted-foreground">Principal ID</p>
              <p className="break-all text-xs font-mono">{identity.getPrincipal().toString()}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
