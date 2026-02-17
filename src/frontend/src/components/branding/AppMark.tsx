import { useStrings } from '../../i18n/useStrings';

export function AppMark() {
  const s = useStrings();
  
  return (
    <div className="flex items-center gap-3">
      <img 
        src="/assets/generated/eventx-app-icon.dim_1024x1024.png" 
        alt={s.appName}
        className="h-10 w-10"
      />
      <h1 className="text-2xl font-bold tracking-tight">{s.appName}</h1>
    </div>
  );
}
