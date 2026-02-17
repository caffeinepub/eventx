import { Outlet } from '@tanstack/react-router';
import { BottomTabBar } from '../navigation/BottomTabBar';

export function AppShell() {
  return (
    <div className="flex h-screen flex-col bg-background">
      <main className="flex-1 overflow-y-auto pb-16">
        <Outlet />
      </main>
      <BottomTabBar />
    </div>
  );
}
