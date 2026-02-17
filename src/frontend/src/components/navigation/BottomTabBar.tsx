import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useStrings } from '../../i18n/useStrings';
import { Home, Calendar, Map, Ticket, User } from 'lucide-react';

export function BottomTabBar() {
  const s = useStrings();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const tabs = [
    { path: '/', label: s.navInicio, icon: Home },
    { path: '/programacao', label: s.navProgramacao, icon: Calendar },
    { path: '/mapa', label: s.navMapa, icon: Map },
    { path: '/ingressos', label: s.navIngressos, icon: Ticket },
    { path: '/perfil', label: s.navPerfil, icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentPath === tab.path;
          
          return (
            <button
              key={tab.path}
              onClick={() => navigate({ to: tab.path })}
              className={`flex flex-1 flex-col items-center gap-1 py-2 transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
