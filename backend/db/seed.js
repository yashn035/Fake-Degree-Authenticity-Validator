import db from '../models/Certificate.js';

const seedData = [
    { certId: 'C001', name: 'Anjali Kumar', institution: 'Ranchi University', course: 'B.Sc', year: 2022, marks: '78%', issueDate: '2022-06-15' },
    { certId: 'C002', name: 'Rahul Singh', institution: 'BIT Mesra', course: 'B.Tech', year: 2021, marks: '82%', issueDate: '2021-07-20' },
    { certId: 'C003', name: 'Priya Sharma', institution: 'JNU', course: 'M.A.', year: 2020, marks: '74%', issueDate: '2020-05-10' },
    { certId: 'C004', name: 'Amit Verma', institution: 'IIT Kharagpur', course: 'B.Tech', year: 2023, marks: '89%', issueDate: '2023-06-01' },
    { certId: 'C005', name: 'Sneha Reddy', institution: 'Osmania University', course: 'B.Com', year: 2021, marks: '68%', issueDate: '2021-04-25' },
    { certId: 'C006', name: 'Vikram Patel', institution: 'Gujarat University', course: 'M.Sc', year: 2022, marks: '71%', issueDate: '2022-08-12' },
    { certId: 'C007', name: 'Neha Jain', institution: 'Delhi University', course: 'B.A.', year: 2020, marks: '65%', issueDate: '2020-07-01' },
    { certId: 'C008', name: 'Arjun Mehta', institution: 'VIT Vellore', course: 'B.Tech', year: 2022, marks: '85%', issueDate: '2022-05-15' },
    { certId: 'C009', name: 'Meera Iyer', institution: 'Anna University', course: 'M.E.', year: 2021, marks: '77%', issueDate: '2021-09-09' },
    { certId: 'C010', name: 'Rohan Das', institution: 'Calcutta University', course: 'B.Sc', year: 2023, marks: '80%', issueDate: '2023-03-20' },
    { certId: 'C011', name: 'Pooja Nair', institution: 'Kerala University', course: 'B.A.', year: 2022, marks: '69%', issueDate: '2022-11-11' },
    { certId: 'C012', name: 'Karan Joshi', institution: 'Punjab University', course: 'B.Com', year: 2021, marks: '73%', issueDate: '2021-12-01' },
    { certId: 'C013', name: 'Swati Gupta', institution: 'BHU', course: 'M.Sc', year: 2020, marks: '79%', issueDate: '2020-10-10' },
    { certId: 'C014', name: 'Deepak Kumar', institution: 'Patna University', course: 'B.Tech', year: 2022, marks: '81%', issueDate: '2022-07-07' },
    { certId: 'C015', name: 'Ritu Singh', institution: 'Jaipur University', course: 'B.Sc', year: 2023, marks: '76%', issueDate: '2023-01-15' }
];

export const seedDB = () => {
    return new Promise((resolve, reject) => {
        db.get('SELECT COUNT(*) AS count FROM certificates', (err, row) => {
            if (err) {
                console.error('Error checking DB:', err);
                return reject(err);
            }

            if (row.count === 0) {
                const insertStmt = db.prepare(`
                    INSERT INTO certificates (cert_id, student_name, institution, course, year, marks, issue_date) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `);
                
                seedData.forEach(cert => {
                    insertStmt.run([
                        cert.certId, cert.name, cert.institution, 
                        cert.course, cert.year, cert.marks, cert.issueDate
                    ]);
                });
                
                insertStmt.finalize((err) => {
                    if (err) reject(err);
                    else {
                        console.log('Mock certificates seeded successfully.');
                        
                        // Seed admin user
                        db.get('SELECT * FROM users WHERE email = ?', ['admin@jharkhand.gov.in'], async (err, row) => {
                            if (!row) {
                                const bcrypt = await import('bcryptjs');
                                const hash = await bcrypt.default.hash('Admin@123', 10);
                                db.run(
                                    'INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)',
                                    ['System Administrator', 'admin@jharkhand.gov.in', hash, 'admin'],
                                    (err) => {
                                        if (err) console.error('Error seeding admin user:', err);
                                        else console.log('Admin user seeded successfully.');
                                    }
                                );
                            }
                        });
                        resolve();
                    }
                });
            } else {
                console.log('Database already seeded.');
                resolve();
            }
        });
    });
};
