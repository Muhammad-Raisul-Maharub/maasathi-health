import { Wifi, WifiOff } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useLanguage } from '@/context/LanguageContext';

export const StatusBar = () => {
  const isOnline = useOnlineStatus();
  const { t } = useLanguage();

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-card rounded-full shadow-sm border border-border">
      {isOnline ? (
        <>
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <Wifi className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{t('status.online')}</span>
        </>
      ) : (
        <>
          <div className="w-2 h-2 rounded-full bg-muted-foreground/60" />
          <WifiOff className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">{t('status.offline')}</span>
        </>
      )}
    </div>
  );
};
