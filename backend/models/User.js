import db from './Certificate.js';
import bcrypt from 'bcryptjs';

export const User = {
    create: async (userData) => {
        const { fullName, email, password, role = 'user' } = userData;
        const passwordHash = await bcrypt.hash(password, 10);
        return new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO users (full_name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)',
                [fullName, email, passwordHash, role, new Date().toISOString()],
                function (err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID, fullName, email, role });
                }
            );
        });
    },

    findByEmail: (email) => {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }
};
