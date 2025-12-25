import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { db, Assessment } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { RefreshCw, ArrowLeft, Calendar, Activity, Download, Printer } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import ThemeToggle from '@/components/ThemeToggle';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

const Dashboard = () => {
  const { toast } = useToast();
  const isOnline = useOnlineStatus();
  const { t } = useLanguage();
  const [isSyncing, setIsSyncing] = useState(false);
  const navigate = useNavigate();

  const assessments = useLiveQuery(
    () => db.assessments.orderBy('timestamp').toArray()
  );

  const unsyncedCount = assessments?.filter(a => !a.isSynced).length || 0;

  const handleSync = async () => {
    if (!isOnline) {
      toast({
        title: t('toast.offlineTitle'),
        description: t('toast.offlineDescription'),
        variant: 'destructive',
      });
      return;
    }

    setIsSyncing(true);
    try {
      const unsynced = await db.assessments.filter(a => !a.isSynced).toArray();

      if (unsynced.length === 0) {
        toast({
          title: t('toast.alreadySyncedTitle'),
          description: t('toast.alreadySyncedDescription'),
        });
        setIsSyncing(false);
        return;
      }

      for (const assessment of unsynced) {
        const { error } = await supabase.from('assessments').insert({
          id: assessment.id,
          risk_score: assessment.riskScore,
          risk_level: assessment.riskLevel,
          symptoms: {
            selected: assessment.symptoms,
            notes: assessment.notes ?? null,
          } as any,
          created_at: new Date(assessment.timestamp).toISOString(),
        } as any);

        if (!error) {
          await db.assessments.update(assessment.id, { isSynced: true });
        }
      }

      toast({
        title: t('toast.syncCompleteTitle'),
        description: t('toast.syncCompleteDescription'),
      });
    } catch (error) {
      toast({
        title: t('toast.syncFailedTitle'),
        description: t('toast.syncFailedDescription'),
        variant: 'destructive',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High':
        return 'text-destructive';
      case 'Medium':
        return 'text-primary';
      case 'Low':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  const riskDistribution = useMemo(() => {
    const base = { Low: 0, Medium: 0, High: 0 } as Record<'Low' | 'Medium' | 'High', number>;
    (assessments || []).forEach(a => {
      base[a.riskLevel] = (base[a.riskLevel] || 0) + 1;
    });
    return [
      { level: 'Low', count: base.Low },
      { level: 'Medium', count: base.Medium },
      { level: 'High', count: base.High },
    ];
  }, [assessments]);

  const symptomFrequency = useMemo(() => {
    const map: Record<string, number> = {};
    (assessments || []).forEach(a => {
      a.symptoms.forEach(id => {
        map[id] = (map[id] || 0) + 1;
      });
    });
    return Object.entries(map).map(([id, count]) => ({ symptom: id, count }));
  }, [assessments]);

  const riskTrend = useMemo(() => {
    const byDay: Record<string, { total: number; count: number }> = {};
    (assessments || []).forEach(a => {
      const date = new Date(a.timestamp).toLocaleDateString();
      if (!byDay[date]) byDay[date] = { total: 0, count: 0 };
      byDay[date].total += a.riskScore;
      byDay[date].count += 1;
    });
    return Object.entries(byDay)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([date, { total, count }]) => ({ date, score: total / count }));
  }, [assessments]);

  const riskChartConfig: ChartConfig = {
    Low: { label: 'Low', color: 'hsl(var(--chart-1))' },
    Medium: { label: 'Medium', color: 'hsl(var(--chart-2))' },
    High: { label: 'High', color: 'hsl(var(--chart-3))' },
  };

  const symptomChartConfig: ChartConfig = {
    count: { label: 'Count', color: 'hsl(var(--chart-4))' },
  };

  const trendChartConfig: ChartConfig = {
    score: { label: 'Risk score', color: 'hsl(var(--chart-5))' },
  };

  const handleExportCsv = () => {
    if (!assessments || assessments.length === 0) return;

    const header = ['id', 'timestamp', 'riskScore', 'riskLevel', 'symptoms', 'notes', 'isSynced'];
    const rows = assessments.map((a) => [
      a.id,
      new Date(a.timestamp).toISOString(),
      a.riskScore,
      a.riskLevel,
      a.symptoms.join('|'),
      a.notes ?? '',
      a.isSynced ? 'yes' : 'no',
    ]);

    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'maasathi-assessments.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full max-w-md sm:max-w-3xl lg:max-w-5xl mx-auto px-4 py-5 sm:p-6 space-y-5 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/">
              <Button variant="ghost" size="icon" className="-ml-1">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              {t('dashboard.title')}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-end">
            <ThemeToggle />
            <Button
              variant="outline"
              className="gap-2 print:hidden"
              onClick={() => window.print()}
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </Button>
            <Button
              variant="outline"
              className="gap-2 print:hidden"
              onClick={handleExportCsv}
              disabled={!assessments || assessments.length === 0}
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </Button>
            <Button
              onClick={handleSync}
              disabled={isSyncing || !isOnline || unsyncedCount === 0}
              className="gap-2 print:hidden"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{t('dashboard.sync')}</span>
              {unsyncedCount > 0 && <span className="text-xs sm:text-sm">({unsyncedCount})</span>}
            </Button>
          </div>
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
                  {isOnline ? t('dashboard.online') : t('dashboard.offline')}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Analytics */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            {t('dashboard.analytics')}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="p-4 col-span-1 lg:col-span-1">
              <h3 className="text-sm font-medium mb-2 text-foreground">{t('dashboard.riskDistribution')}</h3>
              <ChartContainer config={riskChartConfig} className="h-56">
                <BarChart data={riskDistribution}>
                  <CartesianGrid vertical={false} className="stroke-muted" />
                  <XAxis dataKey="level" tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" radius={4} />
                  <ChartLegend content={<ChartLegendContent />} />
                </BarChart>
              </ChartContainer>
            </Card>

            <Card className="p-4 col-span-1 lg:col-span-1">
              <h3 className="text-sm font-medium mb-2 text-foreground">{t('dashboard.symptomFrequency')}</h3>
              <ChartContainer config={symptomChartConfig} className="h-56">
                <BarChart data={symptomFrequency}>
                  <CartesianGrid vertical={false} className="stroke-muted" />
                  <XAxis dataKey="symptom" tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" radius={4} />
                </BarChart>
              </ChartContainer>
            </Card>

            <Card className="p-4 col-span-1 lg:col-span-1">
              <h3 className="text-sm font-medium mb-2 text-foreground">{t('dashboard.trend')}</h3>
              <ChartContainer config={trendChartConfig} className="h-56">
                <LineChart data={riskTrend}>
                  <CartesianGrid vertical={false} className="stroke-muted" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="score" strokeWidth={2} dot={false} />
                </LineChart>
              </ChartContainer>
            </Card>
          </div>
        </section>

        {/* Assessments List */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            {t('dashboard.history')}
          </h2>

          {!assessments || assessments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t('dashboard.empty')}</p>
              <Link to="/assess">
                <Button className="mt-4">{t('dashboard.startFirst')}</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {assessments
                .slice()
                .sort((a, b) => b.timestamp - a.timestamp)
                .map((assessment: Assessment) => (
                  <Card key={assessment.id} className="p-4 hover:bg-accent transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-lg font-semibold ${getRiskColor(assessment.riskLevel)}`}>
                            {assessment.riskLevel} Risk
                          </span>
                          {!assessment.isSynced && (
                            <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                              Unsynced
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Score: {assessment.riskScore} | Symptoms: {assessment.symptoms.length}
                        </p>
                        {assessment.notes && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            Notes: {assessment.notes}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {formatDate(assessment.timestamp)}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-col gap-2 sm:items-end w-full sm:w-auto">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full sm:w-auto"
                          onClick={() => navigate('/assess', { state: { reopenId: assessment.id } })}
                        >
                          Reopen
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full sm:w-auto"
                          onClick={() => navigate('/assess', { state: { followUpForId: assessment.id } })}
                        >
                          Follow-up
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="border border-border/60 self-end"
                          onClick={() => window.print()}
                          aria-label="Print assessment"
                        >
                          <Printer className="w-4 h-4" />
                        </Button>
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
