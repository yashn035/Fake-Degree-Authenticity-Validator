import { getCertificateById, getCertificatesByHash } from '../models/Certificate.js';
import { isBlacklisted } from '../models/Blacklist.js';

export const validateCertificate = async (extracted, imgHash) => {
    const { certId } = extracted;
    
    if (!certId) {
        return { verdict: 'NOT_FOUND', message: 'Could not extract Certificate ID' };
    }

    const blacklisted = await isBlacklisted(certId);
    if (blacklisted) {
        return { verdict: 'BLACKLISTED', reason: blacklisted.reason, message: 'This certificate has been flagged as fraudulent.', dbRecord: null };
    }

    const dbRecord = await getCertificateById(certId);
    
    if (!dbRecord) {
        return { verdict: 'NOT_FOUND', message: 'Certificate ID not found in database', dbRecord: null };
    }

    // Check for duplicate uploads (Flagged)
    let hashMatch = false;
    if (dbRecord.image_hash && dbRecord.image_hash === imgHash) {
        hashMatch = true;
    }

    const mismatches = [];
    const matches = [];

    // Fields to validate
    const fields = ['name', 'institution', 'course', 'marks', 'year'];
    
    fields.forEach(field => {
        // Handle database column names that differ from extracted names
        const dbField = field === 'name' ? 'student_name' : field;
        
        const extVal = (extracted[field] || '').toString().toLowerCase().trim();
        const dbVal = (dbRecord[dbField] || '').toString().toLowerCase().trim();
        
        // If extracted value is not empty and matches
        if (extVal && dbVal && (extVal.includes(dbVal) || dbVal.includes(extVal))) {
            matches.push(field);
        } else if (extVal) {
            mismatches.push({ field, expected: dbVal, found: extVal });
        }
    });

    if (hashMatch) {
        return {
            verdict: 'FLAGGED',
            matchedFields: matches,
            mismatchedFields: mismatches,
            hashMatch: true,
            dbRecord
        };
    }

    if (mismatches.length === 0) {
        return { 
            verdict: 'VERIFIED', 
            matchedFields: matches, 
            mismatchedFields: [], 
            hashMatch: false,
            dbRecord 
        };
    } else {
        return { 
            verdict: 'TAMPERED', 
            matchedFields: matches, 
            mismatchedFields: mismatches, 
            hashMatch: false,
            dbRecord 
        };
    }
};
