<?php
require_once '../system/config.php';

header('Content-Type: application/json'); // this is json data
$host = 'zf2c4d.myd.infomaniak.com';
$db   = 'zf2c4d_premium_im4';

// 1. Grab limit and offset from the URL request. If missing, default to 150 and 0.
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 150;
$offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);

    // 2. Add LIMIT and OFFSET to the SQL query securely using prepared statements
    $sql = "SELECT * FROM sensordata ORDER BY zeit DESC LIMIT :limit OFFSET :offset";
    $stmt = $pdo->prepare($sql);
    
    // PDO requires explicit integer casting for limits, so we use bindParam
    $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();

    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($results); 
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>