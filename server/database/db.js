const { Pool } = require('pg');

// Configuration de la connexion PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('localhost') ? false : {
    rejectUnauthorized: false
  }
});

// Test de connexion
pool.on('connect', () => {
  console.log('✅ Connexion PostgreSQL établie');
});

pool.on('error', (err) => {
  console.error('❌ Erreur PostgreSQL:', err);
});

// Initialisation de la base de données
async function initializeDatabase() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Table des utilisateurs
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
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
        subscription_current_period_end TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Table des recherches sauvegardées
    await client.query(`
      CREATE TABLE IF NOT EXISTS searches (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        profile_type TEXT NOT NULL,
        city TEXT,
        department TEXT,
        sector TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Table des résultats de recherche
    await client.query(`
      CREATE TABLE IF NOT EXISTS search_results (
        id SERIAL PRIMARY KEY,
        search_id INTEGER NOT NULL,
        company_name TEXT NOT NULL,
        city TEXT,
        sector TEXT,
        phone TEXT,
        email TEXT,
        website_url TEXT,
        opportunity_type TEXT NOT NULL,
        social_media TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (search_id) REFERENCES searches(id) ON DELETE CASCADE
      )
    `);

    // Table des tokens de réinitialisation de mot de passe
    await client.query(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        token TEXT UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Créer les index pour améliorer les performances
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_searches_user_id ON searches(user_id);
      CREATE INDEX IF NOT EXISTS idx_search_results_search_id ON search_results(search_id);
      CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
      CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
    `);

    await client.query('COMMIT');
    console.log('✅ Base de données PostgreSQL initialisée');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Erreur initialisation base de données:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Initialiser la base de données au démarrage
initializeDatabase().catch(console.error);

// Helper pour convertir les placeholders SQLite (?) en PostgreSQL ($1, $2, etc.)
function convertQuery(query) {
  if (query.includes('$')) {
    // Déjà en format PostgreSQL
    return query;
  }
  
  let paramIndex = 1;
  return query.replace(/\?/g, () => `$${paramIndex++}`);
}

// Interface compatible avec l'ancien code SQLite
// Méthodes async pour PostgreSQL
const db = {
  // Récupérer une seule ligne
  async get(query, params = []) {
    const client = await pool.connect();
    try {
      const pgQuery = convertQuery(query);
      const result = await client.query(pgQuery, params);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  },

  // Récupérer toutes les lignes
  async all(query, params = []) {
    const client = await pool.connect();
    try {
      const pgQuery = convertQuery(query);
      const result = await client.query(pgQuery, params);
      return result.rows;
    } finally {
      client.release();
    }
  },

  // Exécuter une requête (INSERT, UPDATE, DELETE)
  async run(query, params = []) {
    const client = await pool.connect();
    try {
      const pgQuery = convertQuery(query);
      const result = await client.query(pgQuery, params);
      // Pour INSERT avec RETURNING id, récupérer l'ID depuis les rows
      const lastID = result.rows[0]?.id || null;
      return {
        lastID,
        changes: result.rowCount || 0
      };
    } finally {
      client.release();
    }
  },

  // Préparer une requête (pour les insertions multiples)
  prepare(query) {
    const pgQuery = convertQuery(query);
    return {
      run: async (params, callback) => {
        const client = await pool.connect();
        try {
          const result = await client.query(pgQuery, params);
          if (callback) {
            callback(null, {
              lastID: result.rows[0]?.id || null,
              changes: result.rowCount || 0
            });
          }
        } catch (error) {
          if (callback) {
            callback(error);
          } else {
            throw error;
          }
        } finally {
          client.release();
        }
      },
      finalize: () => {
        // Pas besoin de finaliser avec PostgreSQL
      }
    };
  },

  // Pour compatibilité avec db.serialize() (non utilisé avec PostgreSQL)
  serialize: (callback) => {
    callback();
  },

  // Pool PostgreSQL pour les requêtes avancées
  pool
};

module.exports = db;
