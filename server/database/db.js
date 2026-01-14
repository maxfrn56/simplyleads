const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../prospects.db');
const db = new sqlite3.Database(dbPath);

// Initialisation de la base de données
db.serialize(() => {
  // Table des utilisateurs
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      first_name TEXT,
      last_name TEXT,
      phone TEXT,
      plan_type TEXT DEFAULT 'free',
      request_count INTEGER DEFAULT 0,
      request_limit INTEGER DEFAULT 5,
      stripe_customer_id TEXT,
      stripe_subscription_id TEXT,
      subscription_status TEXT,
      subscription_current_period_end DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Migration : Ajouter les colonnes si elles n'existent pas
  db.run(`ALTER TABLE users ADD COLUMN plan_type TEXT DEFAULT 'free'`, () => {});
  db.run(`ALTER TABLE users ADD COLUMN request_count INTEGER DEFAULT 0`, () => {});
  db.run(`ALTER TABLE users ADD COLUMN request_limit INTEGER DEFAULT 5`, () => {});
  db.run(`ALTER TABLE users ADD COLUMN stripe_customer_id TEXT`, () => {});
  db.run(`ALTER TABLE users ADD COLUMN stripe_subscription_id TEXT`, () => {});
  db.run(`ALTER TABLE users ADD COLUMN subscription_status TEXT`, () => {});
  db.run(`ALTER TABLE users ADD COLUMN subscription_current_period_end DATETIME`, () => {});
  db.run(`ALTER TABLE users ADD COLUMN first_name TEXT`, () => {});
  db.run(`ALTER TABLE users ADD COLUMN last_name TEXT`, () => {});
  db.run(`ALTER TABLE users ADD COLUMN phone TEXT`, () => {});

  // Table des recherches sauvegardées
  db.run(`
    CREATE TABLE IF NOT EXISTS searches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      profile_type TEXT NOT NULL,
      city TEXT,
      department TEXT,
      sector TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Table des résultats de recherche
  db.run(`
    CREATE TABLE IF NOT EXISTS search_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      search_id INTEGER NOT NULL,
      company_name TEXT NOT NULL,
      city TEXT,
      sector TEXT,
      phone TEXT,
      email TEXT,
      website_url TEXT,
      opportunity_type TEXT NOT NULL,
      social_media TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (search_id) REFERENCES searches(id)
    )
  `);

  // Migration : Ajouter la colonne social_media si elle n'existe pas
  db.run(`ALTER TABLE search_results ADD COLUMN social_media TEXT`, () => {});
});

module.exports = db;
