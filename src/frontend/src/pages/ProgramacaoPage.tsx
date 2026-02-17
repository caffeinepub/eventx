import { useStrings } from '../i18n/useStrings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetFavorites, useAddFavorite, useRemoveFavorite } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Star, Music, Bike, Palette } from 'lucide-react';
import { toast } from 'sonner';

export function ProgramacaoPage() {
  const s = useStrings();
  const { data: favorites = [] } = useGetFavorites();
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  const isFavorite = (id: bigint) => favorites.some(f => f === id);

  const toggleFavorite = async (id: bigint) => {
    try {
      if (isFavorite(id)) {
        await removeFavorite.mutateAsync(id);
        toast.success('Removido da agenda');
      } else {
        await addFavorite.mutateAsync(id);
        toast.success('Adicionado à agenda');
      }
    } catch (error) {
      toast.error('Erro ao atualizar agenda');
    }
  };

  return (
    <div className="min-h-full bg-background">
      <header className="border-b border-border bg-card p-4">
        <h1 className="text-2xl font-bold">{s.navProgramacao}</h1>
      </header>

      <Tabs defaultValue="agenda" className="p-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="agenda">
            <Star className="mr-1 h-4 w-4" />
            Agenda
          </TabsTrigger>
          <TabsTrigger value="tattoo">
            <Palette className="mr-1 h-4 w-4" />
            Tattoo
          </TabsTrigger>
          <TabsTrigger value="moto">
            <Bike className="mr-1 h-4 w-4" />
            Moto
          </TabsTrigger>
          <TabsTrigger value="lineup">
            <Music className="mr-1 h-4 w-4" />
            Lineup
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agenda" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{s.minhaAgenda}</CardTitle>
            </CardHeader>
            <CardContent>
              {favorites.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground">{s.noFavorites}</p>
              ) : (
                <div className="space-y-2">
                  {favorites.map((id) => (
                    <div key={id.toString()} className="flex items-center justify-between rounded-lg border border-border p-3">
                      <div>
                        <p className="font-medium">Item {id.toString()}</p>
                        <p className="text-sm text-muted-foreground">Detalhes do evento</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleFavorite(id)}
                      >
                        <Star className="h-5 w-5 fill-primary text-primary" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tattoo" className="space-y-4">
          <Card className="overflow-hidden">
            <img 
              src="/assets/generated/eventx-tattoo-header.dim_1600x600.png" 
              alt={s.espacoTattoo}
              className="h-40 w-full object-cover"
            />
            <CardHeader>
              <CardTitle>{s.espacoTattoo}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Explore portfólios de artistas, solicite orçamentos e vote no concurso de tatuagem.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="moto" className="space-y-4">
          <Card className="overflow-hidden">
            <img 
              src="/assets/generated/eventx-moto-header.dim_1600x600.png" 
              alt={s.espacoMoto}
              className="h-40 w-full object-cover"
            />
            <CardHeader>
              <CardTitle>{s.espacoMoto}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Rotas de comboio, área de camping e estacionamento seguro para sua moto.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lineup" className="space-y-4">
          <Card className="overflow-hidden">
            <img 
              src="/assets/generated/eventx-lineup-header.dim_1600x600.png" 
              alt={s.lineupEPalcos}
              className="h-40 w-full object-cover"
            />
            <CardHeader>
              <CardTitle>{s.lineupEPalcos}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Confira a programação completa dos palcos e receba avisos de início dos shows.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
