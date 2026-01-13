import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import PageLayout from "@/components/PageLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Cloud, CloudOff, History as HistoryIcon, AlertTriangle, CheckCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";

const HistoryPage = () => {
    const { t } = useLanguage();

    // Real-time query to Dexie DB
    const assessments = useLiveQuery(
        () => db.assessments.reverse().toArray()
    );

    const getRiskBadge = (level: string) => {
        switch (level) {
            case 'High':
                return <Badge variant="destructive" className="bg-red-500">High Risk</Badge>;
            case 'Medium':
                return <Badge variant="secondary" className="bg-orange-500 text-white">Medium Risk</Badge>;
            case 'Low':
                return <Badge variant="outline" className="border-green-500 text-green-600">Low Risk</Badge>;
            default:
                return <Badge variant="outline">Unknown</Badge>;
        }
    };

    return (
        <PageLayout maxWidth="md">
            <div className="flex flex-col gap-4 h-[calc(100vh-8rem)]">
                <header className="flex items-center gap-2 mb-2">
                    <HistoryIcon className="w-6 h-6 text-primary" />
                    <h1 className="text-2xl font-bold text-foreground">My Health History</h1>
                </header>

                {!assessments || assessments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center flex-1 text-center p-8 bg-muted/20 rounded-xl border border-dashed text-muted-foreground">
                        <HistoryIcon className="w-12 h-12 mb-3 opacity-20" />
                        <p>No health checkups yet.</p>
                        <p className="text-xs mt-1">Start a new checkup to track your health.</p>
                    </div>
                ) : (
                    <ScrollArea className="flex-1 -mx-4 px-4">
                        <div className="space-y-3 pb-20">
                            {assessments.map((item) => (
                                <Card key={item.id} className="p-4 flex flex-col gap-3 relative overflow-hidden transition-all hover:shadow-md border-l-4 border-l-primary/50">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                {format(new Date(item.timestamp), "MMM d, yyyy • h:mm a")}
                                            </p>
                                            <div className="mt-1 flex items-center gap-2">
                                                {getRiskBadge(item.riskLevel)}
                                                <span className="text-xs text-muted-foreground">Score: {item.riskScore}</span>
                                            </div>
                                        </div>

                                        {/* Sync Status Indicator */}
                                        <div className="flex flex-col items-end gap-1">
                                            {item.isSynced ? (
                                                <div className="flex items-center gap-1 text-[10px] text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                                                    <Cloud className="w-3 h-3" />
                                                    <span>Synced</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1 text-[10px] text-orange-600 bg-orange-50 px-2 py-1 rounded-full border border-orange-100">
                                                    <CloudOff className="w-3 h-3" />
                                                    <span>On Device</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Sync Warning if not synced */}
                                    {!item.isSynced && (
                                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground bg-muted/50 p-1.5 rounded-md">
                                            <AlertTriangle className="w-3 h-3 text-orange-500" />
                                            <span>Safely stored on this phone. Will sync when online.</span>
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </div>
        </PageLayout>
    );
};

export default HistoryPage;
