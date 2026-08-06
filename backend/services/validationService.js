import { getCertificateById, getCertificatesByHash } from '../models/Certificate.js';
import { isBlacklisted } from '../models/Blacklist.js';

export function calculateFraudProbability(certData, dbMatch = true) {
  let score = 0;
  let factors = [];
  
  if (certData.marks && certData.marks.includes('%')) {
    const marks = parseInt(certData.marks);
    if (marks > 90) {
      score += 30;
      factors.push('Unusually high marks');
    }
  }
  
  const year = parseInt(certData.year);
  if (year > 2024) {
    score += 20;
    factors.push('Future date detected');
  }
  
  const fakeInstitutions = ['Unknown University', 'Online Degree', 'Distance Learning'];
  if (fakeInstitutions.includes(certData.institution)) {
    score += 20;
    factors.push('Unrecognized institution');
  }
  
  if (certData.student_name && certData.student_name.length < 3) {
    score += 15;
    factors.push('Suspicious name format');
  }
  
  if (!dbMatch) {
    score += 15;
    factors.push('Not found in database');
  }
  
  return {
    probability: Math.min(score, 100),
    riskLevel: score > 70 ? 'HIGH' : score > 40 ? 'MEDIUM' : 'LOW',
    factors: factors.slice(0, 3),
    timestamp: new Date().toISOString()
  };
}

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
        if (extracted.name || extracted.institution) {
            return { verdict: 'LEGACY_UNVERIFIED', message: 'Record not found in digital database, but document structure appears valid. Manual university verification recommended.', dbRecord: null, fraudPrediction: calculateFraudProbability(extracted, false) };
        }
        return { verdict: 'NOT_FOUND', message: 'Certificate ID not found in database', dbRecord: null, fraudPrediction: calculateFraudProbability(extracted, false) };
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

    if (mismatches.length > 0) {
        return { 
            verdict: 'TAMPERED', 
            matchedFields: matches, 
            mismatchedFields: mismatches, 
            hashMatch: hashMatch,
            dbRecord,
            fraudPrediction: calculateFraudProbability(extracted, true)
        };
    }

    if (hashMatch) {
        return {
            verdict: 'FLAGGED',
            matchedFields: matches,
            mismatchedFields: [],
            hashMatch: true,
            dbRecord,
            fraudPrediction: calculateFraudProbability(extracted, true)
        };
    }

    return { 
        verdict: 'VERIFIED', 
        matchedFields: matches, 
        mismatchedFields: [], 
        hashMatch: false,
        dbRecord,
        fraudPrediction: calculateFraudProbability(extracted, true)
    };
};
