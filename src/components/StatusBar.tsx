import { Wifi, WifiOff } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export const StatusBar = () => {
  const isOnline = useOnlineStatus();

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg shadow-sm">
      {isOnline ? (
        <>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <Wifi className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Online</span>
        </>
      ) : (
        <>
          <div className="w-2 h-2 bg-muted rounded-full" />
          <WifiOff className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Offline Mode</span>
        </>
      )}
    </div>
  );
};
