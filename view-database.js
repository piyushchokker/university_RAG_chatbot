const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'database', 'university.db');

// Open database
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('❌ Error opening database:', err.message);
        process.exit(1);
    }
    console.log('✅ Connected to database\n');
});

// View all registrars
console.log('📋 REGISTRAR ACCOUNTS:');
console.log('='.repeat(60));
db.all('SELECT id, email, full_name, department, phone FROM registrars', [], (err, rows) => {
    if (err) {
        console.error('Error:', err.message);
    } else {
        if (rows.length === 0) {
            console.log('No registrars found in database.');
        } else {
            rows.forEach((row, index) => {
                console.log(`\n${index + 1}. Registrar Account:`);
                console.log(`   ID: ${row.id}`);
                console.log(`   Email: ${row.email}`);
                console.log(`   Name: ${row.full_name}`);
                console.log(`   Department: ${row.department}`);
                console.log(`   Phone: ${row.phone}`);
            });
        }
    }
    
    // Get password hash for testing
    db.get('SELECT email, password_hash FROM registrars WHERE email = ?', 
        ['registrar@krmangalam.edu.in'], 
        async (err, row) => {
            if (err) {
                console.error('Error:', err.message);
            } else if (row) {
                console.log('\n' + '='.repeat(60));
                console.log('🔐 PASSWORD VERIFICATION:');
                console.log('='.repeat(60));
                console.log(`Email: ${row.email}`);
                console.log(`Password Hash: ${row.password_hash.substring(0, 20)}...`);
                
                // Test password
                const testPassword = 'Registrar@123';
                const isValid = await bcrypt.compare(testPassword, row.password_hash);
                console.log(`\nTesting password: "${testPassword}"`);
                console.log(`Password valid: ${isValid ? '✅ YES' : '❌ NO'}`);
            } else {
                console.log('\n❌ Registrar account not found!');
            }
            
            // View students too
            console.log('\n' + '='.repeat(60));
            console.log('📋 STUDENT ACCOUNTS (first 3):');
            console.log('='.repeat(60));
            db.all('SELECT id, email, full_name, student_id FROM students LIMIT 3', [], (err, studentRows) => {
                if (err) {
                    console.error('Error:', err.message);
                } else {
                    studentRows.forEach((row, index) => {
                        console.log(`\n${index + 1}. ${row.full_name} (${row.student_id})`);
                        console.log(`   Email: ${row.email}`);
                    });
                }
                
                db.close((err) => {
                    if (err) {
                        console.error('Error closing database:', err.message);
                    } else {
                        console.log('\n✅ Database connection closed');
                        process.exit(0);
                    }
                });
            });
        }
    );
});

