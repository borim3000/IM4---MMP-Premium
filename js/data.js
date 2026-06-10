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
                    <div class="site-box box-full route-box">
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