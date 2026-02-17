import { useStrings } from '../i18n/useStrings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Music, Utensils, Droplet, Palette } from 'lucide-react';

export function MapaPage() {
  const s = useStrings();

  const categories = [
    { id: 'palcos', label: s.palcos, icon: Music, color: 'bg-blue-500' },
    { id: 'estandes', label: s.estandes, icon: Palette, color: 'bg-purple-500' },
    { id: 'food', label: s.foodTrucks, icon: Utensils, color: 'bg-orange-500' },
    { id: 'banheiros', label: s.banheiros, icon: Droplet, color: 'bg-green-500' },
  ];

  return (
    <div className="min-h-full bg-background">
      <header className="border-b border-border bg-card p-4">
        <h1 className="text-2xl font-bold">{s.mapaDoEvento}</h1>
      </header>

      <div className="space-y-4 p-4">
        {/* Legend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Legenda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div key={cat.id} className="flex items-center gap-2">
                    <div className={`flex h-8 w-8 items-center justify-center rounded ${cat.color}`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">{cat.label}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Map Placeholder */}
        <Card>
          <CardContent className="p-0">
            <div className="relative aspect-square w-full bg-muted">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">Mapa interativo do evento</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Points of Interest */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pontos de Interesse</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-start gap-3 rounded-lg border border-border p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-500">
                  <Music className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Palco Principal</p>
                  <p className="text-sm text-muted-foreground">Shows principais do evento</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-border p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-purple-500">
                  <Palette className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Área de Tattoo</p>
                  <p className="text-sm text-muted-foreground">Estandes dos artistas</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
