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
    })
  } finally {
    if (connection) await connection.end()
  }
})

// Ajouter une route de connexion
router.post("/login", async (req, res) => {
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
    connection = await db.getConnection()

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
    if (connection) await connection.end()
  }
})

export default router

