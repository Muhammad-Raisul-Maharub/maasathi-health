import jsPDF from 'jspdf';
import { Assessment } from '@/lib/db';

// Colors
const COLORS = {
    primary: [230, 126, 34] as [number, number, number],    // Orange
    primaryDark: [211, 84, 0] as [number, number, number],  // Dark Orange  
    success: [34, 197, 94] as [number, number, number],     // Green
    warning: [249, 115, 22] as [number, number, number],    // Orange
    danger: [239, 68, 68] as [number, number, number],      // Red
    gray: [107, 114, 128] as [number, number, number],
    lightGray: [243, 244, 246] as [number, number, number],
    dark: [31, 41, 55] as [number, number, number],
};

const getRiskColor = (level: string): [number, number, number] => {
    switch (level) {
        case 'High': return COLORS.danger;
        case 'Medium': return COLORS.warning;
        case 'Low': return COLORS.success;
        default: return COLORS.gray;
    }
};

export const generateMedicalReportPDF = (assessment: Assessment): void => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // ===== HEADER =====
    doc.setFillColor(...COLORS.primary);
    doc.rect(0, 0, pageWidth, 35, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('MaaSathi Medical Report', 20, 22);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const dateStr = `Generated: ${new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    })}`;
    doc.text(dateStr, pageWidth - 20, 22, { align: 'right' });

    // ===== PATIENT INFO BOX =====
    doc.setDrawColor(...COLORS.lightGray);
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(15, 45, pageWidth - 30, 50, 3, 3, 'FD');

    doc.setTextColor(...COLORS.dark);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');

    const infoLabels = [
        { label: 'Assessment ID:', value: assessment.id.slice(0, 8).toUpperCase() },
        { label: 'Date:', value: new Date(assessment.timestamp).toLocaleString() },
        { label: 'Risk Score:', value: assessment.riskScore.toString() },
        { label: 'Risk Level:', value: assessment.riskLevel },
    ];

    let yPos = 58;
    infoLabels.forEach((item) => {
        doc.setFont('helvetica', 'bold');
        doc.text(item.label, 25, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(item.value, 80, yPos);
        yPos += 10;
    });

    // ===== RISK ASSESSMENT SECTION =====
    yPos = 110;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.dark);
    doc.text('Risk Assessment Result', 20, yPos);

    yPos += 15;

    // Risk Level Badge
    const riskColor = getRiskColor(assessment.riskLevel);
    doc.setFillColor(...riskColor);
    doc.roundedRect(20, yPos - 8, 60, 14, 3, 3, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`${assessment.riskLevel} Risk`, 50, yPos, { align: 'center' });

    // Risk Score
    doc.setTextColor(...COLORS.dark);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text(assessment.riskScore.toString(), 110, yPos + 3);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.gray);
    doc.text('Risk Score', 110, yPos + 12);

    // ===== SYMPTOMS SECTION =====
    yPos += 35;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.dark);
    doc.text('Reported Symptoms', 20, yPos);

    yPos += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.gray);

    if (assessment.symptoms.length === 0) {
        doc.text('• No symptoms reported', 25, yPos);
    } else {
        assessment.symptoms.forEach((symptom) => {
            // Format symptom: 'headache_severe' -> 'Headache Severe'
            const formatted = symptom.split('_').map(w =>
                w.charAt(0).toUpperCase() + w.slice(1)
            ).join(' ');
            doc.text(`• ${formatted}`, 25, yPos);
            yPos += 7;
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }
        });
    }

    // ===== NOTES SECTION =====
    if (assessment.notes) {
        yPos += 10;
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...COLORS.dark);
        doc.text('Clinical Notes', 20, yPos);

        yPos += 10;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...COLORS.gray);
        const splitNotes = doc.splitTextToSize(assessment.notes, pageWidth - 50);
        doc.text(splitNotes, 20, yPos);
    }

    // ===== FOOTER =====
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.gray);
    doc.text(
        'MaaSathi AI - Maternal Health Risk Detection Tool',
        pageWidth / 2,
        285,
        { align: 'center' }
    );
    doc.text(
        'This report is for informational purposes only. Consult a healthcare professional.',
        pageWidth / 2,
        290,
        { align: 'center' }
    );

    // Save
    const filename = `MaaSathi_Report_${assessment.id.slice(0, 8)}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
};

export const generateBatchReportPDF = (assessments: Assessment[]): void => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // ===== HEADER =====
    doc.setFillColor(...COLORS.primary);
    doc.rect(0, 0, pageWidth, 35, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('MaaSathi Assessment Summary', 20, 22);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const dateStr = `Generated: ${new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    })}`;
    doc.text(dateStr, pageWidth - 20, 22, { align: 'right' });

    // ===== STATISTICS BOX =====
    doc.setDrawColor(...COLORS.lightGray);
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(15, 45, pageWidth - 30, 35, 3, 3, 'FD');

    const stats = {
        total: assessments.length,
        high: assessments.filter(a => a.riskLevel === 'High').length,
        medium: assessments.filter(a => a.riskLevel === 'Medium').length,
        low: assessments.filter(a => a.riskLevel === 'Low').length,
    };

    doc.setTextColor(...COLORS.dark);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');

    const statX = [35, 85, 135, 175];
    doc.text(`${stats.total}`, statX[0], 62);
    doc.text(`${stats.high}`, statX[1], 62);
    doc.text(`${stats.medium}`, statX[2], 62);
    doc.text(`${stats.low}`, statX[3], 62);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.gray);
    doc.text('Total', statX[0], 72);
    doc.text('High Risk', statX[1], 72);
    doc.text('Medium Risk', statX[2], 72);
    doc.text('Low Risk', statX[3], 72);

    // ===== ASSESSMENTS LIST =====
    let yPos = 95;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.dark);
    doc.text('Selected Assessments', 20, yPos);

    yPos += 10;

    assessments.forEach((a, idx) => {
        if (yPos > 270) {
            doc.addPage();
            yPos = 20;
        }

        // Assessment row background
        if (idx % 2 === 0) {
            doc.setFillColor(248, 248, 248);
            doc.rect(15, yPos - 5, pageWidth - 30, 12, 'F');
        }

        // Risk badge
        const riskColor = getRiskColor(a.riskLevel);
        doc.setFillColor(...riskColor);
        doc.roundedRect(20, yPos - 4, 35, 8, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text(`${a.riskLevel}`, 37.5, yPos + 1, { align: 'center' });

        // Date and score
        doc.setTextColor(...COLORS.dark);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        const dateFormatted = new Date(a.timestamp).toLocaleString(undefined, {
            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
        doc.text(dateFormatted, 60, yPos + 1);
        doc.text(`Score: ${a.riskScore}`, pageWidth - 35, yPos + 1);

        yPos += 14;
    });

    // ===== FOOTER =====
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.gray);
    doc.text(
        'MaaSathi AI - Maternal Health Risk Detection Tool',
        pageWidth / 2,
        285,
        { align: 'center' }
    );

    // Save
    const filename = `MaaSathi_Summary_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
};
