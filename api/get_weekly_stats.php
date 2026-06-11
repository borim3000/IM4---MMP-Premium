<?php
require_once '../system/config.php';
header('Content-Type: application/json');

$host = 'zf2c4d.myd.infomaniak.com';
$db   = 'zf2c4d_premium_im4';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Ask the database for the sum of all distances tracked over the last 7 days
    $sql = "SELECT SUM(total_distance) as weekly_dist 
            FROM walk_sessions 
            WHERE start_time >= NOW() - INTERVAL 7 DAY";
    
    $stmt = $pdo->query($sql);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    // If there is data, format it to always have two decimal places (e.g., "12.50"). 
    // If the database returns null, default to "0.00".
    $distance = $row['weekly_dist'] ? round((float)$row['weekly_dist'], 2) : 0.00;

    echo json_encode([
        "status" => "success", 
        "distance" => number_format($distance, 2, '.', '')
    ]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>