<?php
//database credentials
require_once '../system/config.php';

$host = 'zf2c4d.myd.infomaniak.com';
$db   = 'zf2c4d_premium_im4';  

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);

    // get data from JS fetch request
    $wert = $_POST['wert'];

    // insert data into database using SQL's native NOW() function for the time
    $sql = "INSERT INTO sensordata (wert, zeit) VALUES (?, NOW())";
    $stmt = $pdo->prepare($sql);
    
    // only need to pass $wert, because NOW() handles the time automatically
    $stmt->execute([$wert]);

    echo json_encode(["status" => "success"]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>