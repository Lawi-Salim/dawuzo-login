import mysql from "mysql2/promise"
import dotenv from "dotenv"

dotenv.config()

// Créer un pool de connexions MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "nadalawi",
  database: process.env.DB_NAME || "auth_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

// Fonction pour initialiser la base de données
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection()

    // Créer la table users si elle n'existe pas
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(100) NOT NULL,
        prenom VARCHAR(100) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    console.log("Base de données initialisée avec succès")
    connection.release()
  } catch (error) {
    console.error("Erreur lors de l'initialisation de la base de données:", error)
  }
}

// Initialiser la base de données au démarrage
initializeDatabase()

export default pool

