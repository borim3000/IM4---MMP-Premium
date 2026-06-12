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
    (/resources/assets/userflow.png)

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
    Video-Dokumentation: Link zum Video auf Youtube folgt

Installationsanleitung WebApp

verständliche Schritt-für-Schritt-Anleitung für Aussenstehende, um das Projekt zu klonen und auf einem eigenen Server zu installieren

    Was benötige ich an Infrastruktur?
        Nutzerkonto bei Infomaniak mit webhosting
    Was muss ich auf meinem Webserver installieren?
        nichts zusätzliches, infomaniak hat alles wesentliche 
    Wie kann ich die Datenbank importieren?
        per SQL für die folgenden tabellen:
        users:
        sensordaten:
        walksessions:
    Wo muss ich die DB-Credentials eintragen?
        config.php:
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
        
    Was könnte noch verbessert werden?
        mehr sensoren für detailliertere statistiken wären cool gewesen

Umsetzungsprozess

    Reflexion / Erfahrung / Lernfortschritt: Was haben wir gelernt? Würden wir es nochmal genauso machen? Was war gut, was war schlecht?
        lernfortschritt webapp:
        dieses projekt war anspruchsvoll. einerseits da ich den webapp-teil alleine machte, andererseits auch wegen dem umfang mit den echtzeitdaten, die wir selbst 
        sammelten. trotzdem bin ich etwas froh, den teil alleine zu machen. ich würde mir sorgen machen wegen merge conflicts über github und unklarheiten, wer was macht. alleine konnte ich den überblick des projekts sehr gut behalten. 
        beim gesamten projekt habe ich gut aufgenommen, wie die schnittstellen zwischen sensor, datenbank, berechnung der daten, den frontend und der darstellung von daten in grafiken und kartenansichten zusammenspielen und funktionieren. es war auch spannend zu lernen, wie nutzerdaten erstellt und im backend gespeichert werden.
    Herausforderungen & Lösungen: \[Verworfene Ansätze, Fehler, Umplanungen\]
        die eigentliche idee zuerst war viel zu anspruchsvoll mit zu vielen sensoren. hier mussten wir radikal zurückschrauben. wir brauchten eine weile und 
        coachings, um herauszufinden, was der beste sensor für dieses projekt ist.
    KI-Einsatz: Dokumentation der verwendeten KI-Tools und deren Nutzen (KI ist nicht verboten)
        zur KI: während gemini und copilot grosse hilfen waren mit funktionen und fehlerfindung, ist es mir wichtig, nicht komplett der KI zu vertrauen und mich auf 
        sie zu verlassen. zwischen dem start von IM4 und der abgabe des projekts wechselte copilot auf ein token-basiertes zahlungsmodell. danach verwendete ich es 
        nicht mehr. gemini hatte auch probleme, mit halluzinationen von fehlern die es nicht gab und sogar einem nachmittag, an dem es komplett ausstieg (scheinbar
        war dies ein globales problem der KI). hier war es mir sehr wichtig, dass ich den menschlichen input und die kontrolle behielt und nicht einfach machte, was 
        die KI ausspuckte. es war ein konstantes back and forth zwischen code, KI-inputs und überprüfen des resultats, damit die app unserer vorstellung gleichte und 
        nicht etwas ist, was die KI erstellt hat.
    Fazit: …
        ein anspruchsvolles projekt, bei welchem wir viele ansprüche des Webdev und Appdev gelernt haben. der einblick in die funktionen hinter diesen anwendungen war spannend.