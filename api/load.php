<?php
 /*****************************************************
  * Kapitel 12: Website2DB > Schritt 2: Website -> DB
  * load.php
  * Empfängt Sensor- und GPS-Daten vom ESP32-C6 und speichert sie in der DB
  **************************************************/

require_once("../system/config.php");

###################################### Empfangen der JSON-Daten

$inputJSON = file_get_contents('php://input'); // JSON-Daten aus dem Body der Anfrage
$input = json_decode($inputJSON, true); 

// Falls überhaupt keine Daten ankommen, abbrechen
if (empty($input)) {
    http_response_code(400);
    die("Keine Daten empfangen");
}

###################################### Daten auslesen & vorbereiten

// Sensorwert auslesen
$wert = isset($input["wert"]) ? floatval($input["wert"]) : 0.0;

// GPS-Daten auslesen (wenn nicht vorhanden, z.B. kein Fix, wird NULL eingetragen)
$breitengrad = isset($input["latitude"]) ? floatval($input["latitude"]) : null;
$laengengrad = isset($input["longitude"]) ? floatval($input["longitude"]) : null;
$hoehe       = isset($input["altitude"]) ? floatval($input["altitude"]) : null;
$satelliten  = isset($input["satellites"]) ? intval($input["satellites"]) : 0;


###################################### In die Datenbank einfügen (PDO)

// SQL-Befehl mit Platzhaltern (?) für die neuen deutschen Spalten
$sql = "INSERT INTO sensordata (wert, breitengrad, laengengrad, hoehe, satelliten) VALUES (?, ?, ?, ?, ?)";

$stmt = $pdo->prepare($sql); 

// Das Array muss exakt mit den Fragezeichen (?) im SQL-Befehl übereinstimmen
$stmt->execute([
    $wert, 
    $breitengrad, 
    $laengengrad, 
    $hoehe, 
    $satelliten
]);

// Kleine Erfolgsmeldung an den ESP32 zurücksenden
echo "Daten erfolgreich gespeichert!";
?>