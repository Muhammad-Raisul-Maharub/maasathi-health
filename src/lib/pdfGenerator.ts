import jsPDF from 'jspdf';
import { Assessment } from '@/lib/db';

// Colors matching EyeVLM style
const COLORS = {
    primary: [16, 185, 129] as [number, number, number],    // Teal/Green like EyeVLM
    danger: [239, 68, 68] as [number, number, number],       // Red
    warning: [249, 115, 22] as [number, number, number],     // Orange  
    success: [34, 197, 94] as [number, number, number],      // Green
    gray: [107, 114, 128] as [number, number, number],
    lightGray: [243, 244, 246] as [number, number, number],
    dark: [31, 41, 55] as [number, number, number],
    black: [0, 0, 0] as [number, number, number],
};

const getRiskColor = (level: string): [number, number, number] => {
    switch (level) {
        case 'High': return COLORS.danger;
        case 'Medium': return COLORS.warning;
        case 'Low': return COLORS.success;
        default: return COLORS.gray;
    }
};

const formatSymptom = (symptom: string): string => {
    return symptom.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

export const generateMedicalReportPDF = (assessment: Assessment): void => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    let yPos = 25;

    // ===== HEADER (Clean style like EyeVLM) =====
    // Title - Green/Teal color
    doc.setTextColor(...COLORS.primary);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('MaaSathi Medical Report', margin, yPos);

    // Generated date - Gray, right aligned
    doc.setTextColor(...COLORS.gray);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const dateStr = `Generated: ${new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: '2-digit', day: '2-digit'
    })}`;
    doc.text(dateStr, pageWidth - margin, yPos, { align: 'right' });

    yPos += 15;

    // ===== INFO BOX (Gray background with border) =====
    const infoBoxHeight = 70;
    doc.setFillColor(248, 250, 252); // Very light gray
    doc.setDrawColor(229, 231, 235); // Border gray
    doc.roundedRect(margin, yPos, contentWidth, infoBoxHeight, 2, 2, 'FD');

    yPos += 12;
    const labelX = margin + 10;
    const valueX = margin + 55;

    const infoItems = [
        { label: 'Assessment ID:', value: assessment.id.slice(0, 8).toUpperCase() },
        {
            label: 'Date:', value: new Date(assessment.timestamp).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            }) + ' - ' + new Date(assessment.timestamp).toLocaleTimeString('en-US', {
                hour: '2-digit', minute: '2-digit'
            })
        },
        { label: 'Total Score:', value: `${assessment.riskScore} points` },
        { label: 'Risk Level:', value: assessment.riskLevel },
        { label: 'Symptoms Count:', value: `${assessment.symptoms.length} reported` },
    ];

    infoItems.forEach((item) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(...COLORS.dark);
        doc.text(item.label, labelX, yPos);

        doc.setFont('helvetica', 'normal');
        doc.text(item.value, valueX, yPos);
        yPos += 11;
    });

    yPos += 15;

    // ===== AI ANALYSIS RESULT SECTION =====
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.black);
    doc.text('AI Analysis Result', margin, yPos);

    yPos += 15;

    // Prediction row
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.dark);
    doc.text('Risk Prediction:', margin + 5, yPos);

    // Risk Level with color
    const riskColor = getRiskColor(assessment.riskLevel);
    doc.setTextColor(...riskColor);
    doc.setFont('helvetica', 'bold');
    doc.text(`${assessment.riskLevel} Risk`, pageWidth - margin, yPos, { align: 'right' });

    yPos += 12;

    // Score row
    doc.setTextColor(...COLORS.dark);
    doc.setFont('helvetica', 'bold');
    doc.text('Risk Score:', margin + 5, yPos);

    doc.setTextColor(...COLORS.primary);
    doc.setFont('helvetica', 'bold');
    doc.text(`${assessment.riskScore}%`, pageWidth - margin, yPos, { align: 'right' });

    yPos += 25;

    // ===== CLINICAL CONTEXT SECTION =====
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.black);
    doc.text('Clinical Context', margin, yPos);

    yPos += 15;

    // Reported Symptoms
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.dark);
    doc.text('Reported Symptoms:', margin + 5, yPos);

    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.gray);

    if (assessment.symptoms.length === 0) {
        doc.text('No symptoms reported', margin + 10, yPos);
        yPos += 8;
    } else {
        assessment.symptoms.forEach((symptom) => {
            doc.text(`• ${formatSymptom(symptom)}`, margin + 10, yPos);
            yPos += 7;
            if (yPos > 260) {
                doc.addPage();
                yPos = 25;
            }
        });
    }

    yPos += 10;

    // Additional Notes
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.dark);
    doc.text('Additional Notes:', margin + 5, yPos);

    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.gray);

    if (assessment.notes) {
        const splitNotes = doc.splitTextToSize(assessment.notes, contentWidth - 15);
        doc.text(splitNotes, margin + 10, yPos);
    } else {
        doc.text('No additional notes', margin + 10, yPos);
    }

    // ===== FOOTER =====
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.gray);
    doc.text(
        'MaaSathi AI - Maternal Health Risk Detection',
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
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    let yPos = 25;

    // ===== HEADER =====
    doc.setTextColor(...COLORS.primary);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('MaaSathi Assessment Summary', margin, yPos);

    doc.setTextColor(...COLORS.gray);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const dateStr = `Generated: ${new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: '2-digit', day: '2-digit'
    })}`;
    doc.text(dateStr, pageWidth - margin, yPos, { align: 'right' });

    yPos += 15;

    // ===== STATISTICS BOX =====
    const stats = {
        total: assessments.length,
        high: assessments.filter(a => a.riskLevel === 'High').length,
        medium: assessments.filter(a => a.riskLevel === 'Medium').length,
        low: assessments.filter(a => a.riskLevel === 'Low').length,
    };

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(229, 231, 235);
    doc.roundedRect(margin, yPos, contentWidth, 35, 2, 2, 'FD');

    yPos += 15;

    const statPositions = [
        { label: 'Total', value: stats.total, x: margin + 25 },
        { label: 'High Risk', value: stats.high, x: margin + 70, color: COLORS.danger },
        { label: 'Medium Risk', value: stats.medium, x: margin + 115, color: COLORS.warning },
        { label: 'Low Risk', value: stats.low, x: margin + 155, color: COLORS.success },
    ];

    statPositions.forEach((stat) => {
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...(stat.color || COLORS.dark));
        doc.text(stat.value.toString(), stat.x, yPos, { align: 'center' });

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...COLORS.gray);
        doc.text(stat.label, stat.x, yPos + 10, { align: 'center' });
    });

    yPos += 40;

    // ===== ASSESSMENTS LIST =====
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.black);
    doc.text('Assessment Details', margin, yPos);

    yPos += 12;

    assessments.forEach((a, idx) => {
        if (yPos > 270) {
            doc.addPage();
            yPos = 25;
        }

        // Alternate row background
        if (idx % 2 === 0) {
            doc.setFillColor(248, 250, 252);
            doc.rect(margin, yPos - 5, contentWidth, 18, 'F');
        }

        // Risk badge
        const riskColor = getRiskColor(a.riskLevel);
        doc.setFillColor(...riskColor);
        doc.roundedRect(margin + 5, yPos - 4, 28, 10, 2, 2, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text(a.riskLevel, margin + 19, yPos + 2, { align: 'center' });

        // Date
        doc.setTextColor(...COLORS.dark);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        const dateFormatted = new Date(a.timestamp).toLocaleString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
        doc.text(dateFormatted, margin + 40, yPos + 2);

        // Score
        doc.setTextColor(...COLORS.primary);
        doc.setFont('helvetica', 'bold');
        doc.text(`Score: ${a.riskScore}`, pageWidth - margin - 5, yPos + 2, { align: 'right' });

        // Symptoms count
        doc.setTextColor(...COLORS.gray);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(`${a.symptoms.length} symptoms`, pageWidth - margin - 35, yPos + 2, { align: 'right' });

        yPos += 18;
    });

    // ===== FOOTER =====
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.gray);
    doc.text(
        'MaaSathi AI - Maternal Health Risk Detection',
        pageWidth / 2,
        285,
        { align: 'center' }
    );

    // Save
    const filename = `MaaSathi_Summary_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
};
