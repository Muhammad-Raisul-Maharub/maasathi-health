import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { db, Assessment } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { Stethoscope, BarChart3, History, Settings, Plus, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import PageLayout from '@/components/PageLayout';

const HealthWorkerHome = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const isOnline = useOnlineStatus();

    const assessments = useLiveQuery(
        () => db.assessments.orderBy('timestamp').reverse().limit(5).toArray()
    );

    const stats = useMemo(() => {
        if (!assessments) return { total: 0, high: 0, medium: 0, low: 0 };
        return {
            total: assessments.length,
            high: assessments.filter(a => a.riskLevel === 'High').length,
            medium: assessments.filter(a => a.riskLevel === 'Medium').length,
            low: assessments.filter(a => a.riskLevel === 'Low').length,
        };
    }, [assessments]);

    const getRiskIcon = (level: string) => {
        switch (level) {
            case 'High': return <AlertTriangle className="w-4 h-4 text-destructive" />;
            case 'Medium': return <AlertCircle className="w-4 h-4 text-orange-500" />;
            case 'Low': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
            default: return null;
        }
    };

    const formatTime = (timestamp: number) => {
        const now = Date.now();
        const diff = now - timestamp;
        const mins = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (mins < 60) return `${mins}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    return (
        <PageLayout maxWidth="lg">
            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold text-foreground">
                        {t('workerHome.welcome') || 'Welcome, Health Worker'}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {t('workerHome.subtitle') || 'Manage maternal health assessments efficiently'}
                    </p>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${isOnline ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                        <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                        {isOnline ? 'Online' : 'Offline'}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                    <Button
                        size="lg"
                        className="h-20 flex-col gap-2 text-sm font-semibold shadow-md"
                        onClick={() => navigate('/assess')}
                    >
                        <Plus className="w-6 h-6" />
                        New Assessment
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        className="h-20 flex-col gap-2 text-sm font-semibold"
                        onClick={() => navigate('/worker/analytics')}
                    >
                        <BarChart3 className="w-6 h-6" />
                        View Analytics
                    </Button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-2">
                    <Card className="p-3 text-center">
                        <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Total</p>
                    </Card>
                    <Card className="p-3 text-center border-l-2 border-l-destructive/50">
                        <p className="text-2xl font-bold text-destructive">{stats.high}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">High</p>
                    </Card>
                    <Card className="p-3 text-center border-l-2 border-l-orange-500/50">
                        <p className="text-2xl font-bold text-orange-500">{stats.medium}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Medium</p>
                    </Card>
                    <Card className="p-3 text-center border-l-2 border-l-green-500/50">
                        <p className="text-2xl font-bold text-green-500">{stats.low}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Low</p>
                    </Card>
                </div>

                {/* Recent Assessments */}
                <Card className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-foreground flex items-center gap-2">
                            <History className="w-4 h-4 text-primary" />
                            Recent Assessments
                        </h2>
                        <Button variant="ghost" size="sm" className="text-xs" onClick={() => navigate('/worker/analytics')}>
                            View All
                        </Button>
                    </div>

                    {!assessments || assessments.length === 0 ? (
                        <div className="text-center py-8">
                            <Stethoscope className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-50" />
                            <p className="text-sm text-muted-foreground">No assessments yet</p>
                            <Button size="sm" className="mt-3" onClick={() => navigate('/assess')}>
                                Start First Assessment
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {assessments.map((a) => (
                                <div
                                    key={a.id}
                                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                                    onClick={() => navigate('/assess', { state: { reopenId: a.id } })}
                                >
                                    <div className="flex items-center gap-3">
                                        {getRiskIcon(a.riskLevel)}
                                        <div>
                                            <p className="text-sm font-medium text-foreground">{a.riskLevel} Risk</p>
                                            <p className="text-xs text-muted-foreground">Score: {a.riskScore}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{formatTime(a.timestamp)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                {/* Quick Links */}
                <div className="grid grid-cols-2 gap-3">
                    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/settings')}>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-muted">
                                <Settings className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground">Settings</p>
                                <p className="text-xs text-muted-foreground">Theme, Language</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/help')}>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-muted">
                                <Stethoscope className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground">Help Guide</p>
                                <p className="text-xs text-muted-foreground">How to use</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </PageLayout>
    );
};

export default HealthWorkerHome;
