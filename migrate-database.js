const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'database', 'university.db');

console.log('🔄 Starting database migration...\n');

// Open database
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('❌ Error opening database:', err.message);
        process.exit(1);
    }
    console.log('✅ Connected to database\n');
});

db.serialize(() => {
    // Create registrar table if it doesn't exist
    db.run(`
        CREATE TABLE IF NOT EXISTS registrars (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            full_name TEXT NOT NULL,
            department TEXT,
            phone TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('❌ Error creating registrars table:', err);
            process.exit(1);
        }
        console.log('✅ Registrars table created/verified');
    });

    // Create index
    db.run(`
        CREATE INDEX IF NOT EXISTS idx_registrar_email ON registrars(email)
    `, (err) => {
        if (err) {
            console.error('❌ Error creating index:', err);
        } else {
            console.log('✅ Index created/verified');
        }
    });

    // Check if registrar exists
    db.get('SELECT COUNT(*) as count FROM registrars', [], async (err, row) => {
        if (err) {
            console.error('❌ Error checking registrars:', err);
            process.exit(1);
        }

        if (row.count === 0) {
            console.log('\n📦 Adding registrar account...');
            
            const registrar = {
                email: 'registrar@krmangalam.edu.in',
                password: 'Registrar@123',
                full_name: 'Dr. Rajesh Kumar',
                department: 'Registrar Office',
                phone: '+91-9876543200'
            };

            try {
                const passwordHash = await bcrypt.hash(registrar.password, 10);
                
                db.run(`
                    INSERT INTO registrars 
                    (email, password_hash, full_name, department, phone)
                    VALUES (?, ?, ?, ?, ?)
                `, [
                    registrar.email,
                    passwordHash,
                    registrar.full_name,
                    registrar.department,
                    registrar.phone
                ], (err) => {
                    if (err) {
                        console.error('❌ Error inserting registrar:', err);
                        process.exit(1);
                    }
                    console.log('✅ Registrar account created successfully!');
                    console.log(`   Email: ${registrar.email}`);
                    console.log(`   Password: ${registrar.password}`);
                    
                    db.close((err) => {
                        if (err) {
                            console.error('Error closing database:', err.message);
                        } else {
                            console.log('\n✅ Migration complete!');
                            process.exit(0);
                        }
                    });
                });
            } catch (err) {
                console.error('❌ Error hashing password:', err);
                process.exit(1);
            }
        } else {
            console.log(`\n✅ Registrar account already exists (${row.count} registrars found)`);
            
            // Show existing registrar
            db.get('SELECT email, full_name FROM registrars', [], (err, registrar) => {
                if (!err && registrar) {
                    console.log(`   Email: ${registrar.email}`);
                    console.log(`   Name: ${registrar.full_name}`);
                }
                
                db.close((err) => {
                    if (err) {
                        console.error('Error closing database:', err.message);
                    } else {
                        console.log('\n✅ Migration complete!');
                        process.exit(0);
                    }
                });
            });
        }
    });
});

