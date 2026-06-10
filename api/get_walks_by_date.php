<?php
require_once '../system/config.php';
header('Content-Type: application/json');

if (!isset($_GET['date'])) {
    echo json_encode(["status" => "error", "message" => "No date specified."]);
    exit;
}

$selectedDate = $_GET['date'];
$host = 'zf2c4d.myd.infomaniak.com';
$db   = 'zf2c4d_premium_im4';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 1. Fetch all tracking sessions recorded on the given day
    $sql = "SELECT session_id, start_time, end_time, total_distance, avg_speed 
            FROM walk_sessions 
            WHERE DATE(start_time) = :date 
            ORDER BY start_time ASC";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':date' => $selectedDate]);
    $walks = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $totalDistance = 0.0;
    $totalSeconds = 0;

    // 2. Loop and construct presentation timestamps for each route box
    foreach ($walks as &$walk) {
        $totalDistance += (float)$walk['total_distance'];
        
        if ($walk['end_time']) {
            $duration = strtotime($walk['end_time']) - strtotime($walk['start_time']);
            $totalSeconds += $duration;
            
            $h = floor($duration / 3600);
            $m = floor(($duration % 3600) / 60);
            $walk['duration_text'] = ($h > 0 ? "{$h}h " : "") . "{$m}m";
        } else {
            $walk['duration_text'] = "Aktiv...";
        }

        // Clock formats (e.g., "14:32")
        $walk['clock_start'] = date('H:i', strtotime($walk['start_time']));
        $walk['clock_end'] = $walk['end_time'] ? date('H:i', strtotime($walk['end_time'])) : 'Aktiv';
    }

    // 3. Compute aggregate summary metrics for the page header widgets
    $globalAvgSpeed = 0.0;
    if ($totalSeconds > 0 && $totalDistance > 0) {
        $globalAvgSpeed = $totalDistance / ($totalSeconds / 3600);
    }

    $aggHours = floor($totalSeconds / 3600);
    $aggMinutes = floor(($totalSeconds % 3600) / 60);

    echo json_encode([
        "status" => "success",
        "summary" => [
            "avg_speed" => round($globalAvgSpeed, 1) . " km/h",
            "total_time" => "{$aggHours}h {$aggMinutes}m",
            "total_distance" => round($totalDistance, 2) . " km"
        ],
        "walks" => $walks
    ]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>