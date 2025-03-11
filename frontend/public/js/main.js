// document.addEventListener("DOMContentLoaded", () => {
//   // Configuration de l'API
//   const API_URL = "http://localhost:3001/api/auth"

//   // Récupérer les éléments du DOM
//   const loginForm = document.getElementById("loginForm")
//   const registerForm = document.getElementById("registerForm")
//   const messageDiv = document.getElementById("message")

//   // Fonction pour afficher un message
//   function showMessage(text, isError = false) {
//     messageDiv.textContent = text
//     messageDiv.className = isError ? "message error" : "message success"
//   }

//   // Gérer le formulaire d'inscription
//   if (registerForm) {
//     registerForm.addEventListener("submit", async (e) => {
//       e.preventDefault()

//       const nom = document.getElementById("nom").value.trim()
//       const prenom = document.getElementById("prenom").value.trim()
//       const password = document.getElementById("password").value

//       try {
//         const response = await fetch(`${API_URL}/index`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ nom, prenom, password }),
//         })

//         const data = await response.json()

//         if (response.ok) {
//           showMessage("Inscription réussie! Redirection vers la page de connexion...")

//           // Rediriger vers la page de connexion après 2 secondes
//           setTimeout(() => {
//             window.location.href = "welcome.html"
//           }, 2000)
//         } else {
//           showMessage(data.message || "Erreur lors de l'inscription", true)
//         }
//       } catch (error) {
//         console.error("Erreur:", error)
//         showMessage("Erreur de connexion au serveur", true)
//       }
//     })
//   }


//   // Vérifier si l'utilisateur est déjà connecté sur la page d'accueil ou d'inscription
//   const currentPage = window.location.pathname.split("/").pop()
//   if (
//     (currentPage === "index.html" || currentPage === "") &&
//     localStorage.getItem("userData")
//   ) {
//     window.location.href = "welcome.html"
//   }
// })


//            CONNECTION DEPUIS VERCEL VERS AWS
//            CONNECTION DEPUIS VERCEL VERS AWS

// Suppression des imports de modules Node.js car ce fichier s'exécute dans le navigateur
document.addEventListener("DOMContentLoaded", () => {
  // Configuration de l'API
  const API_URL = "/api/auth"

  // Récupérer les éléments du DOM
  const loginForm = document.getElementById("loginForm")
  const registerForm = document.getElementById("registerForm")
  const messageDiv = document.getElementById("message")

  // Fonction pour afficher un message
  function showMessage(text, isError = false) {
    messageDiv.textContent = text
    messageDiv.className = `message ${isError ? "error" : "success"}`
  }

  // Gérer le formulaire d'inscription
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      const formData = {
        nom: document.getElementById("nom").value.trim(),
        prenom: document.getElementById("prenom").value.trim(),
        password: document.getElementById("password").value,
      }

      try {
        showMessage("Envoi en cours...")

        const response = await fetch(`${API_URL}/index`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || `Erreur HTTP: ${response.status}`)
        }

        showMessage("Inscription réussie! Redirection vers la page de connexion...")

        setTimeout(() => {
          window.location.href = "register.html"
        }, 2000)
      } catch (error) {
        console.error("Erreur:", error)
        showMessage(error.message || "Erreur de connexion au serveur", true)
      }
    })
  }

  // Gérer le formulaire de connexion
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      const formData = {
        nom: document.getElementById("nom").value.trim(),
        password: document.getElementById("password").value,
      }

      try {
        showMessage("Connexion en cours...")

        const response = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || `Erreur HTTP: ${response.status}`)
        }

        localStorage.setItem(
          "userData",
          JSON.stringify({
            id: data.user.id,
            nom: data.user.nom,
            prenom: data.user.prenom,
          }),
        )

        showMessage("Connexion réussie! Redirection...")

        setTimeout(() => {
          window.location.href = "welcome.html"
        }, 1000)
      } catch (error) {
        console.error("Erreur:", error)
        showMessage(error.message || "Erreur de connexion au serveur", true)
      }
    })
  }

  // Vérifier si l'utilisateur est déjà connecté
  const currentPage = window.location.pathname.split("/").pop()
  if (
    (currentPage === "index.html" || currentPage === "register.html" || currentPage === "") &&
    localStorage.getItem("userData")
  ) {
    window.location.href = "welcome.html"
  }
})

