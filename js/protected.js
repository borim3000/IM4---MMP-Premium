async function checkAuth() {
  try {
    const response = await fetch("/api/protected.php", {
      credentials: "include",
    });

    if (response.status === 401) {
      window.location.href = "/login.html";
      return false;
    }

    const result = await response.json();

    // Display user data in the protected content div
    const protectedContent = document.getElementById("protectedContent");

    // only run protectedContent if html has a div with id protectedContent
    if (protectedContent) {

      protectedContent.innerHTML = `
        <h3>Welcome, ${result.email}!</h3>
        <p>Your user ID is: ${result.user_id}</p>
      `;

    }

    return true;
  } catch (error) {
    console.error("Auth check failed:", error);
    window.location.href = "/login.html";
    return false;
  }
}

// Check auth when page loads
window.addEventListener("load", checkAuth);
