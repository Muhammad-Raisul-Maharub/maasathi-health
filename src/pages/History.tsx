import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, Assessment } from "@/lib/db";
import PageLayout from "@/components/PageLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Cloud, CloudOff, History as HistoryIcon, AlertTriangle, Download, Eye, FileText, RefreshCw } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateMedicalReportPDF, generateBatchReportPDF } from "@/lib/pdfGenerator";
import { useToast } from "@/hooks/use-toast";

const HistoryPage = () => {
    const { t } = useLanguage();
    const { toast } = useToast();
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [previewAssessment, setPreviewAssessment] = useState<Assessment | null>(null);
    const [selectMode, setSelectMode] = useState(false);

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

    const toggleSelect = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedIds(newSet);
    };

    const selectAll = () => {
        if (assessments) {
            if (selectedIds.size === assessments.length) {
                setSelectedIds(new Set());
            } else {
                setSelectedIds(new Set(assessments.map(a => a.id)));
            }
        }
    };

    const handleExportSelected = () => {
        if (!assessments || selectedIds.size === 0) return;

        const selected = assessments.filter(a => selectedIds.has(a.id));

        if (selected.length === 1) {
            generateMedicalReportPDF(selected[0]);
            toast({ title: t('history.exported') || 'Exported', description: 'Medical report downloaded.' });
        } else {
            generateBatchReportPDF(selected);
            toast({ title: t('history.exported') || 'Exported', description: `${selected.length} assessments exported.` });
        }

        setSelectedIds(new Set());
        setSelectMode(false);
    };

    const handleExportSingle = (assessment: Assessment) => {
        generateMedicalReportPDF(assessment);
        toast({ title: t('history.exported') || 'Exported', description: 'Medical report downloaded.' });
    };

    const formatSymptom = (symptom: string) => {
        return symptom.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    };

    return (
        <PageLayout maxWidth="md">
            <div className="flex flex-col gap-4 h-[calc(100vh-8rem)]">
                <header className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                        <HistoryIcon className="w-6 h-6 text-primary" />
                        <h1 className="text-2xl font-bold text-foreground">{t('history.title') || 'My Health History'}</h1>
                    </div>

                    <div className="flex items-center gap-2">
                        {selectMode && selectedIds.size > 0 && (
                            <Button size="sm" onClick={handleExportSelected} className="gap-1.5">
                                <Download className="w-4 h-4" />
                                Export ({selectedIds.size})
                            </Button>
                        )}
                        <Button
                            variant={selectMode ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                                setSelectMode(!selectMode);
                                if (selectMode) setSelectedIds(new Set());
                            }}
                            className="gap-1.5"
                        >
                            <FileText className="w-4 h-4" />
                            {selectMode ? 'Cancel' : 'Select'}
                        </Button>
                    </div>
                </header>

                {selectMode && assessments && assessments.length > 0 && (
                    <div className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                        <Checkbox
                            checked={selectedIds.size === assessments.length}
                            onCheckedChange={selectAll}
                            id="select-all"
                        />
                        <label htmlFor="select-all" className="text-sm text-muted-foreground cursor-pointer">
                            Select All ({assessments.length})
                        </label>
                    </div>
                )}

                {!assessments || assessments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center flex-1 text-center p-8 bg-muted/20 rounded-xl border border-dashed text-muted-foreground">
                        <HistoryIcon className="w-12 h-12 mb-3 opacity-20" />
                        <p>{t('history.empty') || 'No health checkups yet.'}</p>
                        <p className="text-xs mt-1">Start a new checkup to track your health.</p>
                    </div>
                ) : (
                    <ScrollArea className="flex-1 -mx-4 px-4">
                        <div className="space-y-3 pb-20">
                            {assessments.map((item) => (
                                <Card
                                    key={item.id}
                                    className={`p-4 flex flex-col gap-3 relative overflow-hidden transition-all hover:shadow-md border-l-4 border-l-primary/50 ${selectedIds.has(item.id) ? 'ring-2 ring-primary bg-primary/5' : ''
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-start gap-3">
                                            {selectMode && (
                                                <Checkbox
                                                    checked={selectedIds.has(item.id)}
                                                    onCheckedChange={() => toggleSelect(item.id)}
                                                    className="mt-1"
                                                />
                                            )}
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">
                                                    {format(new Date(item.timestamp), "MMM d, yyyy • h:mm a")}
                                                </p>
                                                <div className="mt-1 flex items-center gap-2">
                                                    {getRiskBadge(item.riskLevel)}
                                                    <span className="text-xs text-muted-foreground">Score: {item.riskScore}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-2">
                                            {/* Sync Status */}
                                            {item.isSynced ? (
                                                <div className="flex items-center gap-1 text-[10px] text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full border border-green-100 dark:border-green-800">
                                                    <Cloud className="w-3 h-3" />
                                                    <span>Synced</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1 text-[10px] text-orange-600 bg-orange-50 dark:bg-orange-900/30 px-2 py-1 rounded-full border border-orange-100 dark:border-orange-800">
                                                    <CloudOff className="w-3 h-3" />
                                                    <span>On Device</span>
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            {!selectMode && (
                                                <div className="flex items-center gap-1.5">
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8"
                                                                onClick={() => setPreviewAssessment(item)}
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                                                            <DialogHeader>
                                                                <DialogTitle className="flex items-center gap-2">
                                                                    <HistoryIcon className="w-5 h-5 text-primary" />
                                                                    Assessment Details
                                                                </DialogTitle>
                                                            </DialogHeader>

                                                            {/* Preview Content */}
                                                            <div className="space-y-4">
                                                                {/* Date & Risk */}
                                                                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                                                    <div>
                                                                        <p className="text-sm text-muted-foreground">Date</p>
                                                                        <p className="font-medium">{format(new Date(item.timestamp), "MMM d, yyyy • h:mm a")}</p>
                                                                    </div>
                                                                    {getRiskBadge(item.riskLevel)}
                                                                </div>

                                                                {/* Risk Score */}
                                                                <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                                                                    <p className="text-4xl font-bold text-primary">{item.riskScore}</p>
                                                                    <p className="text-sm text-muted-foreground">Risk Score</p>
                                                                </div>

                                                                {/* Symptoms */}
                                                                <div>
                                                                    <h4 className="font-semibold text-sm mb-2">Reported Symptoms</h4>
                                                                    {item.symptoms.length === 0 ? (
                                                                        <p className="text-sm text-muted-foreground">No symptoms reported</p>
                                                                    ) : (
                                                                        <div className="flex flex-wrap gap-1.5">
                                                                            {item.symptoms.map((s, idx) => (
                                                                                <Badge key={idx} variant="secondary" className="text-xs">
                                                                                    {formatSymptom(s)}
                                                                                </Badge>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Notes */}
                                                                {item.notes && (
                                                                    <div>
                                                                        <h4 className="font-semibold text-sm mb-2">Clinical Notes</h4>
                                                                        <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                                                                            {item.notes}
                                                                        </p>
                                                                    </div>
                                                                )}

                                                                {/* Export Button */}
                                                                <Button
                                                                    className="w-full gap-2"
                                                                    onClick={() => handleExportSingle(item)}
                                                                >
                                                                    <Download className="w-4 h-4" />
                                                                    Export as PDF
                                                                </Button>
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => handleExportSingle(item)}
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </Button>
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
