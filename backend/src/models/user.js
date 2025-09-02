// ===== 1. backend/src/models/User.js =====
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../database/database.db');

class User {
    static initializeDatabase() {
        const db = new sqlite3.Database(dbPath);

        db.serialize(() => {
            // Créer la table users si elle n'existe pas
            db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          name TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

            // Créer la table transactions si elle n'existe pas
            db.run(`
        CREATE TABLE IF NOT EXISTS transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
          amount DECIMAL(10,2) NOT NULL,
          category TEXT NOT NULL,
          description TEXT,
          date DATE NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);
        });

        db.close();
    }

    static findByEmail(email, callback) {
        const db = new sqlite3.Database(dbPath);
        db.get('SELECT * FROM users WHERE email = ?', [email], callback);
        db.close();
    }

    static create(userData, callback) {
        const db = new sqlite3.Database(dbPath);
        const { email, password, name } = userData;

        db.run(
            'INSERT INTO users (email, password, name) VALUES (?, ?, ?)', [email, password, name],
            function(err) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, { id: this.lastID, email, name });
                }
            }
        );
        db.close();
    }

    static findById(id, callback) {
        const db = new sqlite3.Database(dbPath);
        db.get('SELECT * FROM users WHERE id = ?', [id], callback);
        db.close();
    }
}

module.exports = User;