import QRCode from 'qrcode';

export const generateQR = async (certId, baseUrl) => {
    try {
        const url = `${baseUrl}/?certId=${certId}`;
        const qrCodeDataUrl = await QRCode.toDataURL(url);
        return qrCodeDataUrl; // Returns base64 PNG
    } catch (err) {
        console.error('QR Gen Error:', err);
        return null;
    }
};
