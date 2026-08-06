import Tesseract from 'tesseract.js';

export async function extractText(imagePath) {
  try {
    const { data: { text } } = await Tesseract.recognize(imagePath, 'eng', {
      logger: m => console.log(m)
    });

    // Clean text
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    
    // Simple regex extraction (adjust based on your cert format)
    const name = lines.find(l => /name/i.test(l))?.replace(/name:?\s*/i, '').trim() || '';
    const certId = lines.find(l => /cert|id|number|c0/i.test(l))?.match(/C\d{3}/i)?.[0] || lines.find(l => /cert|id|number/i.test(l))?.replace(/cert(ificate)?\s*(id|no|number)?:?\s*/i, '').trim() || '';
    const institution = lines.find(l => /institution|college|university/i.test(l))?.replace(/institution|college|university:?\s*/i, '').trim() || '';
    const course = lines.find(l => /course|degree|program/i.test(l))?.replace(/course|degree|program:?\s*/i, '').trim() || '';
    const marks = lines.find(l => /marks|percentage|grade|%/.test(l))?.replace(/marks|percentage|grade:?\s*/i, '').trim() || lines.find(l => /%/.test(l))?.match(/\d{1,3}%/)?.[0] || '';
    const year = lines.find(l => /\b(20\d{2})\b/.test(l))?.match(/\b(20\d{2})\b/)?.[0] || '';

    return { name, certId, institution, course, marks, year };
  } catch (error) {
    console.error('OCR Error:', error);
    return null;
  }
}
