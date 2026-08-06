import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../db/database.sqlite');
const db = new sqlite3.Database(dbPath);

export const getCertificateById = (certId) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM certificates WHERE cert_id = ?', [certId], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

export const getCertificatesByHash = (hash) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM certificates WHERE image_hash = ?', [hash], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

export default db;
