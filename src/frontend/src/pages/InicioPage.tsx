import { useRef } from 'react';
import { useStrings } from '../i18n/useStrings';
import { AppMark } from '../components/branding/AppMark';
import { useGetAnnouncements } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Calendar, Image, Wallet, Bell } from 'lucide-react';
import { Footer } from '../components/branding/Footer';
import type { AnnouncementPriority } from '../backend';

export function InicioPage() {
  const s = useStrings();
  const { data: announcements = [] } = useGetAnnouncements();
  const announcementsRef = useRef<HTMLDivElement>(null);

  const getPriorityColor = (priority: AnnouncementPriority): 'default' | 'secondary' | 'destructive' => {
    if ('emergency' in (priority as any)) return 'destructive';
    if ('important' in (priority as any)) return 'default';
    return 'secondary';
  };

  const getPriorityLabel = (priority: AnnouncementPriority) => {
    if ('emergency' in (priority as any)) return s.emergency;
    if ('important' in (priority as any)) return s.important;
    return s.normal;
  };

  const scrollToAnnouncements = () => {
    announcementsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const hasAnnouncements = announcements.length > 0;

  return (
    <div className="min-h-full bg-background">
      <header className="border-b border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <AppMark />
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollToAnnouncements}
            className="relative"
            aria-label={s.verAvisos}
          >
            <Bell className="h-6 w-6" />
            {hasAnnouncements && (
              <span className="absolute right-1 top-1 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
            )}
          </Button>
        </div>
      </header>

      <div className="space-y-6 p-4">
        {/* Quick Access Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="cursor-pointer transition-colors hover:bg-accent">
            <CardContent className="flex flex-col items-center gap-2 p-4">
              <Calendar className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium">{s.minhaAgenda}</span>
            </CardContent>
          </Card>
          <Card className="cursor-pointer transition-colors hover:bg-accent">
            <CardContent className="flex flex-col items-center gap-2 p-4">
              <Image className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium">{s.muralDaGalera}</span>
            </CardContent>
          </Card>
          <Card className="cursor-pointer transition-colors hover:bg-accent">
            <CardContent className="flex flex-col items-center gap-2 p-4">
              <Wallet className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium">{s.minhaCarteira}</span>
            </CardContent>
          </Card>
          <Card className="cursor-pointer transition-colors hover:bg-accent" onClick={scrollToAnnouncements}>
            <CardContent className="flex flex-col items-center gap-2 p-4">
              <div className="relative">
                <AlertCircle className="h-8 w-8 text-primary" />
                {hasAnnouncements && (
                  <span className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {announcements.length > 9 ? '9+' : announcements.length}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium">{s.avisosImportantes}</span>
            </CardContent>
          </Card>
        </div>

        {/* Announcements */}
        <Card ref={announcementsRef} id="announcements-section">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              {s.avisosImportantes}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {announcements.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">{s.noAnnouncements}</p>
            ) : (
              <div className="space-y-3">
                {announcements.slice(0, 5).map((announcement) => (
                  <div key={announcement.id.toString()} className="space-y-1 border-b border-border pb-3 last:border-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold">{announcement.title}</h4>
                      <Badge variant={getPriorityColor(announcement.priority)}>
                        {getPriorityLabel(announcement.priority)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{announcement.message}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Module Cards */}
        <div className="space-y-3">
          <Card className="overflow-hidden">
            <img 
              src="/assets/generated/eventx-tattoo-header.dim_1600x600.png" 
              alt={s.espacoTattoo}
              className="h-32 w-full object-cover"
            />
            <CardContent className="p-4">
              <h3 className="text-lg font-bold">{s.espacoTattoo}</h3>
              <p className="text-sm text-muted-foreground">Artistas, portfólios e concurso</p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <img 
              src="/assets/generated/eventx-moto-header.dim_1600x600.png" 
              alt={s.espacoMoto}
              className="h-32 w-full object-cover"
            />
            <CardContent className="p-4">
              <h3 className="text-lg font-bold">{s.espacoMoto}</h3>
              <p className="text-sm text-muted-foreground">Rotas, camping e estacionamento</p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <img 
              src="/assets/generated/eventx-lineup-header.dim_1600x600.png" 
              alt={s.lineupEPalcos}
              className="h-32 w-full object-cover"
            />
            <CardContent className="p-4">
              <h3 className="text-lg font-bold">{s.lineupEPalcos}</h3>
              <p className="text-sm text-muted-foreground">Programação musical completa</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
