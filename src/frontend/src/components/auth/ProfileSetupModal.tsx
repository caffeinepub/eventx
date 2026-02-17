import { useState, useEffect } from 'react';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStrings } from '../../i18n/useStrings';
import { Loader2 } from 'lucide-react';
import type { UserProfile, UserRole } from '../../backend';

export function ProfileSetupModal() {
  const s = useStrings();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'user' | 'guest'>('user');
  const [cnpjCpf, setCnpjCpf] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  const showProfileSetup = isFetched && userProfile === null;

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name);
      setEmail(userProfile.email);
    }
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const profile: UserProfile = {
      name,
      email,
      role: { [role]: null } as any,
      interests: [],
      balance: BigInt(0),
      ...(role === 'admin' && cnpjCpf ? { cnpjCpf } : {}),
      ...(role === 'admin' && empresa ? { empresa } : {}),
      ...(role === 'user' && portfolioUrl ? { portfolioUrl } : {}),
    };

    await saveProfile.mutateAsync(profile);
  };

  if (profileLoading || !showProfileSetup) {
    return null;
  }

  return (
    <Dialog open={showProfileSetup}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{s.setupProfile}</DialogTitle>
          <DialogDescription>{s.setupProfileDesc}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{s.name}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder={s.namePlaceholder}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{s.email}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={s.emailPlaceholder}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">{s.role}</Label>
            <Select value={role} onValueChange={(v) => setRole(v as any)}>
              <SelectTrigger id="role">
                <SelectValue placeholder={s.selectRole} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">{s.roleOrganizador}</SelectItem>
                <SelectItem value="user">{s.roleExpositorArtista}</SelectItem>
                <SelectItem value="guest">{s.roleParticipante}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Organizador-specific fields */}
          {role === 'admin' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="cnpjCpf">{s.cnpjCpf}</Label>
                <Input
                  id="cnpjCpf"
                  value={cnpjCpf}
                  onChange={(e) => setCnpjCpf(e.target.value)}
                  placeholder={s.cnpjCpfPlaceholder}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="empresa">{s.empresa}</Label>
                <Input
                  id="empresa"
                  value={empresa}
                  onChange={(e) => setEmpresa(e.target.value)}
                  placeholder={s.empresaPlaceholder}
                />
              </div>
            </>
          )}

          {/* Expositor/Artista-specific fields */}
          {role === 'user' && (
            <div className="space-y-2">
              <Label htmlFor="portfolioUrl">{s.portfolioUrl}</Label>
              <Input
                id="portfolioUrl"
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder={s.portfolioUrlPlaceholder}
              />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={saveProfile.isPending}>
            {saveProfile.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {s.loading}
              </>
            ) : (
              s.save
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
