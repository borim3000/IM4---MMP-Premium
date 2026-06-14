# IM4 - MMP Premium




Kurzbeschreibung des Projekts

    Modul: Interaktive Medien 4 an der Fachhochschule Graubünden (FS26)
    Themenfeld: IoT-Applikation zum Thema Eltern mit kleinen Kindern
    Name des Projekts: MMP Premium CYBERstroller
    Team Physical Computing: Ismael Rehab, Adriel Monostori
    Team WebApp: Robin Luijten

    Welches Problem im Alltag von Eltern mit kleinen Kindern wird gelöst?
        Es vereinfacht die Planung von Spaziergängen mit den Kindern, ermöglicht Tracking von Betreuerinnen bei Spaziergängen und gibt Eltern spannende Statistiken, die motivieren, um mehr raus zu gehen. Zusätzliche module im Arduino könnten mehr Daten ermöglichen.
        
    Was ist der „Sinn und Zweck“ des Systems?
        Überprüfung und Tracking von Spaziergängen 
        Das originale Design (viel komplexer als das resultierende) sollte auch eine satirische Kritik an modernen Smart-Gadgets sein

\[Bilder / GIFs (optional)\]
UX & Konzeption

In diesem Teil werden die gemeinsamen Schritte aus der UX-Abgabe dokumentiert, damit sich hier alles vollständig an einem Ort befindet (betrifft WebApp und Physical Computing)

    Figma: https://www.figma.com/board/DCW7oVrwZR7Qy9EeRlEq1B/IM-4-%E2%80%93-User-Flow-Vorlage--Copy-?node-id=0-1&p=f

            https://www.figma.com/proto/vzD3VlSJz9sWjAdGDCal5r/IM4-CyberKinderwagen-UX?node-id=2-2&p=f&t=J1tIdHHKMXSWiu3Z-0&scaling=scale-down&content-scaling=fixed&starting-point-node-id=2%3A2&show-proto-sidebar=1&page-id=0%3A1

            https://www.figma.com/design/vzD3VlSJz9sWjAdGDCal5r/IM4-CyberKinderwagen-UX?node-id=0-1&p=f&t=5zrs5tR6tsAznMVu-0

    User Flow \+ Screen Flow (Screenshot aus Figma)
<img width="678" height="723" alt="Image" src="https://github.com/user-attachments/assets/ef356774-4a27-4ccf-b896-b08027eac6d2" />
        siehe unser UX dok: https://docs.google.com/document/d/1lo4Hy9YO12mLe8HazbUa6qGRXo4RUq4Lt1QIFqEgjt4/edit?tab=t.0

    Welche Features waren angedacht?
        viele. da die erste idee als satire eines smart gadgets gedacht war, konzipierten wir unnötig viele sensorsen.(ultraschall-distanzsensor, kamera, 
        temperatursensor, etc.)
        auf der app kann man dann die daten der vielen sensoren im detail analysieren.

    Welche Features wurden nicht umgesetzt? (Warum)
        alle ausser der GPS sensor. dieser konnte vielseitig eingesetzt werden und anhand seiner daten konnten wir alles ausrechnen, was wir wollten.
        die features der app blieben etwa so, wie angedacht, einfach nur auf den einen sensor und die wesentlichen statistiken heruntergebrochen. wir limitierten uns, 
        weil es sonst massiv zu viel arbeit geben würde.

Setup

    WebApp: https://im4.mmp-premium.ch/
    Video-Dokumentation: https://www.youtube.com/shorts/R3c0P77zBJI

Installationsanleitung WebApp

verständliche Schritt-für-Schritt-Anleitung für Aussenstehende, um das Projekt zu klonen und auf einem eigenen Server zu installieren

    Was benötige ich an Infrastruktur?
        Nutzerkonto bei Infomaniak mit webhosting
        Github (duh), VScode mit SFTP-plugin

    Was muss ich auf meinem Webserver installieren?
        nichts zusätzliches, infomaniak hat alles wesentliche 
        (phpmyadmin, mysql, ftp-zugang etc)

    Wie kann ich die Datenbank importieren?
        per SQL für die folgenden tabellen:

        users:
            CREATE TABLE users (
                id INT NOT NULL AUTO_INCREMENT,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                PRIMARY KEY (id)
            );

        sensordaten:
            CREATE TABLE sensordata (
                ID INT NOT NULL AUTO_INCREMENT,
                wert DECIMAL(8, 2),
                breitengrad DECIMAL(10, 8) NOT NULL,
                laengengrad DECIMAL(11, 8) NOT NULL,
                hoehe DECIMAL(8, 2),
                satelliten INT,
                zeit DATETIME NOT NULL,
                PRIMARY KEY (ID)
            );

        walksessions:
            CREATE TABLE walk_sessions (
                session_id INT NOT NULL AUTO_INCREMENT,
                user_id INT NOT NULL,
                stroller_id INT NOT NULL,
                start_time DATETIME NOT NULL,
                end_time DATETIME,
                total_distance DECIMAL(8, 2) DEFAULT 0.00,
                avg_speed DECIMAL(8, 2) DEFAULT 0.00,
                PRIMARY KEY (session_id)
            );

    Wo muss ich die DB-Credentials eintragen?
        config.php: nutze die vorlage config.php.blank
    …
    Wie nehme ich das physische Artefakt in Betrieb?
        konto in der app erstellen und einloggen. unter der kartenansicht gibt es einen live-standort und einen start-button. beim drücken wird ein spaziergang 
        gestartet und aufgezeichnet. wird der button nochmals (stopp) gedrückt, wird der spaziergang beendet und auf der statistik-page gespeichert und angezeigt.

Bauanleitung Physical Computing

    Was muss ich wie bauen, verbinden, installieren?
    ergänze: Komponentenplan (betrifft Physical Computing, vgl. Slides Kapitel 15): Schaubild enthält
    die eingesetzten Komponenten
    die verbundenen Sensoren und Aktoren
    die Programme (mit Dateinamen)
    die Kommunikationswege
    ergänze: Steckplan (betrifft Physical Computing, vgl. Slides Kapitel 15): generiert z.B. mit Fritzing (empfohlen), Tinkercad, Wokwi
    beachtet die Fritzing Parts extra für euch
    ggf. Bildmaterial

    1. Komponentenplan

        Unser System besteht aus zwei Hauptbereichen: Der Hardware (dem Sender) und einem Webserver mit einer Datenbank (dem Empfänger). Die Hardware erfasst die Positionsdaten und übermittelt diese über das Internet an den           Server, wo sie dauerhaft gespeichert werden.
    
        Eingesetzte Komponenten
        Mikrocontroller: Ein ESP32-C6. Dies ist ein kompakter und leistungsfähiger Minicomputer. Er verfügt über integrierte WLAN- und Bluetooth-Schnittstellen zur Datenübertragung und wird über einen USB-C-Anschluss                  programmiert und mit Strom versorgt.
        Sensor: Ein NEO-8M GPS-Modul inklusive einer quadratischen Keramik-Antenne. Dieses Modul empfängt Signale von GPS-Satelliten, um den exakten Standort zu bestimmen.
        Netzwerkanbindung (Mobilfunk-Simulation): Für den echten, ortsunabhängigen Einsatz ist zukünftig ein SIM-Karten-Modul direkt am ESP32 geplant. Im aktuellen Projektschritt wurde diese mobile Freiheit erfolgreich                simuliert, indem sich der ESP32 mit dem WLAN-Hotspot eines Smartphones verbindet.
        Verbundene Sensoren und Aktoren
        Das GPS-Modul arbeitet als Sensor und liefert dem System den Breitengrad, den Längengrad, die Höhe über dem Meeresspiegel sowie die Anzahl der aktuell verbundenen Satelliten.
        Da das GPS-Modul in geschlossenen Räumen systembedingt oft keine Satelliten findet, wurde im Programmcode zusätzlich ein „virtueller Sensor“ integriert. Dieser generiert automatisch Zufallswerte zwischen 0 und 100.            Dadurch lässt sich auch bei fehlendem GPS-Signal überprüfen, ob der Datenfluss und die Verarbeitung korrekt funktionieren.
        Programme und Dateien
        esp32_gps_sender.ino: Der in der Arduino-Entwicklungsumgebung geschriebene Programmcode, der direkt auf dem ESP32-Chip läuft.
        load.php: Ein PHP-Skript, das auf dem Webserver unter https://im4.mmp-premium.ch/api/load.php bereitliegt. Es wartet aktiv auf eingehende Datenpakete des ESP32.
        Kommunikationswege
        Kabel-Weg (Hardware): Das GPS-Modul sendet seine Rohdaten über eine serielle Kabelverbindung direkt an den ESP32-Chip.
        Funk-Weg (Internet): Der ESP32 verbindet sich mit dem WLAN-Hotspot und sendet die aufbereiteten Daten als HTTP-POST-Anfrage über das Internet an die load.php-Datei auf dem Server.
        
    2. Steckplan & Technische Details
        Die Komponenten wurden für den Prototypen auf einem Steckbrett (Breadboard) mithilfe von Jumper-Kabeln miteinander verbunden.
        Verkabelung
        Stromversorgung: Die Pins VCC (Strom-Eingang) und GND (Masse/Minuspol) des GPS-Moduls sind mit den entsprechenden Strom-Pins des ESP32 verbunden.
        Datenleitungen: Die Kommunikation erfolgt über Kreuz per UART-Schnittstelle. Der Sende-Pin (TX) des GPS-Moduls führt zum Empfangs-Pin (GPIO 6) des ESP32. Der Sende-Pin (GPIO 7) des ESP32 führt zum Empfangs-Pin (RX)            des GPS-Moduls.
        Software-Bibliotheken
        Damit der ESP32 die komplexen Rohdaten des GPS-Moduls verarbeiten kann, wurden in der Arduino-Software zwei Hilfswerkzeuge (Bibliotheken) integriert:
        <TinyGPS++.h>: Übersetzt die kryptischen Satelliten-Datenströme in lesbare Koordinaten.
        <Arduino_JSON.h>: Verpackt die extrahierten Werte in ein standardisiertes Datenformat.

             Steckplan und ESP/GPS Bilder (resources/assets)      

        
        
    3. Projektstruktur & Datenfluss
    
        Der Weg eines Messwertes lässt sich in vier Schritten abbilden:
        Sammeln (esp32_gps_sender.ino): Das GPS-Modul sendet kontinuierlich Daten an den ESP32. Der Code filtert diese und prüft, ob ein gültiges Satellitensignal vorliegt.
        Einpacken: Alle 15 Sekunden isoliert der ESP32 die aktuellen Standortdaten sowie den Wert des virtuellen Sensors und verpackt sie in das strukturierte JSON-Format (vergleichbar mit einer digitalen, standardisierten            Liste).
        Abschicken: Der ESP32 baut die Internetverbindung auf und sendet das JSON-Paket per HTTP-POST an die Serveradresse der load.php.
        Einsortieren (load.php): Das Server-Skript nimmt das Paket an, validiert die Vollständigkeit und schreibt die Werte mittels eines SQL-Befehls in die Datenbank-Tabelle sensordata.
        Datenschnittstelle (JSON-Format)
        Die Kommunikation zwischen ESP32 und Server basiert auf folgendem standardisierten JSON-Format:
        JSON
        {
          "wert": 43.00,
          "latitude": 46.964679,
          "longitude": 7.457919,
          "altitude": 548.90,
          "satellites": 9
        }
        
    4. Datenbankmodell (ERM) & Sicherheit
    
        Datenbankstruktur
        Die Datenbank besteht aus einer einzelnen, fortlaufenden Tabelle namens sensordata. Da es sich um eine reine Protokollierung (Logging) handelt, sind keine komplexen Tabellenverknüpfungen notwendig.
        Die Spalten der Tabelle:
        ID: Ein eindeutiger, sich automatisch hochzählesnder Primärschlüssel (Auto-Increment) für jeden Eintrag.
        wert: Der Wert des simulierten virtuellen Sensors.
        breitengrad / laengengrad / hoehe: Die geografischen Echtzeit-Koordinaten des GPS-Moduls.
        satelliten: Anzahl der genutzten Satelliten (Qualitätsmerkmal der Messung).
        zeit: Ein automatischer Zeitstempel (Timestamp), den die Datenbank beim Eintrag generiert. Ermöglicht die chronologische Sortierung.
        Authentifizierung und Sicherheit
        Aktuell verfügt die Schnittstelle über keine aktive Zugriffskontrolle. Das PHP-Skript prüft lediglich, ob das empfangene Paket Daten enthält; leere Anfragen werden abgewiesen.
        Zukunftsausblick: Für den produktiven Einsatz im echten Leben müsste eine Absicherung über einen geheimen API-Schlüssel (Token) implementiert werden. Der ESP32 müsste diesen Schlüssel bei jeder Übertragung mitsenden,          damit der Server den Schreibzugriff autorisiert.
    
    5. Bekannte Einschränkungen (Known Bugs) & Optimierungspotenzial
    
        Verlust des GPS-Signals in Innenräumen: Wände blockieren die Satellitensignale. Ohne Satellitenkontakt liefert der Code die Koordinaten 0.0, was zu fehlerhaften Einträgen in der Datenbank führt. Hat das Modul jedoch           im Freien erst einmal einen stabilen Kontakt („Fix“) aufgebaut, reichen in Fensternähe oft auch schwächere Signale aus.
        Optimierung: Der Server (oder der ESP32) sollte so programmiert werden, dass Datensätze mit den Koordinaten 0.0 automatisch verworfen und gar nicht erst in die Datenbank geschrieben werden. Für ein kommerzielles               Produkt sollte zudem ein empfindlicheres GPS-Modul gewählt werden.
        Blockierende WLAN-Suchschleife: Bei einem Verbindungsabbruch versucht der ESP32 im aktuellen Code 30-mal im Abstand von je 0,5 Sekunden, das WLAN wiederherzustellen. Während dieser 15 Sekunden ist der Hauptprozess             blockiert, sodass keine neuen GPS-Daten eingelesen werden können.
        Optimierung: Die WLAN-Verbindungsprozedur sollte asynchron (im Hintergrund) oder über das Event-System des ESP32 gelöst werden, damit die Datenerfassung parallel flüssig weiterläuft.
        

    

technische Details

// Hier sollte das Verständnis ersichtlich sein / Wie stehen die Dateien in Beziehung zueinander, Wie reden Die Dateien miteinander, Wie ist der Weg der Daten

    Projektstruktur / Code-Struktur: \[Hinweis: Der Code selbst muss im Repository liegen und im Kopfbereich jeder Datei eine kurze Zusammenfassung enthalten.\]
        struktur ist im repository sichtbar. hier haben wir uns an die vorlage der dozenten gehalten, und alles bis auf die html-dateien haben ihren eigenen ordner, je nach filetype.
    Datenschnittstelle: \[zwischen WebApp und Physical Computing\]
        die datenschnittstelle ist primär die datenbank. der sensor nimmt immer auf (wichtig für livestandort) und lädt alles hoch, und das backend der app rechnet
        alles anhand der koordinaten aus und zeigt es dann im frontend an.

ERM: \[Erklärung und Schaubild\]

    +-------------------------+            +-------------------------+
    |          USER           |            |        STROLLER         |
    +-------------------------+            +-------------------------+
    | PK  user_id             | 1        N | PK  stroller_id         |
    |     email               |------------| FK  user_id             |
    |     password_hash       |            |     name                |
    |     created_at          |            |     status              |
    +-------------------------+            +-------------------------+
                | 1                                    | 1
                |                                      |
                |                                      |
                | N                                    | N
    +-------------------------+                         |
    |      WALK_SESSION       |<------------------------+
    +-------------------------+
    | PK  session_id          |
    | FK  user_id             |
    | FK  stroller_id         |
    |     start_time          |
    |     end_time            |
    |     total_distance      |
    |     avg_speed           |
    +-------------------------+
                | 1
                |
                | N
    +-------------------------+
    |       SENSORDATA        |
    +-------------------------+
    | PK  data_id             |
    | FK  session_id          |
    |     zeit                |
    |     breitengrad         |
    |     laengengrad         |
    |     hoehe               |
    +-------------------------+

Authentifizierung: \[Erklärung\]
    die authentifizierung findet über die von den dozenten bereitgestellten funktionen statt (registration & login). nur eingeloggte user können die kartenansicht und statistik sehen. 

Known bugs

    Was funktioniert noch nicht einwandfrei?
        alle einstellungen bei der profilpage sind platzhalter. hier würde in einer echten app alles ausgebaut werden

    Was ist uns aufgefallen bei der Entwicklung?
        integrierte physical computing gadgets mit webapps und user databases sind etwa so komplex wie wir uns vorgestellt haben. wir haben nur die oberfläche der möglichkeiten angekratzt

    Was könnte noch verbessert werden?
        mehr sensoren für detailliertere statistiken wären cool gewesen

    Siehe oben bei physical computing für detaillierte verbesserungen

Umsetzungsprozess

Reflexion / Erfahrung / Lernfortschritt: Was haben wir gelernt? Würden wir es nochmal genauso machen? Was war gut, was war schlecht?

lernfortschritt webapp:
    dieses projekt war anspruchsvoll. einerseits da ich den webapp-teil alleine machte, andererseits auch wegen dem umfang mit den echtzeitdaten, die wir selbst 
    sammelten. trotzdem bin ich etwas froh, den teil alleine zu machen. ich würde mir sorgen machen wegen merge conflicts über github und unklarheiten, wer was macht. alleine konnte ich den überblick des projekts sehr gut behalten. 
    beim gesamten projekt habe ich gut aufgenommen, wie die schnittstellen zwischen sensor, datenbank, berechnung der daten, den frontend und der darstellung von daten in grafiken und kartenansichten zusammenspielen und funktionieren. es war auch spannend zu lernen, wie nutzerdaten erstellt und im backend gespeichert werden.

Lernfortschritt Physical Computing:
    Da ich vor dem Projekt keinerlei Berührungspunkte mit Physical Computing und auch kein Interesse daran hatte, war es für mich erst etwas schwierig, den Start zu finden und mich dafür zu motivieren. Die Unterstützung von den Dozierenden war für mich eine sehr grosse Hilfe. Ausserdem konnte ich auch bei meinem Mitbewohner, welcher Elektrotechnik studiert, nachfragen, was mir zusätzliche Sicherheit gab. Nun kann ich sagen, dass ich verstehe, wie ich mit Sensoren Daten sammeln und diese digital darstellen kann. Ich verstehe die Prozesse in unserem Prototyp und weiss, wann an welcher Schraube zu drehen ist. Das ist ein sehr erfüllendes Gefühl.
        
Herausforderungen & Lösungen: \[Verworfene Ansätze, Fehler, Umplanungen\]
    die eigentliche idee zuerst war viel zu anspruchsvoll mit zu vielen sensoren. hier mussten wir radikal zurückschrauben. wir brauchten eine weile und 
    coachings, um herauszufinden, was der beste sensor für dieses projekt ist. Was sicherlich zu erwähnen ist, ist, dass wir zu spät gemerkt haben, dass wir unser Modul Autark gestalten müssen und daher das Simkartenmodul nichmehr einbauen konnten. Nichtsdestotrotz konnten wir usner ESP gut und Anwendungsgetreu testen und sind mit dem Ergebnis zufrieden. 
    
KI-Einsatz: Dokumentation der verwendeten KI-Tools und deren Nutzen (KI ist nicht verboten)
    zur KI: während gemini und copilot grosse hilfen waren mit funktionen und fehlerfindung, ist es mir wichtig, nicht komplett der KI zu vertrauen und mich auf 
    sie zu verlassen. zwischen dem start von IM4 und der abgabe des projekts wechselte copilot auf ein token-basiertes zahlungsmodell. danach verwendete ich es 
    nicht mehr. gemini hatte auch probleme, mit halluzinationen von fehlern die es nicht gab und sogar einem nachmittag, an dem es komplett ausstieg (scheinbar
    war dies ein globales problem der KI). hier war es mir sehr wichtig, dass ich den menschlichen input und die kontrolle behielt und nicht einfach machte, was 
    die KI ausspuckte. es war ein konstantes back and forth zwischen code, KI-inputs und überprüfen des resultats, damit die app unserer vorstellung gleichte und 
    nicht etwas ist, was die KI erstellt hat.
Fazit: …
    ein anspruchsvolles projekt, bei welchem wir viele ansprüche des Webdev und Appdev gelernt haben. der einblick in die funktionen hinter diesen anwendungen war spannend.
