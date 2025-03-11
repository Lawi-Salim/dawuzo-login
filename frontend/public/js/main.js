document.addEventListener("DOMContentLoaded", () => {
  // Configuration de l'API
  const API_URL = "http://localhost:3001/api/auth"

  // Récupérer les éléments du DOM
  const loginForm = document.getElementById("loginForm")
  const registerForm = document.getElementById("registerForm")
  const messageDiv = document.getElementById("message")

  // Fonction pour afficher un message
  function showMessage(text, isError = false) {
    messageDiv.textContent = text
    messageDiv.className = isError ? "message error" : "message success"
  }

  // Gérer le formulaire d'inscription
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      const nom = document.getElementById("nom").value.trim()
      const prenom = document.getElementById("prenom").value.trim()
      const password = document.getElementById("password").value

      try {
        const response = await fetch(`${API_URL}/index`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nom, prenom, password }),
        })

        const data = await response.json()

        if (response.ok) {
          showMessage("Inscription réussie! Redirection vers la page de connexion...")

          // Rediriger vers la page de connexion après 2 secondes
          setTimeout(() => {
            window.location.href = "welcome.html"
          }, 2000)
        } else {
          showMessage(data.message || "Erreur lors de l'inscription", true)
        }
      } catch (error) {
        console.error("Erreur:", error)
        showMessage("Erreur de connexion au serveur", true)
      }
    })
  }


  // Vérifier si l'utilisateur est déjà connecté sur la page d'accueil ou d'inscription
  const currentPage = window.location.pathname.split("/").pop()
  if (
    (currentPage === "index.html" || currentPage === "") &&
    localStorage.getItem("userData")
  ) {
    window.location.href = "welcome.html"
  }
})

