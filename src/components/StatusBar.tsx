import { Wifi, WifiOff, Cloud, RefreshCw } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useLanguage } from '@/context/LanguageContext';
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";

export const StatusBar = () => {
  const isOnline = useOnlineStatus();
  const { t } = useLanguage();

  // Monitor unsynced count in real-time
  const unsyncedCount = useLiveQuery(
    () => db.assessments.where({ isSynced: 0 }).count()
  ) || 0;

  return (
    <div className="inline-flex items-center gap-3 px-3 py-1.5 bg-background/80 backdrop-blur-sm rounded-full shadow-sm border border-border text-xs transition-colors">

      {/* Network Status */}
      <div className="flex items-center gap-1.5">
        {isOnline ? (
          <>
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </div>
            <span className="font-medium text-foreground">{t('status.online')}</span>
          </>
        ) : (
          <>
            <div className="h-2 w-2 rounded-full bg-destructive/80" />
            <span className="font-medium text-muted-foreground">{t('status.offline')}</span>
          </>
        )}
      </div>

      <div className="w-px h-3 bg-border" />

      {/* Sync Status */}
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {unsyncedCount === 0 ? (
          <span className="flex items-center gap-1 text-green-600/80">
            <Cloud className="w-3 h-3" />
            <span className="hidden sm:inline">All Synced</span>
          </span>
        ) : (
          <span className="flex items-center gap-1 text-orange-500 font-medium">
            <RefreshCw className={`w-3 h-3 ${isOnline ? 'animate-spin' : ''}`} />
            <span>{unsyncedCount} Pending</span>
          </span>
        )}
      </div>

    </div>
  );
};
