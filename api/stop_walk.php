<?php
require_once '../system/config.php';
header('Content-Type: application/json');

if (!isset($_POST['session_id'])) {
    echo json_encode(["status" => "error", "message" => "Missing session ID"]);
    exit;
}

$sessionId = (int)$_POST['session_id'];
$host = 'zf2c4d.myd.infomaniak.com';
$db   = 'zf2c4d_premium_im4';

// Helper function to process distance between two coordinates in kilometers
function calculateHaversine($lat1, $lon1, $lat2, $lon2) {
    $earthRadius = 6371; // Earth radius in km
    $dLat = deg2rad($lat2 - $lat1);
    $dLon = deg2rad($lon2 - $lon1);
    
    $a = sin($dLat/2) * sin($dLat/2) + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($dLon/2) * sin($dLon/2);
    $c = 2 * atan2(sqrt($a), sqrt(1-$a));
    
    return $earthRadius * $c;
}

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 1. Lock the session end time
    $updateSql = "UPDATE walk_sessions SET end_time = NOW() WHERE session_id = :id";
    $stmt = $pdo->prepare($updateSql);
    $stmt->execute([':id' => $sessionId]);

    // 2. Fetch the timestamps of this specific tracking window
    $sessionSql = "SELECT start_time, end_time FROM walk_sessions WHERE session_id = :id";
    $stmt = $pdo->prepare($sessionSql);
    $stmt->execute([':id' => $sessionId]);
    $session = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$session) {
        throw new Exception("Session profile lost.");
    }

    // 3. Extract all GPS logs inside this timeline window
    $gpsSql = "SELECT breitengrad, laengengrad FROM sensordata WHERE zeit BETWEEN :start AND :end ORDER BY zeit ASC";
    $stmt = $pdo->prepare($gpsSql);
    $stmt->execute([
        ':start' => $session['start_time'],
        ':end'   => $session['end_time']
    ]);
    $points = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $totalDistance = 0.0;
    $pointCount = count($points);

    // Calculate sequential step changes across your route array
    if ($pointCount > 1) {
        for ($i = 0; $i < $pointCount - 1; $i++) {
            $totalDistance += calculateHaversine(
                (float)$points[$i]['breitengrad'], (float)$points[$i]['laengengrad'],
                (float)$points[$i+1]['breitengrad'], (float)$points[$i+1]['laengengrad']
            );
        }
    }

    // 4. Calculate Duration & Speed Metrics
    $startTs = strtotime($session['start_time']);
    $endTs = strtotime($session['end_time']);
    $timeDifferenceHours = ($endTs - $startTs) / 3600;

    $avgSpeed = 0.0;
    if ($timeDifferenceHours > 0 && $totalDistance > 0) {
        $avgSpeed = $totalDistance / $timeDifferenceHours;
    }

    // 5. Commit calculations back into your new walk_sessions ledger row
    $finalSql = "UPDATE walk_sessions SET total_distance = :dist, avg_speed = :speed WHERE session_id = :id";
    $stmt = $pdo->prepare($finalSql);
    $stmt->execute([
        ':dist'  => round($totalDistance, 2),
        ':speed' => round($avgSpeed, 2),
        ':id'    => $sessionId
    ]);

    echo json_encode(["status" => "success", "distance" => round($totalDistance, 2), "speed" => round($avgSpeed, 2)]);

} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>