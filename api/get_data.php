<?php
require_once '../system/config.php';

header('Content-Type: application/json'); // this is json data
$host = 'zf2c4d.myd.infomaniak.com';
$db   = 'zf2c4d_premium_im4';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);

    //sql query to get data from database
    $stmt = $pdo->query("SELECT * FROM sensordata ORDER BY zeit DESC");
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($results); //send data back to js
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>