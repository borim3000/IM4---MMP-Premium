<?php
require_once '../system/config.php';

header('Content-Type: application/json');

$host = 'zf2c4d.myd.infomaniak.com';
$db   = 'zf2c4d_premium_im4';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);

    // We only need the absolute newest coordinate, so we ORDER BY zeit DESC and LIMIT 1
    $sql = "SELECT breitengrad, laengengrad, hoehe, zeit FROM sensordata ORDER BY zeit DESC LIMIT 1";
    $stmt = $pdo->query($sql);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        // We found data, send it back
        echo json_encode(["status" => "success", "data" => $result]);
    } else {
        // The table is completely empty
        echo json_encode(["status" => "error", "message" => "No GPS data found"]);
    }

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>