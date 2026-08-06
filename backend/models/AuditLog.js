import db from './Certificate.js';

export const logAudit = (certId, ip, action, reason) => {
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO audit_logs (certificate_id, verifier_ip, action, reason) VALUES (?, ?, ?, ?)',
            [certId, ip, action, reason],
            function (err) {
                if (err) reject(err);
                else resolve(this.lastID);
            }
        );
    });
};

export const getAuditLogs = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100', (err, rows) => {
            if (err) reject(err);
            else resolve(rows || []);
        });
    });
};
