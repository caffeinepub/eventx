import { useStrings } from '../i18n/useStrings';
import { useGetUserTickets, useIsCallerAdmin } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Ticket, QrCode, Loader2 } from 'lucide-react';
import type { TicketStatus } from '../backend';

export function IngressosPage() {
  const s = useStrings();
  const { data: tickets = [], isLoading } = useGetUserTickets();
  const { data: isAdmin } = useIsCallerAdmin();

  const getStatusLabel = (status: TicketStatus) => {
    if ('active' in (status as any)) return 'Ativo';
    if ('used' in (status as any)) return 'Utilizado';
    if ('refunded' in (status as any)) return 'Reembolsado';
    if ('invalid' in (status as any)) return 'Inválido';
    return 'Desconhecido';
  };

  const getStatusVariant = (status: TicketStatus): 'default' | 'secondary' | 'destructive' => {
    if ('active' in (status as any)) return 'default';
    if ('used' in (status as any)) return 'secondary';
    return 'destructive';
  };

  const isActiveTicket = (status: TicketStatus): boolean => {
    return 'active' in (status as any);
  };

  return (
    <div className="min-h-full bg-background">
      <header className="border-b border-border bg-card p-4">
        <h1 className="text-2xl font-bold">{s.navIngressos}</h1>
      </header>

      <div className="space-y-4 p-4">
        {isAdmin && (
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <QrCode className="h-5 w-5" />
                {s.validarIngressos}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3 text-sm text-muted-foreground">
                Acesso exclusivo para organizadores validarem ingressos
              </p>
              <Button className="w-full">
                <QrCode className="mr-2 h-4 w-4" />
                Abrir Validador
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              {s.meusIngressos}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : tickets.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">{s.noTickets}</p>
            ) : (
              <div className="space-y-3">
                {tickets.map((ticket) => (
                  <div key={ticket.id.toString()} className="rounded-lg border border-border p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <p className="font-semibold">{ticket.event}</p>
                        <p className="text-sm text-muted-foreground">ID: {ticket.id.toString()}</p>
                      </div>
                      <Badge variant={getStatusVariant(ticket.status)}>
                        {getStatusLabel(ticket.status)}
                      </Badge>
                    </div>
                    {isActiveTicket(ticket.status) && (
                      <Button variant="outline" size="sm" className="w-full">
                        <QrCode className="mr-2 h-4 w-4" />
                        Ver QR Code
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
