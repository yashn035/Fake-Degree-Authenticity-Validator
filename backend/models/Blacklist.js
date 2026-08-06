import db from './Certificate.js';

export const addToBlacklist = (certId, reason, flaggedBy = 'Admin') => {
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO blacklist (cert_id, reason, flagged_by, flagged_at) VALUES (?, ?, ?, ?)',
            [certId, reason, flaggedBy, new Date().toISOString()],
            function (err) {
                if (err) reject(err);
                else resolve(this.lastID);
            }
        );
    });
};

export const removeFromBlacklist = (certId) => {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM blacklist WHERE cert_id = ?', [certId], function (err) {
            if (err) reject(err);
            else resolve(this.changes);
        });
    });
};

export const getBlacklist = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM blacklist ORDER BY flagged_at DESC', (err, rows) => {
            if (err) reject(err);
            else resolve(rows || []);
        });
    });
};

export const isBlacklisted = (certId) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM blacklist WHERE cert_id = ?', [certId], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};
