import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { db, Assessment } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { RefreshCw, ArrowLeft, Calendar, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';

const Dashboard = () => {
  const { toast } = useToast();
  const isOnline = useOnlineStatus();
  const { t } = useLanguage();
  const [isSyncing, setIsSyncing] = useState(false);

  const assessments = useLiveQuery(
    () => db.assessments.orderBy('timestamp').reverse().toArray()
  );

  const unsyncedCount = assessments?.filter(a => !a.isSynced).length || 0;

  const handleSync = async () => {
    if (!isOnline) {
      toast({
        title: "Offline Mode",
        description: "Cannot sync while offline. Connect to internet and try again.",
        variant: "destructive"
      });
      return;
    }

    setIsSyncing(true);
    try {
      const unsynced = await db.assessments.filter(a => !a.isSynced).toArray();
      
      if (unsynced.length === 0) {
        toast({
          title: "Already Synced",
          description: "All assessments are already synced to cloud.",
        });
        setIsSyncing(false);
        return;
      }

      for (const assessment of unsynced) {
        const { error } = await supabase.from('assessments').insert({
          id: assessment.id,
          risk_score: assessment.riskScore,
          risk_level: assessment.riskLevel,
          symptoms: assessment.symptoms as any,
          created_at: new Date(assessment.timestamp).toISOString()
        } as any);

        if (!error) {
          await db.assessments.update(assessment.id, { isSynced: true });
        }
      }

      toast({
        title: "Sync Complete",
        description: `Successfully synced ${unsynced.length} assessment(s) to cloud.`,
      });
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Failed to sync assessments. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High':
        return 'text-destructive';
      case 'Medium':
        return 'text-amber-500';
      case 'Low':
        return 'text-green-500';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-foreground">
              {t('dashboard.title')}
            </h1>
          </div>
          <Button
            onClick={handleSync}
            disabled={isSyncing || !isOnline || unsyncedCount === 0}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {t('dashboard.sync')} {unsyncedCount > 0 && `(${unsyncedCount})`}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">{t('dashboard.total')}</p>
                <p className="text-2xl font-bold text-foreground">{assessments?.length || 0}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">{t('dashboard.unsynced')}</p>
                <p className="text-2xl font-bold text-foreground">{unsyncedCount}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">{t('dashboard.status')}</p>
                <p className="text-lg font-semibold text-foreground">
                  {isOnline ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Assessments List */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Assessment History
          </h2>
          
          {!assessments || assessments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No assessments recorded yet.</p>
              <Link to="/assess">
                <Button className="mt-4">Start First Assessment</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {assessments.map((assessment) => (
                <Card key={assessment.id} className="p-4 hover:bg-accent transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-semibold ${getRiskColor(assessment.riskLevel)}`}>
                          {assessment.riskLevel} Risk
                        </span>
                        {!assessment.isSynced && (
                          <span className="text-xs bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 px-2 py-1 rounded">
                            Not Synced
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Score: {assessment.riskScore} | Symptoms: {assessment.symptoms.length}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(assessment.timestamp)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
