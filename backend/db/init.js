import db from '../models/Certificate.js';

export const initDB = () => {
    return new Promise((resolve, reject) => {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS certificates (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                cert_id TEXT UNIQUE,
                student_name TEXT,
                institution TEXT,
                course TEXT,
                year INTEGER,
                marks TEXT,
                issue_date TEXT,
                image_hash TEXT
            )
        `;
        
        const createBlacklistTableQuery = `
            CREATE TABLE IF NOT EXISTS blacklist (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                cert_id TEXT UNIQUE,
                reason TEXT,
                flagged_by TEXT,
                flagged_at TEXT
            )
        `;

        const createUsersTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                full_name TEXT,
                email TEXT UNIQUE,
                password_hash TEXT,
                role TEXT DEFAULT 'user',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;
        const createAuditLogsTableQuery = `
            CREATE TABLE IF NOT EXISTS audit_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                certificate_id TEXT,
                verifier_ip TEXT,
                action TEXT,
                reason TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;
        
        db.run(createTableQuery, (err) => {
            if (err) {
                console.error('Error creating certificates table:', err);
                reject(err);
            } else {
                db.run(createBlacklistTableQuery, (err2) => {
                    if (err2) {
                        console.error('Error creating blacklist table:', err2);
                        reject(err2);
                    } else {
                        db.run(createUsersTableQuery, (err3) => {
                            if (err3) reject(err3);
                            else {
                                db.run(createAuditLogsTableQuery, (err4) => {
                                    if (err4) reject(err4);
                                    else {
                                        console.log('Database tables initialized.');
                                        resolve();
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    });
};
