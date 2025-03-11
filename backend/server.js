import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.js"

// Configuration
dotenv.config()
const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api/auth", authRoutes)

// Test route
app.get("/", (req, res) => {
  res.json({ message: "API is running" })
})

// Start server
app.listen(PORT, () => {
  console.log("Serveur démarré avec succès !")
  console.log(`Clique ici pour suivre le lien : http://localhost:${PORT}`)
})

