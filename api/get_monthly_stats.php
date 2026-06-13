<?php //test
require_once '../system/config.php';
header('Content-Type: application/json');

$host = 'zf2c4d.myd.infomaniak.com';
$db   = 'zf2c4d_premium_im4';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 1. Generate a dataset sequence mapping out every date over the last 30 days
    $dates = [];
    for ($i = 29; $i >= 0; $i--) {
        $dates[date('Y-m-d', strtotime("-$i days"))] = [
            'distance' => 0.0,
            'total_seconds' => 0,
            'speed' => 0.0
        ];
    }

    // 2. Extract calculations compiled across tracking windows in that period
    $sql = "SELECT DATE(start_time) as walk_date, total_distance, start_time, end_time, avg_speed 
            FROM walk_sessions 
            WHERE start_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            ORDER BY start_time ASC";
    
    $stmt = $pdo->query($sql);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 3. Aggregate session summaries into their respective date points
    foreach ($rows as $row) {
        $dateKey = $row['walk_date'];
        if (isset($dates[$dateKey])) {
            $dates[$dateKey]['distance'] += (float)$row['total_distance'];
            
            if ($row['end_time']) {
                $seconds = strtotime($row['end_time']) - strtotime($row['start_time']);
                $dates[$dateKey]['total_seconds'] += $seconds;
            }
        }
    }

    // 4. Calculate true weighted daily average speeds
    $labels = [];
    $distances = [];
    $speeds = [];

    foreach ($dates as $date => $metrics) {
        // Format presentation label (e.g. "11. Jun")
        $labels[] = date('d. M', strtotime($date));
        $distances[] = round($metrics['distance'], 2);

        $dailySpeed = 0.0;
        if ($metrics['total_seconds'] > 0 && $metrics['distance'] > 0) {
            $dailySpeed = $metrics['distance'] / ($metrics['total_seconds'] / 3600);
        }
        $speeds[] = round($dailySpeed, 1);
    }

    echo json_encode([
        "status" => "success",
        "labels" => $labels,
        "distances" => $distances,
        "speeds" => $speeds
    ]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>