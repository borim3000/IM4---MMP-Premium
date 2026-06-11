<?php
require_once '../system/config.php';
header('Content-Type: application/json');

if (!isset($_GET['session_id'])) {
    echo json_encode(["status" => "error", "message" => "No session ID provided."]);
    exit;
}

$sessionId = (int)$_GET['session_id'];
$host = 'zf2c4d.myd.infomaniak.com';
$db   = 'zf2c4d_premium_im4';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);

    // 1. Get the session summary
    $stmt = $pdo->prepare("SELECT * FROM walk_sessions WHERE session_id = :id");
    $stmt->execute([':id' => $sessionId]);
    $session = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$session) {
        throw new Exception("Session not found.");
    }

    // 2. Fetch the actual route coordinates and altitude from the sensor table
    $stmt2 = $pdo->prepare("SELECT breitengrad, laengengrad, hoehe, zeit FROM sensordata WHERE zeit BETWEEN :start AND :end ORDER BY zeit ASC");
    $stmt2->execute([
        ':start' => $session['start_time'],
        ':end'   => $session['end_time'] ?? date('Y-m-d H:i:s') // If still active, fetch up to right now
    ]);
    
    $points = $stmt2->fetchAll(PDO::FETCH_ASSOC);

    // 3. Find the maximum altitude from the walk
    $maxAltitude = 0;
    foreach ($points as $pt) {
        if ((float)$pt['hoehe'] > $maxAltitude) {
            $maxAltitude = (float)$pt['hoehe'];
        }
    }

    echo json_encode([
        "status" => "success",
        "session" => $session,
        "max_altitude" => $maxAltitude,
        "route" => $points
    ]);

} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>