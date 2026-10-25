import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'thrifthub.sqlite');

let db: Database | null = null;

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

export function saveDatabase() {
  if (!db) return;
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  } catch (err) {
    console.error('Failed to save database to disk:', err);
  }
}

export async function getDb(): Promise<Database> {
  if (db) return db;

  const SQL = await initSqlJs();

  // If DB exists, load and check version/schema
  if (fs.existsSync(DB_PATH)) {
    try {
      const fileBuffer = fs.readFileSync(DB_PATH);
      db = new SQL.Database(fileBuffer);
    } catch (err) {
      db = new SQL.Database();
    }
  } else {
    db = new SQL.Database();
  }

  initSchema(db);

  // Check if Shriya is already present
  const checkShriya = db.exec("SELECT COUNT(*) FROM users WHERE email = 'shriya@thrifthub.in'");
  const hasShriya = (checkShriya[0]?.values[0]?.[0] as number) > 0;

  if (!hasShriya) {
    console.log('Refreshing database with Anna University curriculum and demo user Shriya...');
    // Clear old tables for fresh Anna University dataset
    db.run(`
      DROP TABLE IF EXISTS request_history;
      DROP TABLE IF EXISTS requests;
      DROP TABLE IF EXISTS resources;
      DROP TABLE IF EXISTS notifications;
      DROP TABLE IF EXISTS audit_logs;
      DROP TABLE IF EXISTS users;
    `);
    initSchema(db);
    await seedAnnaUniversityData(db);
    saveDatabase();
  }

  return db;
}

function initSchema(database: Database) {
  database.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'student',
      college_id TEXT,
      branch TEXT,
      year TEXT,
      phone TEXT,
      bio TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS resources (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      subject TEXT NOT NULL,
      semester TEXT NOT NULL,
      author_or_brand TEXT NOT NULL,
      price REAL NOT NULL,
      condition TEXT NOT NULL,
      description TEXT NOT NULL,
      image_url TEXT,
      availability TEXT NOT NULL DEFAULT 'Available',
      seller_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS requests (
      id TEXT PRIMARY KEY,
      resource_id TEXT NOT NULL,
      buyer_id TEXT NOT NULL,
      seller_id TEXT NOT NULL,
      message TEXT,
      contact_info TEXT,
      status TEXT NOT NULL DEFAULT 'Pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      resolved_at DATETIME,
      FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
      FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS request_history (
      id TEXT PRIMARY KEY,
      request_id TEXT NOT NULL,
      previous_status TEXT,
      new_status TEXT NOT NULL,
      actor_id TEXT NOT NULL,
      note TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE CASCADE,
      FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      link TEXT,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      admin_id TEXT NOT NULL,
      action TEXT NOT NULL,
      target_type TEXT NOT NULL,
      target_id TEXT NOT NULL,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
    CREATE INDEX IF NOT EXISTS idx_resources_availability ON resources(availability);
    CREATE INDEX IF NOT EXISTS idx_resources_seller ON resources(seller_id);
    CREATE INDEX IF NOT EXISTS idx_requests_resource ON requests(resource_id);
    CREATE INDEX IF NOT EXISTS idx_requests_buyer ON requests(buyer_id);
    CREATE INDEX IF NOT EXISTS idx_requests_seller ON requests(seller_id);
    CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
  `);
}

async function seedAnnaUniversityData(database: Database) {
  const shriyaPassword = bcrypt.hashSync('Shriya@123', 10);
  const classmatePassword = bcrypt.hashSync('Student@123', 10);

  // 1. Single Primary Demo User: Shriya (Student & Admin privileges so evaluator can test both)
  database.run(
    `INSERT INTO users (id, full_name, email, password_hash, role, college_id, branch, year, phone, bio)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      'usr_shriya',
      'Shriya',
      'shriya@thrifthub.in',
      shriyaPassword,
      'admin',
      '2021105024',
      'Computer Science & Engineering',
      '3rd Year',
      '+91 98401 23456',
      'Anna University CSE student selling 1st and 2nd year Regulation 2021 textbooks & drawing kits.'
    ]
  );

  // 2. Classmate users (sellers so Shriya can browse and send requests, but NOT exposed as demo logins)
  const classmates = [
    {
      id: 'usr_karthik',
      full_name: 'Karthik R.',
      email: 'karthik.r@annauniv.edu',
      password_hash: classmatePassword,
      role: 'student',
      college_id: '2021105018',
      branch: 'Information Technology',
      year: '3rd Year',
      phone: '+91 98402 34567',
      bio: 'IT 3rd year student, available at campus library.'
    },
    {
      id: 'usr_ananya',
      full_name: 'Ananya M.',
      email: 'ananya.m@annauniv.edu',
      password_hash: classmatePassword,
      role: 'student',
      college_id: '2022106032',
      branch: 'Electronics & Communication',
      year: '2nd Year',
      phone: '+91 98403 45678',
      bio: 'ECE 2nd year student passing down first year books.'
    }
  ];

  for (const c of classmates) {
    database.run(
      `INSERT INTO users (id, full_name, email, password_hash, role, college_id, branch, year, phone, bio)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [c.id, c.full_name, c.email, c.password_hash, c.role, c.college_id, c.branch, c.year, c.phone, c.bio]
    );
  }

  // 3. Anna University Regulation 2021 Syllabus Textbooks & Items (Low student-friendly prices)
  const annaUniversityResources = [
    {
      id: 'res_au_singaravelu_math1',
      title: 'Matrices and Calculus (MA3151)',
      category: 'Textbooks',
      subject: 'MA3151 - Matrices and Calculus',
      semester: 'Semester 1',
      author_or_brand: 'Dr. A. Singaravelu (Meenakshi Agency)',
      price: 120, // Low cost
      condition: 'Good',
      description: 'Prescribed Anna University Regulation 2021 syllabus book for 1st semester. Includes solved university exam question papers, Cayley-Hamilton theorem, and multivariable calculus.',
      availability: 'Available',
      seller_id: 'usr_shriya'
    },
    {
      id: 'res_au_discrete_math',
      title: 'Discrete Mathematics (MA3354)',
      category: 'Textbooks',
      subject: 'MA3354 - Discrete Mathematics',
      semester: 'Semester 3',
      author_or_brand: 'Dr. A. Singaravelu',
      price: 130, // Low cost
      condition: 'Like New',
      description: 'Anna University syllabus book for 3rd semester CSE and IT. Covers propositional logic, set theory, combinatorics, and graph theory with worked Anna University semester problems.',
      availability: 'Available',
      seller_id: 'usr_shriya'
    },
    {
      id: 'res_au_python_ge3151',
      title: 'Problem Solving and Python Programming (GE3151)',
      category: 'Textbooks',
      subject: 'GE3151 - Python Programming',
      semester: 'Semester 1',
      author_or_brand: 'E. Balagurusamy / McGraw Hill',
      price: 110, // Low cost
      condition: 'Like New',
      description: 'Used for Anna University 1st year common syllabus. Covers algorithmic problem solving, Python data types, functions, file handling, and university lab questions.',
      availability: 'Available',
      seller_id: 'usr_karthik'
    },
    {
      id: 'res_au_physics_mani',
      title: 'Engineering Physics (PH3151)',
      category: 'Textbooks',
      subject: 'PH3151 - Engineering Physics',
      semester: 'Semester 1',
      author_or_brand: 'Dr. P. Mani (Dhanam Publications)',
      price: 90, // Low cost
      condition: 'Good',
      description: 'Prescribed text for Anna University semester 1. Laser, fiber optics, thermal physics, quantum mechanics, and crystal structures. Clean pages with formula summaries.',
      availability: 'Available',
      seller_id: 'usr_ananya'
    },
    {
      id: 'res_au_digital_cs3351',
      title: 'Digital Principles and Computer Organization (CS3351)',
      category: 'Textbooks',
      subject: 'CS3351 - DPCO',
      semester: 'Semester 3',
      author_or_brand: 'M. Morris Mano & Michael D. Ciletti',
      price: 150, // Low cost
      condition: 'Good',
      description: 'Anna University Regulation 2021 prescribed textbook for 3rd semester CSE. Covers Boolean algebra, K-maps, combinational circuits, sequential circuits, and basic MIPS architecture.',
      availability: 'Available',
      seller_id: 'usr_shriya'
    },
    {
      id: 'res_au_java_cs3391',
      title: 'Object Oriented Programming using Java (CS3391)',
      category: 'Textbooks',
      subject: 'CS3391 - Object Oriented Programming',
      semester: 'Semester 3',
      author_or_brand: 'Herbert Schildt (Oracle Press)',
      price: 140, // Low cost
      condition: 'Like New',
      description: 'Prescribed core book for Anna University 3rd semester CSE/IT. Thorough coverage of Java OOPs concepts, multi-threading, collections framework, and event handling.',
      availability: 'Available',
      seller_id: 'usr_karthik'
    },
    {
      id: 'res_au_dbms_cs3492',
      title: 'Database Management Systems (CS3492)',
      category: 'Textbooks',
      subject: 'CS3492 - DBMS',
      semester: 'Semester 4',
      author_or_brand: 'Abraham Silberschatz, Korth, Sudarshan',
      price: 160, // Low cost
      condition: 'Good',
      description: 'Anna University 4th semester CSE book. SQL queries, ER modeling, relational algebra, B+ trees, normalization (1NF to BCNF), and transaction concurrency control.',
      availability: 'Requested',
      seller_id: 'usr_shriya'
    },
    {
      id: 'res_au_operating_systems_cs3451',
      title: 'Introduction to Operating Systems (CS3451)',
      category: 'Textbooks',
      subject: 'CS3451 - Operating Systems',
      semester: 'Semester 4',
      author_or_brand: 'Abraham Silberschatz / Charanjeet Singh',
      price: 130, // Low cost
      condition: 'Good',
      description: 'Anna University syllabus book for 4th semester. Covers process scheduling, semaphore synchronization, paging, virtual memory, and disk scheduling algorithms.',
      availability: 'Available',
      seller_id: 'usr_karthik'
    },
    {
      id: 'res_au_casio_991es',
      title: 'Casio fx-991ES Plus (2nd Edition) - Anna Univ Exam Approved',
      category: 'Calculators',
      subject: 'Engineering Mathematics (MA3151 / MA3251)',
      semester: 'All Semesters',
      author_or_brand: 'Casio',
      price: 350, // Reduced cost from original ~1200
      condition: 'Like New',
      description: '417 functions Natural Textbook display. Non-programmable and strictly permitted by Anna University Hall Ticket rules for semester theory exams. Clean slide cover.',
      availability: 'Available',
      seller_id: 'usr_ananya'
    },
    {
      id: 'res_au_drafter_ge3251',
      title: 'Engineering Graphics Mini Drafter & Roller Scale Kit (GE3251)',
      category: 'Drawing & Lab Materials',
      subject: 'GE3251 - Engineering Graphics',
      semester: 'Semester 2',
      author_or_brand: 'Omega Precision / Universal',
      price: 180, // Reduced cost
      condition: 'Good',
      description: 'Steel clamping mini drafter, 30cm roller scale, 45°/60° set squares, and drawing clips used for Anna University 1st year Engineering Graphics. Stored in protective pouch.',
      availability: 'Available',
      seller_id: 'usr_shriya'
    },
    {
      id: 'res_au_ds_lab_notes',
      title: 'Anna University CS3361 Data Structures Lab Record & Viva Questions',
      category: 'Notes & Study Materials',
      subject: 'CS3361 - Data Structures Laboratory',
      semester: 'Semester 3',
      author_or_brand: 'Handwritten & Verified by Faculty',
      price: 50, // Minimal token cost
      condition: 'Like New',
      description: 'Complete C++ code for all Anna University syllabus lab exercises (linked list, stack, queue, binary search tree, Dijkstra, hashing) with outputs and model viva Q&A.',
      availability: 'Available',
      seller_id: 'usr_shriya'
    },
    {
      id: 'res_au_beee_ee3251',
      title: 'Basic Electrical and Electronics Engineering (EE3251)',
      category: 'Textbooks',
      subject: 'EE3251 - BEEE',
      semester: 'Semester 2',
      author_or_brand: 'D.P. Kothari / V.K. Mehta',
      price: 100, // Low cost
      condition: 'Good',
      description: 'Anna University 2nd semester common syllabus book. AC circuits, DC machines, transformer calculations, and basic semiconductor diodes and BJTs.',
      availability: 'Available',
      seller_id: 'usr_ananya'
    }
  ];

  for (const r of annaUniversityResources) {
    database.run(
      `INSERT INTO resources (id, title, category, subject, semester, author_or_brand, price, condition, description, image_url, availability, seller_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [r.id, r.title, r.category, r.subject, r.semester, r.author_or_brand, r.price, r.condition, r.description, '', r.availability, r.seller_id]
    );
  }

  // 4. Sample Requests for Shriya demonstrating the workflow
  database.run(
    `INSERT INTO requests (id, resource_id, buyer_id, seller_id, message, contact_info, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, 'Pending', datetime('now', '-2 hours'), datetime('now', '-2 hours'))`,
    [
      'req_au_01',
      'res_au_dbms_cs3492',
      'usr_karthik',
      'usr_shriya',
      'Hi Shriya! I need this DBMS book for our 4th semester prep. Can we meet near the CEG library after class?',
      'karthik.r@annauniv.edu / 98402 34567'
    ]
  );

  database.run(
    `INSERT INTO request_history (id, request_id, previous_status, new_status, actor_id, note)
     VALUES (?, ?, 'None', 'Pending', ?, ?)`,
    ['hist_au_01', 'req_au_01', 'usr_karthik', 'Purchase request sent by student buyer.']
  );

  // Shriya requested a Python book from Karthik
  database.run(
    `INSERT INTO requests (id, resource_id, buyer_id, seller_id, message, contact_info, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, 'Accepted', datetime('now', '-1 day'), datetime('now', '-5 hours'))`,
    [
      'req_au_02',
      'res_au_python_ge3151',
      'usr_shriya',
      'usr_karthik',
      'Hey Karthik, my junior sister in 1st year needs the Python book. Can I collect it tomorrow?',
      'shriya@thrifthub.in / 98401 23456'
    ]
  );

  database.run(
    `INSERT INTO request_history (id, request_id, previous_status, new_status, actor_id, note)
     VALUES (?, ?, 'None', 'Pending', ?, ?)`,
    ['hist_au_02', 'req_au_02', 'usr_shriya', 'Request submitted by Shriya.']
  );
  database.run(
    `INSERT INTO request_history (id, request_id, previous_status, new_status, actor_id, note)
     VALUES (?, ?, 'Pending', 'Accepted', ?, ?)`,
    ['hist_au_03', 'req_au_02', 'usr_karthik', 'Accepted! Meet me at the campus canteen at 1:15 PM.']
  );

  // 5. Notifications for Shriya
  database.run(
    `INSERT INTO notifications (id, user_id, title, message, link, is_read)
     VALUES (?, ?, ?, ?, ?, 0)`,
    [
      'notif_au_01',
      'usr_shriya',
      'New Book Request',
      'Karthik R. sent a request for your "Database Management Systems (CS3492)". Check Incoming Requests.',
      '/requests/incoming'
    ]
  );
  database.run(
    `INSERT INTO notifications (id, user_id, title, message, link, is_read)
     VALUES (?, ?, ?, ?, ?, 0)`,
    [
      'notif_au_02',
      'usr_shriya',
      'Request Accepted',
      'Karthik R. accepted your request for "Problem Solving and Python Programming (GE3151)". Coordinate pickup.',
      '/requests/my'
    ]
  );

  console.log('Anna University syllabus database seeded successfully with user Shriya.');
}

export async function executeQuery<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const database = await getDb();
  const stmt = database.prepare(sql);
  if (params.length > 0) {
    stmt.bind(params);
  }
  const results: T[] = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject() as T);
  }
  stmt.free();
  return results;
}

export async function executeQueryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const results = await executeQuery<T>(sql, params);
  return results.length > 0 ? results[0] : null;
}

export async function executeRun(sql: string, params: any[] = []): Promise<void> {
  const database = await getDb();
  database.run(sql, params);
  saveDatabase();
}
