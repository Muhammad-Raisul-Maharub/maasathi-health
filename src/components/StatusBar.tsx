import { Wifi, WifiOff } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useLanguage } from '@/context/LanguageContext';

export const StatusBar = () => {
  const isOnline = useOnlineStatus();
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg shadow-sm">
      {isOnline ? (
        <>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <Wifi className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{t('status.online')}</span>
        </>
      ) : (
        <>
          <div className="w-2 h-2 bg-muted rounded-full" />
          <WifiOff className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">{t('status.offline')}</span>
        </>
      )}
    </div>
  );
};
