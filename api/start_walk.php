<?php
require_once '../system/config.php';
header('Content-Type: application/json');

$host = 'zf2c4d.myd.infomaniak.com';
$db   = 'zf2c4d_premium_im4';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Initialize session with the current server time
    $sql = "INSERT INTO walk_sessions (start_time) VALUES (NOW())";
    $pdo->query($sql);
    
    // Grab the ID of the row we just generated
    $sessionId = $pdo->lastInsertId();

    echo json_encode(["status" => "success", "session_id" => $sessionId]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>