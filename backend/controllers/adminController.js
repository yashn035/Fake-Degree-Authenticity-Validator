// In-memory array for hackathon simplicity
const verificationLogs = [];

export const addVerificationLog = (log) => {
    verificationLogs.unshift(log); // Add to beginning
};

export const getVerifications = (req, res) => {
    res.json(verificationLogs);
};

export const getTrends = (req, res) => {
    const last7Days = Array.from({length: 7}, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();

    const initialCounts = {
        'VERIFIED': 0,
        'TAMPERED': 0,
        'NOT_FOUND': 0,
        'FLAGGED': 0
    };

    const trends = last7Days.map(date => {
        const dayLogs = verificationLogs.filter(log => log.timestamp.startsWith(date));
        const counts = { ...initialCounts };
        
        dayLogs.forEach(log => {
            if (counts[log.verdict] !== undefined) {
                counts[log.verdict]++;
            }
        });

        return {
            date,
            ...counts
        };
    });

    res.json(trends);
};

export const resetSystem = async (req, res) => {
    try {
        verificationLogs.length = 0; // Clear in-memory logs
        
        // Truncate DB and re-seed
        import('../models/Certificate.js').then(({ default: db }) => {
            db.run('DELETE FROM certificates', (err) => {
                if (err) throw err;
                // Re-seed
                import('../db/seed.js').then(({ seedDB }) => {
                    seedDB().then(() => {
                        res.json({ message: 'System reset successful. DB seeded and cache cleared.' });
                    });
                });
            });
        });
    } catch (error) {
        console.error('Reset error:', error);
        res.status(500).json({ error: 'Failed to reset system' });
    }
};

export const getVerificationById = (req, res) => {
    const { certId } = req.params;
    const log = verificationLogs.find(l => l.certId === certId);
    if (log) {
        res.json(log);
    } else {
        res.status(404).json({ error: 'Verification record not found' });
    }
};

export const getBlacklistEntries = async (req, res) => {
    try {
        const { getBlacklist } = await import('../models/Blacklist.js');
        const entries = await getBlacklist();
        res.json(entries);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch blacklist' });
    }
};

export const addBlacklistEntry = async (req, res) => {
    try {
        const { certId, reason } = req.body;
        const { addToBlacklist } = await import('../models/Blacklist.js');
        await addToBlacklist(certId, reason || 'Suspicious activity detected');
        res.json({ message: 'Added to blacklist' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add to blacklist' });
    }
};

export const removeBlacklistEntry = async (req, res) => {
    try {
        const { certId } = req.params;
        const { removeFromBlacklist } = await import('../models/Blacklist.js');
        await removeFromBlacklist(certId);
        res.json({ message: 'Removed from blacklist' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to remove from blacklist' });
    }
};

export const getAnalytics = (req, res) => {
    const total = verificationLogs.length;
    if (total === 0) {
        return res.json({
            totalVerifications: 0, verifiedCount: 0, tamperedCount: 0, notFoundCount: 0, flaggedCount: 0, blacklistedCount: 0,
            fraudRate: 0, fraudScore: 0, topInstitutions: [], dailyTrends: [], recentVerifications: [], institutionHeatmap: {}
        });
    }

    let verifiedCount = 0, tamperedCount = 0, notFoundCount = 0, flaggedCount = 0, blacklistedCount = 0;
    let totalFraudScore = 0;
    const instHeatmap = {};
    const uniqueOffenders = new Set();

    verificationLogs.forEach(log => {
        let score = 0;
        switch(log.verdict) {
            case 'VERIFIED': verifiedCount++; score = 20; break;
            case 'NOT_FOUND': notFoundCount++; score = 50; uniqueOffenders.add(log.certId); break;
            case 'TAMPERED': tamperedCount++; score = 70; uniqueOffenders.add(log.certId); break;
            case 'FLAGGED': flaggedCount++; score = 90; uniqueOffenders.add(log.certId); break;
            case 'BLACKLISTED': blacklistedCount++; score = 100; uniqueOffenders.add(log.certId); break;
        }
        totalFraudScore += score;
        
        // Populate institution heatmap for tampered/flagged/blacklisted
        if (['TAMPERED', 'FLAGGED', 'BLACKLISTED'].includes(log.verdict) && log.extractedData?.institution) {
            const inst = log.extractedData.institution;
            instHeatmap[inst] = (instHeatmap[inst] || 0) + 1;
        }
    });

    const fraudRate = ((tamperedCount + flaggedCount + blacklistedCount + notFoundCount) / total) * 100;
    const avgFraudScore = Math.round(totalFraudScore / total);

    const topInstitutions = Object.entries(instHeatmap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));

    // Leaderboard logic
    const authenticHeatmap = {};
    verificationLogs.forEach(log => {
        if (log.verdict === 'VERIFIED' && log.extractedData?.institution) {
            const inst = log.extractedData.institution;
            authenticHeatmap[inst] = (authenticHeatmap[inst] || 0) + 1;
        }
    });

    const topAuthentic = Object.entries(authenticHeatmap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name, count]) => ({ name, count }));

    const topOffenders = Object.entries(instHeatmap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name, count]) => ({ name, count }));
    
    const leaderboard = { verified: topAuthentic, offenders: topOffenders };

    // Generate daily trends
    const last30Days = Array.from({length: 30}, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();

    const dailyTrends = last30Days.map(date => {
        const dayLogs = verificationLogs.filter(log => log.timestamp.startsWith(date));
        const counts = { verified: 0, tampered: 0, notFound: 0, flagged: 0, blacklisted: 0 };
        dayLogs.forEach(l => {
            if(l.verdict==='VERIFIED') counts.verified++;
            else if(l.verdict==='TAMPERED') counts.tampered++;
            else if(l.verdict==='NOT_FOUND') counts.notFound++;
            else if(l.verdict==='FLAGGED') counts.flagged++;
            else if(l.verdict==='BLACKLISTED') counts.blacklisted++;
        });
        return { date, ...counts };
    });

    // Recent Suspicious Activity (Fraud Score > 50)
    const recentSuspicious = verificationLogs
        .filter(l => l.verdict !== 'VERIFIED')
        .slice(0, 10)
        .map(l => {
            let score = 50;
            if(l.verdict === 'TAMPERED') score = 70;
            if(l.verdict === 'FLAGGED') score = 90;
            if(l.verdict === 'BLACKLISTED') score = 100;
            return {
                certId: l.certId,
                institution: l.extractedData?.institution || 'Unknown',
                verdict: l.verdict,
                timestamp: l.timestamp,
                fraudScore: score
            };
        });

    res.json({
        totalVerifications: total,
        verifiedCount, tamperedCount, notFoundCount, flaggedCount, blacklistedCount,
        fraudRate: fraudRate.toFixed(1),
        fraudScore: avgFraudScore,
        uniqueOffenders: uniqueOffenders.size,
        topInstitutions,
        dailyTrends,
        recentVerifications: recentSuspicious,
        institutionHeatmap: instHeatmap,
        leaderboard
    });
};

export const bulkUpload = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        
        const csvText = req.file.buffer.toString('utf-8');
        const lines = csvText.split('\n').map(l => l.trim()).filter(l => l);
        if (lines.length < 2) return res.status(400).json({ error: 'CSV must contain headers and at least one row' });
        
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        // Expected headers: cert_id, student_name, institution, course, year, marks, issue_date
        const { default: db } = await import('../models/Certificate.js');
        
        let insertedCount = 0;
        let errorCount = 0;
        
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            const row = {};
            headers.forEach((h, idx) => row[h] = values[idx]);
            
            if (row.cert_id && row.student_name) {
                try {
                    await new Promise((resolve, reject) => {
                        db.run(
                            `INSERT INTO certificates (cert_id, student_name, institution, course, year, marks, issue_date) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                            [row.cert_id, row.student_name, row.institution, row.course, row.year, row.marks, row.issue_date],
                            (err) => {
                                if (err) reject(err);
                                else resolve();
                            }
                        );
                    });
                    insertedCount++;
                } catch (e) {
                    errorCount++; // Ignore duplicates or constraint failures silently
                }
            }
        }
        
        res.json({ message: `Bulk upload complete. Inserted: ${insertedCount}, Failed: ${errorCount}` });
    } catch (error) {
        console.error('Bulk upload error:', error);
        res.status(500).json({ error: 'Failed to process bulk upload' });
    }
};
