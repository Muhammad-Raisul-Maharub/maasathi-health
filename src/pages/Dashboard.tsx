import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { db, Assessment } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { RefreshCw, ArrowLeft, Calendar, Activity, Download, BarChart3, Stethoscope, History as HistoryIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';

import PageLayout from '@/components/PageLayout';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { SyncService } from '@/services/SyncService';

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
        title: `${t('toast.offlineTitle')} / আপনি অফলাইনে আছেন`,
        description: `${t('toast.offlineDescription')} / সিঙ্ক করতে ইন্টারনেট সংযোগ প্রয়োজন।`,
        variant: 'destructive',
      });
      return;
    }

    setIsSyncing(true);
    try {
      const syncedCount = await SyncService.syncData();

      if (syncedCount === 0) {
        toast({
          title: `${t('toast.alreadySyncedTitle')} / সব ডেটা আগে থেকেই সিঙ্ক হয়েছে`,
          description: `${t('toast.alreadySyncedDescription')} / নতুন করে পাঠানোর কিছু নেই।`,
        });
      } else {
        toast({
          title: `${t('toast.syncCompleteTitle')} / সিঙ্ক সম্পন্ন হয়েছে`,
          description: `${t('toast.syncCompleteDescription')} / ${syncedCount} টি রেকর্ড ক্লাউডে পাঠানো হয়েছে।`,
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast({
        title: `${t('toast.syncFailedTitle')} / সিঙ্ক করা যায়নি`,
        description: `${t('toast.syncFailedDescription')} / ${message}`,
        variant: 'destructive',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString(undefined, {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-destructive';
      case 'Medium': return 'text-orange-500';
      case 'Low': return 'text-green-500';
      default: return 'text-muted-foreground';
    }
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-destructive/10 border-destructive/20 text-destructive';
      case 'Medium': return 'bg-orange-500/10 border-orange-500/20 text-orange-600';
      case 'Low': return 'bg-green-500/10 border-green-500/20 text-green-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const riskDistribution = useMemo(() => {
    const base = { Low: 0, Medium: 0, High: 0 } as Record<'Low' | 'Medium' | 'High', number>;
    (assessments || []).forEach(a => {
      base[a.riskLevel] = (base[a.riskLevel] || 0) + 1;
    });
    return [
      { level: 'Low', count: base.Low, fill: 'var(--color-Low)' },
      { level: 'Medium', count: base.Medium, fill: 'var(--color-Medium)' },
      { level: 'High', count: base.High, fill: 'var(--color-High)' },
    ];
  }, [assessments]);

  const symptomFrequency = useMemo(() => {
    const map: Record<string, number> = {};
    (assessments || []).forEach(a => {
      a.symptoms.forEach(id => {
        // Beautify ID: 'abdominal_pain' -> 'Abdominal Pain'
        const label = id.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        map[label] = (map[label] || 0) + 1;
      });
    });
    return Object.entries(map)
      .map(([id, count]) => ({ symptom: id, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 only
  }, [assessments]);

  const riskTrend = useMemo(() => {
    const byDay: Record<string, { total: number; count: number }> = {};
    (assessments || []).forEach(a => {
      const date = new Date(a.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      if (!byDay[date]) byDay[date] = { total: 0, count: 0 };
      byDay[date].total += a.riskScore;
      byDay[date].count += 1;
    });
    return Object.entries(byDay)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime()) // This might need parsing if format changes, but okay for basic objects
      .slice(-7) // Last 7 unique days
      .map(([date, { total, count }]) => ({ date, score: Math.round((total / count) * 10) / 10 }));
  }, [assessments]);

  const riskChartConfig: ChartConfig = {
    Low: { label: 'Low', color: '#22c55e' },
    Medium: { label: 'Medium', color: '#f97316' },
    High: { label: 'High', color: '#ef4444' },
  };

  const symptomChartConfig: ChartConfig = {
    count: { label: 'Count', color: 'hsl(var(--primary))' },
  };

  const trendChartConfig: ChartConfig = {
    score: { label: 'Avg Score', color: 'hsl(var(--primary))' },
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

  const handleExportPdf = async () => {
    if (!assessments || assessments.length === 0) return;

    try {
      const { default: jsPDF } = await import('jspdf');
      const doc = new jsPDF();

      // Header
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.text('MaaSathi AI - Assessment Summary', 20, 20);

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated: ${new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      })}`, 20, 30);

      doc.setDrawColor(200, 200, 200);
      doc.line(20, 35, 190, 35);

      // Stats
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text('Summary Statistics', 20, 45);

      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      doc.text(`Total Assessments: ${assessments.length}`, 20, 55);
      doc.text(`High Risk: ${assessments.filter(a => a.riskLevel === 'High').length}`, 20, 62);
      doc.text(`Medium Risk: ${assessments.filter(a => a.riskLevel === 'Medium').length}`, 20, 69);
      doc.text(`Low Risk: ${assessments.filter(a => a.riskLevel === 'Low').length}`, 20, 76);

      // Assessment List
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text('Recent Assessments', 20, 90);

      let yPos = 100;
      const recentAssessments = assessments.slice(-10).reverse();

      recentAssessments.forEach((a, idx) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        const date = new Date(a.timestamp).toLocaleString();
        doc.text(`${idx + 1}. ${date} - ${a.riskLevel} Risk (Score: ${a.riskScore})`, 20, yPos);
        yPos += 7;
      });

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('Generated by MaaSathi AI - For healthcare professional use only.', 20, 285);

      doc.save(`MaaSathi_Summary_${new Date().toISOString().split('T')[0]}.pdf`);

      toast({
        title: 'PDF Exported',
        description: 'Assessment summary has been downloaded.',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Could not generate PDF. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <PageLayout maxWidth="full">
      <div className="space-y-6 animate-fade-in pb-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="-ml-2 hover-scale" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {t('dashboard.title')}
              </h1>
              <p className="text-sm text-muted-foreground">
                Overview of maternal health assessments
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 hover-scale"
              onClick={handleExportPdf}
              disabled={!assessments || assessments.length === 0}
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">{t('dashboard.export') || 'Export PDF'}</span>
            </Button>
            <Button
              size="sm"
              onClick={handleSync}
              disabled={isSyncing || !isOnline || unsyncedCount === 0}
              className={`gap-2 hover-scale shadow-md min-w-[120px] ${unsyncedCount > 0 ? 'animate-pulse' : ''}`}
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Cloud'}</span>
              {unsyncedCount > 0 && (
                <span className="ml-1 bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {unsyncedCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 flex items-center justify-between hover:shadow-md transition-all border-l-4 border-l-primary/50">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t('dashboard.total')}</p>
              <p className="text-3xl font-bold text-foreground mt-1">{assessments?.length || 0}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <Activity className="w-6 h-6 text-primary" />
            </div>
          </Card>

          <Card className="p-4 flex items-center justify-between hover:shadow-md transition-all border-l-4 border-l-orange-500/50">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t('dashboard.unsynced')}</p>
              <p className="text-3xl font-bold text-foreground mt-1">{unsyncedCount}</p>
            </div>
            <div className="p-3 bg-orange-500/10 rounded-full">
              <RefreshCw className="w-6 h-6 text-orange-600" />
            </div>
          </Card>

          <Card className="p-4 flex items-center justify-between hover:shadow-md transition-all border-l-4 border-l-green-500/50">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t('dashboard.status')}</p>
              <p className={`text-lg font-bold mt-1 ${isOnline ? 'text-green-600' : 'text-muted-foreground'}`}>
                {isOnline ? t('dashboard.online') : t('dashboard.offline')}
              </p>
            </div>
            <div className={`p-3 rounded-full ${isOnline ? 'bg-green-500/10' : 'bg-muted'}`}>
              <Calendar className={`w-6 h-6 ${isOnline ? 'text-green-600' : 'text-muted-foreground'}`} />
            </div>
          </Card>
        </div>

        {/* Analytics Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            {t('dashboard.analytics')}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* 1. Risk Distribution (Pie/Bar) */}
            <Card className="p-4 col-span-1 shadow-sm">
              <div className="mb-4">
                <h3 className="font-semibold text-foreground">{t('dashboard.riskDistribution')}</h3>
                <p className="text-xs text-muted-foreground">Assessments by risk level</p>
              </div>
              <ChartContainer config={riskChartConfig} className="h-[200px] w-full">
                <BarChart data={riskDistribution}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                  <XAxis
                    dataKey="level"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ChartContainer>
            </Card>

            {/* 2. Symptom Frequency (Horizontal Bar for better readability) */}
            <Card className="p-4 col-span-1 shadow-sm">
              <div className="mb-4">
                <h3 className="font-semibold text-foreground">{t('dashboard.symptomFrequency')}</h3>
                <p className="text-xs text-muted-foreground">Top reported symptoms</p>
              </div>
              <ChartContainer config={symptomChartConfig} className="h-[200px] w-full">
                <BarChart layout="vertical" data={symptomFrequency} margin={{ left: 0 }}>
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                  <YAxis
                    dataKey="symptom"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    width={100}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  />
                  <XAxis type="number" hide />
                  <ChartTooltip cursor={{ fill: 'transparent' }} content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ChartContainer>
            </Card>

            {/* 3. Trend Line */}
            <Card className="p-4 col-span-1 shadow-sm">
              <div className="mb-4">
                <h3 className="font-semibold text-foreground">{t('dashboard.trend')}</h3>
                <p className="text-xs text-muted-foreground">Risk scores over time</p>
              </div>
              <ChartContainer config={trendChartConfig} className="h-[200px] w-full">
                <LineChart data={riskTrend} margin={{ left: 10, right: 10 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                  />
                  <YAxis
                    hide
                    domain={[0, 'auto']}
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="var(--color-score)"
                    strokeWidth={3}
                    dot={{ fill: 'var(--color-score)', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ChartContainer>
            </Card>
          </div>
        </div>

        {/* Assessments List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <HistoryIcon className="w-5 h-5 text-primary" />
            {t('dashboard.history')}
          </h2>
          <Card className="divide-y divide-border shadow-sm">
            {!assessments || assessments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Stethoscope className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium text-foreground">{t('dashboard.empty')}</p>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-1">No assessments recorded yet. Start a new checkup to see data here.</p>
              </div>
            ) : (
              assessments
                .slice()
                .sort((a, b) => b.timestamp - a.timestamp)
                .map((assessment: Assessment) => (
                  <div key={assessment.id} className="p-4 hover:bg-muted/30 transition-colors flex flex-col sm:flex-row gap-4 sm:items-center justify-between group">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getRiskBadgeColor(assessment.riskLevel)}`}>
                          {assessment.riskLevel} Risk
                        </span>
                        {!assessment.isSynced && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium flex items-center gap-1">
                            <RefreshCw className="w-3 h-3" /> Unsynced
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-foreground">{assessment.riskScore}</span>
                        <span className="text-sm text-muted-foreground">risk score</span>
                      </div>

                      <div className="text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(assessment.timestamp)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5" />
                          {assessment.symptoms.length} symptoms
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 sm:flex-initial text-xs h-8"
                        onClick={() => navigate('/assess', { state: { reopenId: assessment.id } })}
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 sm:flex-initial text-xs h-8 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20"
                        onClick={() => navigate('/assess', { state: { followUpForId: assessment.id } })}
                      >
                        Follow Up
                      </Button>
                    </div>
                  </div>
                ))
            )}
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;


