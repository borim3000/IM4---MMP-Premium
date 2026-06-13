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


// slide overlay / ios style screen view panels------------------
document.addEventListener("DOMContentLoaded", () => {
    const datenschutzBtn = document.getElementById('datenschutzBtn');
    const datenschutzPanel = document.getElementById('datenschutzPanel');
    const closePanelBtn = document.getElementById('closePanelBtn');

    if (datenschutzBtn && datenschutzPanel && closePanelBtn) {
        // 1. OPEN TRIGGER: Slide the view on screen
        datenschutzBtn.addEventListener('click', () => {
            datenschutzPanel.classList.add('open');
            // Auto-snap overlay scroll area back to absolute top on display initialization
            datenschutzPanel.querySelector('.ios-panel-content').scrollTop = 0;
        });

        // 2. CLOSE TRIGGER: Slide the view back off screen
        closePanelBtn.addEventListener('click', () => {
            datenschutzPanel.classList.remove('open');
        });
    }
});