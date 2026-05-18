<?php
//database credentials
require_once 'system/config.php';


$host = 'zf2c4d.myd.infomaniak.com';
$db   = 'zf2c4d_premium_data';  
$user = $user;
$pass = $pass;

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);

    // get data from JS fetch request
    $speed = $_POST['speed'];
    $temp = $_POST['temp'];
    $loc = $_POST['loc'];

    // insert data into database
    $sql = "INSERT INTO premium_data (speed, temp, loc) VALUES (?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$speed, $temp, $loc]);

    echo json_encode(["status" => "success"]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>