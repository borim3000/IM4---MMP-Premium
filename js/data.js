// ==========================================================================
// INITIALIZATION AND ROUTING CONTROLS
// ==========================================================================
window.onload = () => {
    const daySelector = document.getElementById('daySelector');
    
    // Fallback security check: ensure input is rendered before setting value    
    if (daySelector) {
        // Automatically default datepicker string to 'Today'
        const todayStr = new Date().toISOString().split('T')[0];
        daySelector.value = todayStr;
        
        // Load initial values immediately
        fetchDailyStats(todayStr);

        // Track calendar value updates
        daySelector.addEventListener('change', (e) => {
            fetchDailyStats(e.target.value);
        });
    }

    // NEW: Initialize monthly charts asynchronously on system startup
    fetchMonthlyCharts();
};


// ==========================================================================
// METRICS ENGINE
// ==========================================================================

async function fetchDailyStats(dateString) {
    const walksContainer = document.getElementById('walks-list-container');
    
    const valSpeed = document.getElementById('val-speed');
    const valTime = document.getElementById('val-time');
    const valDist = document.getElementById('val-dist');

    try {
        const response = await fetch(`api/get_walks_by_date.php?date=${dateString}`);
        const result = await response.json();

        if (result.status === "success") {
            // 1. Update the top aggregate totals summary widgets
            valSpeed.textContent = result.summary.avg_speed;
            valTime.textContent = result.summary.total_time;
            valDist.textContent = result.summary.total_distance;

            // 2. Clear out any previous layout remnants
            walksContainer.innerHTML = '';

            if (result.walks.length === 0) {
                // Friendly status placeholder message if no routes found
                walksContainer.innerHTML = `<p style="color: #868686; width: 100%; text-align: center; margin-top: 20px;">Keine Spaziergänge an diesem Tag aufgezeichnet.</p>`;
                return;
            }

            // 3. Loop and render separate site-boxes for each recorded track route
            result.walks.forEach((walk, index) => {
                const walkNumber = index + 1;
                
                walksContainer.innerHTML += `
                    <div class="site-box box-full route-box" onclick="openWalkDetails(${walk.session_id})">
                        <div class="route-box-header">
                            <span class="route-title">Spaziergang #${walkNumber}</span>
                            <span class="route-time">${walk.clock_start} - ${walk.clock_end}</span>
                        </div>
                        <div class="route-box-stats">
                            <div>
                                <span>${walk.total_distance || '0.00'} km</span>
                                <label>Distanz</label>
                            </div>
                            <div>
                                <span>${walk.duration_text}</span>
                                <label>Dauer</label>
                            </div>
                            <div>
                                <span>${walk.avg_speed || '0.0'} km/h</span>
                                <label>Ø Tempo</label>
                            </div>
                        </div>
                    </div>
                `;
            });

        } else {
            console.error("Database query exception:", result.message);
        }
    } catch (err) {
        console.error("Failed to connect to date metric engine:", err);
    }
}
// ==========================================================================
// sliding panel route engine -----------------------
//==========================================================================

let walkMap = null;
let walkPolyline = null;

async function openWalkDetails(sessionId) {
    const panel = document.getElementById('walkDetailPanel');
    
    // Slide it in immediately so the user doesn't wait
    panel.classList.add('open');
    panel.querySelector('.ios-panel-content').scrollTop = 0;

    try {
        const response = await fetch(`api/get_walk_details.php?session_id=${sessionId}`);
        const result = await response.json();

        if (result.status === "success") {
            
            // 1. Populate the Text Data
            const sess = result.session;
            
            // Format dates
            const startStr = new Date(sess.start_time.replace(/-/g, "/"));
            const endStr = sess.end_time ? new Date(sess.end_time.replace(/-/g, "/")) : null;
            
            document.getElementById('det-start').textContent = startStr.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            document.getElementById('det-end').textContent = endStr ? endStr.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Aktiv...';
            document.getElementById('det-dist').textContent = `${sess.total_distance || '0.00'} km`;
            document.getElementById('det-speed').textContent = `${sess.avg_speed || '0.0'} km/h`;
            document.getElementById('det-alt').textContent = `${result.max_altitude || '--'} m`;

            // Calculate duration if needed
            if (endStr) {
                const diffMs = endStr - startStr;
                const hrs = Math.floor((diffMs % 86400000) / 3600000);
                const mins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
                document.getElementById('det-time').textContent = `${hrs > 0 ? hrs + 'h ' : ''}${mins}m`;
            } else {
                document.getElementById('det-time').textContent = 'Aktiv...';
            }

            // 2. Draw the Map
            // Delay map rendering slightly so the CSS slide animation has time to finish. 
            // If you load tiles while a box is off-screen, they break.
            document.getElementById('noRouteOverlay').style.display = 'none';

            setTimeout(() => {
                if (!walkMap) {
                    // Initialize Map once
                    walkMap = L.map('routeMap', { 
                        zoomControl: false,
                        gestureHandling: true 
                    });
                    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                        attribution: '&copy; OpenStreetMap',
                        maxZoom: 20
                    }).addTo(walkMap);
                }

                // Crucial fix for hidden maps: Forces it to recalculate its dimensions
                walkMap.invalidateSize(); 

                // Remove the old line if opening a different walk
                if (walkPolyline) {
                    walkMap.removeLayer(walkPolyline);
                }

                // THE CONDITIONAL CHECK: If route array is empty or distance is 0, trigger overlay!
                if (!result.route || result.route.length === 0 || parseFloat(sess.total_distance) === 0) {
                    
                    // Show our custom dark-mode "No Route" box
                    document.getElementById('noRouteOverlay').style.display = 'flex';
                    
                    // Center the empty map over a fallback standard location (e.g., Switzerland center) so it isn't broken
                    walkMap.setView([46.8182, 8.2275], 8);

                } else {
                    // Route exists! Draw the line normally
                    const latlngs = result.route.map(pt => [parseFloat(pt.breitengrad), parseFloat(pt.laengengrad)]);
                    
                    // Draw the solid pink route
                    walkPolyline = L.polyline(latlngs, {
                        color: '#ff007b',
                        weight: 5,
                        opacity: 0.8,
                        lineJoin: 'round'
                    }).addTo(walkMap);

                    // Automatically zoom out just enough to fit the entire route perfectly
                    walkMap.fitBounds(walkPolyline.getBounds(), { padding: [20, 20] });
                }
            }, 380); // Wait 380ms (matches CSS transition time exactly)

        }
    } catch (err) {
        console.error("Error fetching walk details:", err);
    }
}

// 3. CLOSE ACTION TRIGGER
document.getElementById('closeWalkPanelBtn').addEventListener('click', () => {
    document.getElementById('walkDetailPanel').classList.remove('open');
});



// MONTHLY CHARTS ENGINE (CHARTJS INTEGRATION)
// ==========================================================================

// Bind chart instances to the window global scope so data.html can signal updates
window.distanceChartInstance = null;
window.speedChartInstance = null;

async function fetchMonthlyCharts() {
    try {
        const response = await fetch('api/get_monthly_stats.php');
        const result = await response.json();

        if (result.status === "success") {
            renderDistanceChart(result.labels, result.distances);
            renderSpeedChart(result.labels, result.speeds);
        }
    } catch (err) {
        console.error("Failed to compile historical monthly data vectors:", err);
    }
}

// Configuration options shared between both chart types
const globalChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false } // Hidden layout legends look cleaner on mobile
    },
    scales: {
        x: {
            grid: { display: false },
            ticks: {
                color: '#868686',
                font: { size: 10, family: 'Oxygen' },
                maxTicksLimit: 6 // Limits crowding on compact mobile screens
            }
        },
        y: {
            grid: { color: '#1c1c1c' },
            border: { dash: [4, 4] },
            ticks: {
                color: '#868686',
                font: { size: 11, family: 'Oxygen' }
            }
        }
    }
};

function renderDistanceChart(labels, values) {
    const ctx = document.getElementById('distanceChart').getContext('2d');
    
    // Create a smooth vertical gradient fill matching your primary branding color
    const gradient = ctx.createLinearGradient(0, 0, 0, 180);
    gradient.addColorStop(0, 'rgba(255, 0, 123, 0.35)');
    gradient.addColorStop(1, 'rgba(255, 0, 123, 0.00)');

    window.distanceChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                borderColor: '#ff007b',
                borderWidth: 2.5,
                backgroundColor: gradient,
                fill: true,
                tension: 0.3, // Adds a subtle, premium curvature to line tracks
                pointRadius: 0, // Cleans up layout points unless items are hovered
                pointHoverRadius: 5,
                pointHoverBackgroundColor: '#ff007b'
            }]
        },
        options: globalChartOptions
    });
}

function renderSpeedChart(labels, values) {
    const ctx = document.getElementById('speedChart').getContext('2d');

    window.speedChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: '#ff007b',
                borderRadius: 4, // Adds rounded edges to structural data bars
                barPercentage: 0.6
            }]
        },
        options: globalChartOptions
    });
}