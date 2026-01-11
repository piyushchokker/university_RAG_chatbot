const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'university.db');

let db = null;

// Initialize database connection
function getDatabase() {
    if (!db) {
        db = new sqlite3.Database(DB_PATH, (err) => {
            if (err) {
                console.error('❌ Error opening database:', err.message);
            } else {
                console.log('✅ Connected to SQLite database');
            }
        });
    }
    return db;
}

// Initialize database schema
function initDatabase() {
    return new Promise((resolve, reject) => {
        const database = getDatabase();
        
        // Create students table
        database.serialize(() => {
            database.run(`
                CREATE TABLE IF NOT EXISTS students (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    student_id TEXT UNIQUE NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    full_name TEXT NOT NULL,
                    course TEXT,
                    year INTEGER,
                    phone TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err) {
                    console.error('Error creating students table:', err);
                    reject(err);
                    return;
                }
                console.log('✅ Students table created/verified');
            });

            // Create index on email for faster lookups
            database.run(`
                CREATE INDEX IF NOT EXISTS idx_email ON students(email)
            `, (err) => {
                if (err) {
                    console.error('Error creating email index:', err);
                }
            });

            // Create registrar table
            database.run(`
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
                    console.error('Error creating registrars table:', err);
                    reject(err);
                    return;
                }
                console.log('✅ Registrars table created/verified');
            });

            // Create index on registrar email
            database.run(`
                CREATE INDEX IF NOT EXISTS idx_registrar_email ON registrars(email)
            `, (err) => {
                if (err) {
                    console.error('Error creating registrar email index:', err);
                }
            });

            // Create documents table with hierarchical structure
            database.run(`
                CREATE TABLE IF NOT EXISTS documents (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    registrar_id INTEGER NOT NULL,
                    school TEXT NOT NULL,
                    course TEXT NOT NULL,
                    document_title TEXT NOT NULL,
                    document_type TEXT NOT NULL,
                    academic_year TEXT,
                    description TEXT,
                    filename TEXT NOT NULL,
                    original_filename TEXT NOT NULL,
                    file_path TEXT NOT NULL,
                    file_size INTEGER NOT NULL,
                    mime_type TEXT DEFAULT 'application/pdf',
                    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (registrar_id) REFERENCES registrars(id) ON DELETE CASCADE
                )
            `, (err) => {
                if (err) {
                    console.error('Error creating documents table:', err);
                    reject(err);
                    return;
                }
                console.log('✅ Documents table created/verified');
            });

            // Create indexes for fast retrieval by school and course
            database.run(`
                CREATE INDEX IF NOT EXISTS idx_documents_school ON documents(school)
            `, (err) => {
                if (err) {
                    console.error('Error creating school index:', err);
                }
            });

            database.run(`
                CREATE INDEX IF NOT EXISTS idx_documents_course ON documents(course)
            `, (err) => {
                if (err) {
                    console.error('Error creating course index:', err);
                }
            });

            database.run(`
                CREATE INDEX IF NOT EXISTS idx_documents_school_course ON documents(school, course)
            `, (err) => {
                if (err) {
                    console.error('Error creating school_course index:', err);
                }
            });

            database.run(`
                CREATE INDEX IF NOT EXISTS idx_documents_registrar ON documents(registrar_id)
            `, (err) => {
                if (err) {
                    console.error('Error creating registrar index:', err);
                }
            });

            // Check if we need to seed dummy data
            database.get('SELECT COUNT(*) as count FROM students', (err, studentRow) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                database.get('SELECT COUNT(*) as count FROM registrars', (err, registrarRow) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    
                    const promises = [];
                    
                    if (studentRow.count === 0) {
                        console.log('📦 Seeding database with dummy student data...');
                        promises.push(seedDummyData(database));
                    } else {
                        console.log(`✅ Database already has ${studentRow.count} students`);
                    }
                    
                    if (registrarRow.count === 0) {
                        console.log('📦 Seeding database with dummy registrar data...');
                        promises.push(seedRegistrarData(database));
                    } else {
                        console.log(`✅ Database already has ${registrarRow.count} registrars`);
                    }
                    
                    Promise.all(promises)
                        .then(() => {
                            console.log('✅ Database initialization complete');
                            resolve();
                        })
                        .catch(reject);
                });
            });
        });
    });
}

// Seed dummy student data
async function seedDummyData(database) {
    const dummyStudents = [
        {
            student_id: 'KR2024001',
            email: 'rahul.sharma@krmangalam.edu.in',
            password: 'Student@123',
            full_name: 'Rahul Sharma',
            course: 'B.Tech Computer Science',
            year: 3,
            phone: '+91-9876543210'
        },
        {
            student_id: 'KR2024002',
            email: 'priya.patel@krmangalam.edu.in',
            password: 'Student@123',
            full_name: 'Priya Patel',
            course: 'B.Tech Electronics',
            year: 2,
            phone: '+91-9876543211'
        },
        {
            student_id: 'KR2024003',
            email: 'amit.kumar@krmangalam.edu.in',
            password: 'Student@123',
            full_name: 'Amit Kumar',
            course: 'BBA',
            year: 1,
            phone: '+91-9876543212'
        },
        {
            student_id: 'KR2024004',
            email: 'sneha.gupta@krmangalam.edu.in',
            password: 'Student@123',
            full_name: 'Sneha Gupta',
            course: 'MBA',
            year: 2,
            phone: '+91-9876543213'
        },
        {
            student_id: 'KR2024005',
            email: 'vikram.singh@krmangalam.edu.in',
            password: 'Student@123',
            full_name: 'Vikram Singh',
            course: 'B.Tech Mechanical',
            year: 4,
            phone: '+91-9876543214'
        },
        {
            student_id: 'KR2024006',
            email: 'ananya.reddy@krmangalam.edu.in',
            password: 'Student@123',
            full_name: 'Ananya Reddy',
            course: 'B.Tech Civil',
            year: 2,
            phone: '+91-9876543215'
        },
        {
            student_id: 'KR2024007',
            email: 'rohan.malhotra@krmangalam.edu.in',
            password: 'Student@123',
            full_name: 'Rohan Malhotra',
            course: 'B.Com',
            year: 3,
            phone: '+91-9876543216'
        },
        {
            student_id: 'KR2024008',
            email: 'kavya.jain@krmangalam.edu.in',
            password: 'Student@123',
            full_name: 'Kavya Jain',
            course: 'B.Tech Computer Science',
            year: 1,
            phone: '+91-9876543217'
        }
    ];

    return new Promise((resolve, reject) => {
        const stmt = database.prepare(`
            INSERT INTO students 
            (student_id, email, password_hash, full_name, course, year, phone)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        let completed = 0;
        const total = dummyStudents.length;

        dummyStudents.forEach(async (student) => {
            try {
                const passwordHash = await bcrypt.hash(student.password, 10);
                stmt.run(
                    student.student_id,
                    student.email,
                    passwordHash,
                    student.full_name,
                    student.course,
                    student.year,
                    student.phone,
                    (err) => {
                        if (err) {
                            console.error(`Error inserting ${student.email}:`, err);
                        } else {
                            completed++;
                            if (completed === total) {
                                stmt.finalize();
                                resolve();
                            }
                        }
                    }
                );
            } catch (err) {
                console.error(`Error hashing password for ${student.email}:`, err);
                completed++;
                if (completed === total) {
                    stmt.finalize();
                    resolve();
                }
            }
        });
    });
}

// Seed dummy registrar data
async function seedRegistrarData(database) {
    const dummyRegistrars = [
        {
            email: 'registrar@krmangalam.edu.in',
            password: 'Registrar@123',
            full_name: 'Dr. Rajesh Kumar',
            department: 'Registrar Office',
            phone: '+91-9876543200'
        }
    ];

    return new Promise((resolve, reject) => {
        const stmt = database.prepare(`
            INSERT INTO registrars 
            (email, password_hash, full_name, department, phone)
            VALUES (?, ?, ?, ?, ?)
        `);

        let completed = 0;
        const total = dummyRegistrars.length;

        dummyRegistrars.forEach(async (registrar) => {
            try {
                const passwordHash = await bcrypt.hash(registrar.password, 10);
                stmt.run(
                    registrar.email,
                    passwordHash,
                    registrar.full_name,
                    registrar.department,
                    registrar.phone,
                    (err) => {
                        if (err) {
                            console.error(`Error inserting ${registrar.email}:`, err);
                        } else {
                            completed++;
                            if (completed === total) {
                                stmt.finalize();
                                resolve();
                            }
                        }
                    }
                );
            } catch (err) {
                console.error(`Error hashing password for ${registrar.email}:`, err);
                completed++;
                if (completed === total) {
                    stmt.finalize();
                    resolve();
                }
            }
        });
    });
}

// Get student by email
function getStudentByEmail(email) {
    return new Promise((resolve, reject) => {
        const database = getDatabase();
        database.get(
            'SELECT * FROM students WHERE email = ?',
            [email],
            (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            }
        );
    });
}

// Get student by ID
function getStudentById(id) {
    return new Promise((resolve, reject) => {
        const database = getDatabase();
        database.get(
            'SELECT id, student_id, email, full_name, course, year, phone, created_at FROM students WHERE id = ?',
            [id],
            (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            }
        );
    });
}

// Get registrar by email
function getRegistrarByEmail(email) {
    return new Promise((resolve, reject) => {
        const database = getDatabase();
        database.get(
            'SELECT * FROM registrars WHERE email = ?',
            [email],
            (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            }
        );
    });
}

// Get registrar by ID
function getRegistrarById(id) {
    return new Promise((resolve, reject) => {
        const database = getDatabase();
        database.get(
            'SELECT id, email, full_name, department, phone, created_at FROM registrars WHERE id = ?',
            [id],
            (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            }
        );
    });
}

// Close database connection
function closeDatabase() {
    if (db) {
        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err.message);
            } else {
                console.log('✅ Database connection closed');
            }
        });
    }
}

// Insert document
function insertDocument(documentData) {
    return new Promise((resolve, reject) => {
        const database = getDatabase();
        database.run(`
            INSERT INTO documents 
            (registrar_id, school, course, document_title, document_type, academic_year, description, filename, original_filename, file_path, file_size, mime_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            documentData.registrar_id,
            documentData.school,
            documentData.course,
            documentData.document_title,
            documentData.document_type,
            documentData.academic_year || null,
            documentData.description || null,
            documentData.filename,
            documentData.original_filename,
            documentData.file_path,
            documentData.file_size,
            documentData.mime_type || 'application/pdf'
        ], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

// Get all documents
function getAllDocuments(registrarId = null) {
    return new Promise((resolve, reject) => {
        const database = getDatabase();
        let query = 'SELECT * FROM documents';
        let params = [];
        
        if (registrarId) {
            query += ' WHERE registrar_id = ?';
            params.push(registrarId);
        }
        
        query += ' ORDER BY uploaded_at DESC';
        
        database.all(query, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// Get documents by school and course (for RAG retrieval)
function getDocumentsBySchoolAndCourse(school, course) {
    return new Promise((resolve, reject) => {
        const database = getDatabase();
        database.all(
            'SELECT * FROM documents WHERE school = ? AND course = ? ORDER BY uploaded_at DESC',
            [school, course],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            }
        );
    });
}

// Get documents from base repository (for general queries)
function getBaseDocuments(course = null) {
    return new Promise((resolve, reject) => {
        const database = getDatabase();
        let query = 'SELECT * FROM documents WHERE school = ?';
        let params = ['base'];
        
        if (course) {
            query += ' AND course = ?';
            params.push(course);
        }
        
        query += ' ORDER BY uploaded_at DESC';
        
        database.all(query, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// Get documents by school only
function getDocumentsBySchool(school) {
    return new Promise((resolve, reject) => {
        const database = getDatabase();
        database.all(
            'SELECT * FROM documents WHERE school = ? ORDER BY uploaded_at DESC',
            [school],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            }
        );
    });
}

// Get document by ID
function getDocumentById(id) {
    return new Promise((resolve, reject) => {
        const database = getDatabase();
        database.get(
            'SELECT * FROM documents WHERE id = ?',
            [id],
            (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            }
        );
    });
}

// Delete document
function deleteDocument(id, registrarId = null) {
    return new Promise((resolve, reject) => {
        const database = getDatabase();
        let query = 'DELETE FROM documents WHERE id = ?';
        let params = [id];
        
        if (registrarId) {
            query += ' AND registrar_id = ?';
            params.push(registrarId);
        }
        
        database.run(query, params, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes > 0);
            }
        });
    });
}

module.exports = {
    getDatabase,
    initDatabase,
    getStudentByEmail,
    getStudentById,
    getRegistrarByEmail,
    getRegistrarById,
    insertDocument,
    getAllDocuments,
    getDocumentsBySchoolAndCourse,
    getDocumentsBySchool,
    getBaseDocuments,
    getDocumentById,
    deleteDocument,
    closeDatabase
};
