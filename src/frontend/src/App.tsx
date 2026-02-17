import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter, createRootRoute, createRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { RequireAuth } from './components/auth/RequireAuth';
import { ProfileSetupModal } from './components/auth/ProfileSetupModal';
import { AppShell } from './components/layout/AppShell';
import { InicioPage } from './pages/InicioPage';
import { ProgramacaoPage } from './pages/ProgramacaoPage';
import { MapaPage } from './pages/MapaPage';
import { IngressosPage } from './pages/IngressosPage';
import { PerfilPage } from './pages/PerfilPage';

const rootRoute = createRootRoute({
  component: () => (
    <RequireAuth>
      <ProfileSetupModal />
      <AppShell />
    </RequireAuth>
  ),
});

const inicioRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: InicioPage,
});

const programacaoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/programacao',
  component: ProgramacaoPage,
});

const mapaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/mapa',
  component: MapaPage,
});

const ingressosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ingressos',
  component: IngressosPage,
});

const perfilRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/perfil',
  component: PerfilPage,
});

const routeTree = rootRoute.addChildren([
  inicioRoute,
  programacaoRoute,
  mapaRoute,
  ingressosRoute,
  perfilRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
