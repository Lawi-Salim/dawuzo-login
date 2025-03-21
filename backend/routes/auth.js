// import express from "express"
// import bcrypt from "bcrypt"
// import pool from "../config/db.js"

// const router = express.Router()

// // Route d'inscription
// router.post("/index", async (req, res) => {
//   try {
//     const { nom, prenom, password } = req.body

//     // Validation des données
//     if (!nom || !prenom || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Tous les champs sont requis",
//       })
//     }

//     // Vérifier si l'utilisateur existe déjà
//     const [existingUsers] = await pool.query("SELECT * FROM users WHERE nom = ?", [nom])

//     if (existingUsers.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Cet utilisateur existe déjà",
//       })
//     }

//     // Hasher le mot de passe
//     const hashedPassword = await bcrypt.hash(password, 10)

//     // Insérer l'utilisateur dans la base de données
//     const [result] = await pool.query("INSERT INTO users (nom, prenom, password) VALUES (?, ?, ?)", [
//       nom,
//       prenom,
//       hashedPassword,
//     ])

//     res.status(201).json({
//       success: true,
//       message: "Utilisateur créé avec succès",
//       userId: result.insertId,
//     })
//   } catch (error) {
//     console.error("Erreur lors de l'inscription:", error)
//     res.status(500).json({
//       success: false,
//       message: "Erreur serveur lors de l'inscription",
//     })
//   }
// })

// export default router



//            CONNEXION DEPUIS VERCEL VERS AWS
//            CONNEXION DEPUIS VERCEL VERS AWS

import express from "express"
import bcrypt from "bcrypt"
import db from "../config/db.js"

const router = express.Router()

// Route d'inscription
router.post("/index", async (req, res) => {
  let connection
  try {
    const { nom, prenom, password } = req.body

    // Log pour le débogage
    console.log("Données reçues:", { nom, prenom, passwordLength: password?.length })

    // Validation des données
    if (!nom || !prenom || !password) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs sont requis",
      })
    }

    // Obtenir une connexion
    connection = await db.getConnection()

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
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
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
})

export default router

