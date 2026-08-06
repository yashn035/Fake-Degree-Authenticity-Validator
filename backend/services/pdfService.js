import { PDFDocument, rgb } from 'pdf-lib';

export const generateVerificationReport = async (verificationData) => {
    const pdfDoc = await PDFDocument.create();
    
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const { width, height } = page.getSize();
    
    // Header
    page.drawText('Government of Jharkhand - Authenticity Validator', {
        x: 50,
        y: height - 50,
        size: 20,
        color: rgb(0.1, 0.2, 0.5),
    });
    
    // Verdict Badge
    const verdict = verificationData.verdict;
    let badgeColor = rgb(0.5, 0.5, 0.5);
    if (verdict === 'VERIFIED') badgeColor = rgb(0.1, 0.6, 0.1);
    else if (verdict === 'TAMPERED' || verdict === 'BLACKLISTED') badgeColor = rgb(0.8, 0.1, 0.1);
    else if (verdict === 'FLAGGED') badgeColor = rgb(0.8, 0.6, 0.1);
    
    page.drawText(`STATUS: ${verdict}`, {
        x: 50,
        y: height - 100,
        size: 24,
        color: badgeColor,
    });
    
    // Details
    let y = height - 150;
    const drawLine = (label, value) => {
        page.drawText(`${label}: ${value || 'N/A'}`, { x: 50, y, size: 12 });
        y -= 25;
    };
    
    const cert = verificationData.dbRecord || verificationData.extractedData || {};
    drawLine('Report ID', crypto.randomUUID());
    drawLine('Timestamp', new Date().toISOString());
    drawLine('Certificate ID', cert.cert_id || cert.certId);
    drawLine('Student Name', cert.student_name || cert.name);
    drawLine('Institution', cert.institution);
    drawLine('Course', cert.course);
    drawLine('Marks', cert.marks);
    
    if (verificationData.mismatchedFields?.length > 0) {
        y -= 20;
        page.drawText('Mismatched Fields Detected:', { x: 50, y, size: 14, color: rgb(0.8, 0.1, 0.1) });
        y -= 20;
        verificationData.mismatchedFields.forEach(field => {
            page.drawText(`- ${field.field} (Expected: ${field.expected}, Found: ${field.found})`, { x: 60, y, size: 10 });
            y -= 15;
        });
    }

    if (verificationData.qrCodeImage) {
        // Embed QR code at the bottom right
        const qrImage = await pdfDoc.embedPng(verificationData.qrCodeImage);
        page.drawImage(qrImage, {
            x: width - 150,
            y: 50,
            width: 100,
            height: 100,
        });
    }

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
};
