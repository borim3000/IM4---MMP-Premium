document.addEventListener("DOMContentLoaded", () => {
    setDynamicGreeting();
    checkDashboardAuth();
    fetchWeeklyDistance();
});

// 1. DYNAMIC GREETING LOGIC
function setDynamicGreeting() {
    const hour = new Date().getHours();
    let greeting = "Willkommen";

    if (hour >= 5 && hour < 12) {
        greeting = "Guten Morgen";
    } else if (hour >= 12 && hour < 18) {
        greeting = "Guten Tag";
    } else if (hour >= 18 || hour < 5) {
        greeting = "Guten Abend";
    }

    document.getElementById('dynamicGreeting').textContent = `${greeting} bei der IM4 CYBERstroller App`;
}

// 2. SMART BUTTON LOGIC (Login vs Profile)
async function checkDashboardAuth() {
    const dashProfileBtn = document.getElementById('dashProfileBtn');
    const dashProfileText = document.getElementById('dashProfileText');

    if (!dashProfileBtn || !dashProfileText) return;

    try {
        const response = await fetch("api/protected.php");
        
        if (response.status === 200) {
            // User is actively logged in
            dashProfileBtn.href = "protected.html";
            dashProfileText.textContent = "Profil";
        } else {
            // User is a guest / logged out
            dashProfileBtn.href = "login.html";
            dashProfileText.textContent = "Login";
        }
    } catch (error) {
        console.error("Auth check failed:", error);
        dashProfileBtn.href = "login.html";
        dashProfileText.textContent = "Login";
    }
}

// 3. WEEKLY STATS ENGINE
async function fetchWeeklyDistance() {
    const distEl = document.getElementById('weeklyDistance');
    if (!distEl) return;

    try {
        const response = await fetch("api/get_weekly_stats.php");
        const result = await response.json();

        if (result.status === "success") {
            distEl.textContent = result.distance;
        } else {
            distEl.textContent = "0.00";
        }
    } catch (error) {
        console.error("Error fetching weekly stats:", error);
        distEl.textContent = "0.00";
    }
}