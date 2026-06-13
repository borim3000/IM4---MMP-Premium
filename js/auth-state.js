async function updateNavbarAuth() {
    const authBtn = document.getElementById("authBtn");
    const authText = document.getElementById("authText");
  
    if (!authBtn || !authText) return;
  
    try {
      // Ping your existing protected endpoint to check if we are logged in
      const response = await fetch("/api/protected.php", { credentials: "include" });
  
      if (response.status === 200) {
        // The server said yes! We are logged in. Transform the button into a Logout button.
        authBtn.href = "#"; // Disable navigation link
        authText.textContent = "Logout";
        
        // Hijack the click event to perform the logout API call
        authBtn.onclick = async (e) => {
          e.preventDefault();
          try {
            const logResponse = await fetch("api/logout.php", { method: "GET", credentials: "include" });
            const logResult = await logResponse.json();
            if (logResult.status === "success") {
              window.location.href = "login.html";
            }
          } catch (err) {
            console.error("Logout failed:", err);
          }
        };
      }
    } catch (error) {
      // If 401 or network error occurs, do nothing. The default HTML state is "Login".
      console.log("User is an unauthenticated guest.");
    }
  }
  
  // Fire immediately when the DOM is ready
  document.addEventListener("DOMContentLoaded", updateNavbarAuth);