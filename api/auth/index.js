import bcrypt from "bcrypt"
import mysql from "mysql2/promise"

// Fonction pour obtenir une connexion à la base de données
async function getConnection() {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === "true" ? {} : undefined,
  })
}

// Gestionnaire de l'API
export default async function handler(req, res) {
  // Vérifier si c'est une requête POST
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Méthode non autorisée" })
  }

  let connection
  try {
    const { nom, prenom, password } = req.body

    // Validation des données
    if (!nom || !prenom || !password) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs sont requis",
      })
    }

    // Obtenir une connexion
    connection = await getConnection()

    // Vérifier si l'utilisateur existe déjà
    const [existingUsers] = await connection.query("SELECT * FROM users WHERE nom = ?", [nom])

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cet utilisateur existe déjà",
      })
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insérer l'utilisateur dans la base de données
    const [result] = await connection.query("INSERT INTO users (nom, prenom, password) VALUES (?, ?, ?)", [
      nom,
      prenom,
      hashedPassword,
    ])

    res.status(201).json({
      success: true,
      message: "Utilisateur créé avec succès",
      userId: result.insertId,
    })
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error)
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de l'inscription",
    })
  } finally {
    if (connection) {
      try {
        await connection.end()
      } catch (error) {
        console.error("Erreur lors de la fermeture de la connexion:", error)
      }
    }
  }
}

