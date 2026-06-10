// map initialisieren
// Create the map object but don't set the view yet (we wait for the first GPS ping)
const map = L.map('map', {
    zoomControl: false // Hides the default +/- buttons for a cleaner, app-like feel
});

// Load the CartoDB Dark Matter tile layer to match your dark UI
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 20
}).addTo(map);

// Create a custom pulsing pink dot using pure HTML/CSS to match your branding
const babyMarkerIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: #ff007b; width: 16px; height: 16px; border-radius: 50%; border: 3px solid #141414; box-shadow: 0 0 12px rgba(255,0,123,0.8);"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11] // Centers the dot perfectly over the exact coordinate
});

let currentMarker = null;

//live tracking logic
async function fetchLiveLocation() {
    try {
        const response = await fetch('api/get_current_location.php');
        const result = await response.json();

        if (result.status === "success" && result.data) {
            // Convert your database strings into usable decimal numbers
            const lat = parseFloat(result.data.breitengrad);
            const lng = parseFloat(result.data.laengengrad);
            const altitude = result.data.hoehe;
            const time = result.data.zeit;

            // Update the Map
            if (!currentMarker) {
                // FIRST PING: Center the map and spawn the marker. 
                // Zoom level 18 = exactly ~200m screen width in Switzerland
                map.setView([lat, lng], 18);
                currentMarker = L.marker([lat, lng], { icon: babyMarkerIcon }).addTo(map);
                
                // Add a popup showing the time and altitude
                currentMarker.bindPopup(`<b>Zuletzt aktualisiert:</b><br>${time}<br><b>Höhe:</b> ${altitude}m`).openPopup();
            } else {
                // SUBSEQUENT PINGS: Glide the marker to the new spot
                currentMarker.setLatLng([lat, lng]);
                
                // Keep the camera locked onto the marker as the stroller moves
                map.setView([lat, lng], 18);
                
                // Update the popup data quietly in the background
                currentMarker.getPopup().setContent(`<b>Zuletzt aktualisiert:</b><br>${time}<br><b>Höhe:</b> ${altitude}m`);
            }
        } else {
            console.warn("No GPS data found yet.");
        }
    } catch (error) {
        console.error("Tracker sync failed:", error);
    }
}

// 1. Fetch immediately when the page loads so the user doesn't stare at a blank map
fetchLiveLocation();

// 2. Set the interval to fetch new data every 15 seconds (15000 milliseconds)
setInterval(fetchLiveLocation, 15000);



//--------------------------------------------------------------------------------------------------------------------
// session state for tracking button / toggle logic

const trackBtn = document.getElementById('trackBtn');

// Run this immediately on initialization to check for unfinished business
function checkActiveSession() {
    const activeSessionId = localStorage.getItem('active_session_id');
    if (activeSessionId) {
        // App was closed during track; restore Stop UI state cleanly
        trackBtn.textContent = "Spaziergang beenden";
        trackBtn.classList.remove('start-state');
        trackBtn.classList.add('stop-state');
    }
}
checkActiveSession();

async function toggleTracking() {
    const activeSessionId = localStorage.getItem('active_session_id');

    if (!activeSessionId) {
        // --- START TRACKING ACTION ---
        try {
            const response = await fetch('api/start_walk.php');
            const result = await response.json();

            if (result.status === "success") {
                localStorage.setItem('active_session_id', result.session_id);
                
                // Animate to Stop state styling
                trackBtn.textContent = "Spaziergang beenden";
                trackBtn.classList.remove('start-state');
                trackBtn.classList.add('stop-state');
            } else {
                alert("Could not start tracking: " + result.message);
            }
        } catch (err) {
            console.error("Session ignition error:", err);
        }
    } else {
        // --- STOP TRACKING ACTION ---
        if (!confirm("Möchtest du diesen Spaziergang beenden und speichern?")) return;

        const formData = new FormData();
        formData.append('session_id', activeSessionId);

        try {
            const response = await fetch('api/stop_walk.php', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();

            if (result.status === "success") {
                alert(`Spaziergang gespeichert!\nDistanz: ${result.distance} km\nGeschwindigkeit: ${result.speed} km/h`);
                
                localStorage.removeItem('active_session_id');
                
                // Revert UI configuration states
                trackBtn.textContent = "Spaziergang starten";
                trackBtn.classList.remove('stop-state');
                trackBtn.classList.add('start-state');
            } else {
                alert("Error saving your walk: " + result.message);
            }
        } catch (err) {
            console.error("Session termination error:", err);
        }
    }
}