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
    const { nom, password } = req.body

    // Validation des données
    if (!nom || !password) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs sont requis",
      })
    }

    // Obtenir une connexion
    connection = await getConnection()

    // Rechercher l'utilisateur
    const [users] = await connection.query("SELECT * FROM users WHERE nom = ?", [nom])

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Nom d'utilisateur ou mot de passe incorrect",
      })
    }

    const user = users[0]

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Nom d'utilisateur ou mot de passe incorrect",
      })
    }

    // Retourner les informations de l'utilisateur (sans le mot de passe)
    const { password: _, ...userInfo } = user

    res.status(200).json({
      success: true,
      message: "Connexion réussie",
      user: userInfo,
    })
  } catch (error) {
    console.error("Erreur lors de la connexion:", error)
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la connexion",
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

