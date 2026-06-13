<?php
require_once '../system/config.php';

header('Content-Type: application/json');
$host = 'zf2c4d.myd.infomaniak.com';
$db   = 'zf2c4d_premium_im4';

// Check if an ID was actually sent
if (!isset($_POST['ID'])) {
    echo json_encode(["status" => "error", "message" => "No ID provided"]);
    exit;
}

$ID = $_POST['ID'];

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);

    // Prepare and execute the delete statement securely
    $sql = "DELETE FROM sensordata WHERE ID = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$ID]);

    echo json_encode(["status" => "success"]);
} catch (Throwable $e) { 
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}

?> 