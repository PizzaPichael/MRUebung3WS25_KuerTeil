= Abschlussdokumentation <abschlussdoku>

== Entwicklungsumgebung
Die Projektszene wurde mit dem auf ThreeJS und WebXR aufbauenden MR-Framework A-Frame erstellt. Dieses nutzt HTML und Javascript um MR-Szenen zu inszenieren. 
Entwickelt wurde das Projekt in einer Windows-Umgebung.
Das HMD mit dem die Entwicklung getestet wurde und für das das Projekt vorgesehen ist, ist die Meta Quest 3. 

== Abschließende Szene <abschluss>
Die unter @themenvorschlag vorgeschlagene Szene konnte ich in ihrem Umfang nicht umsetzen. Welche Gründe dazu geführt haben werden im späteren Verlauf unter @probleme thematisiert.
Die endgültige Szene teilt sich in zwei Teile auf. Die VR-Entities und die AR-Entities. Beide Szenen-Teile haben gemeinsame, dass sie sich grundsätzlich nur mit Controllern des HMD vollständig bedienen lassen. Ein Bewegen in der Szene ist zwar auch im Desktopmodus möglich, es kann aber nicht über die Interaktions-Arten Bewegung und Umschauen hinaus mit der Szene interagiert werden.

Werden Controller genutzt, werden diese in beiden Szene-Teilen mit digitalen Modellen der Controller repräsentiert. 

=== VR-Entities
In dieser Szene stehen User*innen in einem großen, überdimensionalen Thronsaal. Links und rechts der Kamera befinden sich Säulen, vor denen kleinere Fackel-Säulen stehen. Über diesen sich flackernde Lichtquellen platziert um den Anschein von Fackellicht zu erzeugen. Hinter den Säulen sind große Fenster in den Wänden eingelassen, die den Anschein erwecken sollen, dass außerhalb des Thronsaals noch mehr existiert. Hinter der Kamera befindet sich ein großes, geschlossenes Holztor. Alles in diesem Thronsaal ist so diemnsioniert, dass sich User*innen klein vorkommen sollen, als ob dieser Thronsaal nicht für sie, sondern für etwas oder jemand größeren und wichtigeren als sie erbaut wurde. 

Die Kamera blickt zu Beginn der Szene direkt auf den Altar. Dieser steht auf einer mit Stufen versehenen Empore. Die Stufen sind so ebenfalls so skalliert, dass sie den Anschein erzeugen nicht von den User*innen bestiegen werden zu können, ohne große Körperliche Anstrengungen durch Klettern auf sich nehmen zu müssen. 

Der Altar ist ein prunkvoller, hözerner Altar. Über diesem schwebt ein Computer, der sich in einer wiederholenden auf und ab Bewegung befindet und das Logo von ChatGPT mit einer sich wiederholenden rotierenden Animation abbildet. Die Empore wird von zwei weiteren Fackel-Säulen gesäumt und hinter dem Altar hängen zwei zuseite gezogene rote Vorhänge sowie ein weiß, gelblich durchsichtiger Vorhang.

Vor der Empore steht ein steinernes Podest, auf dem sich eine wie Papier aussehende Fläche befindet. Das Podest wird von einem warmen gelben Licht erleuchtet.

Nähert man sich der Empore und somit auch dem Computer fängt dieser in einem bestimmten Radius an kontinuierlich die Kamera zu verfolgen, was den Anschein erweckt, von diesem beobachtet zu werden. Nähert man sich noch weiter, und geht auf das Podest zu erhebt sich das Papier auf dem Podest und schwebt nun über dem Podest. Auf dem Papier befindet sich ein ChatGPT-ähnliches UI mit einem blinkenden CUrser in der Texteingabe-Zeile um zu suggerieren, dass hier Text eingegeben werden kann. Klickt man mit dem Raycaster auf diese Texteingabe-Zeile, erscheinen zwei Beispielprompts, die mit dem Raycaster angewählt werden können. Je nach Auswahl wird auf dem Papier ein kurzer, vorgegebener Chatverlauf angezeigt.

User*innen haben die Möglichkeit um die Empore herum und in den sich dahitner befindenden Gang zu gehen. In diesem sieht man Bereits am Ende des Ganges einen Raum mit schwarzen Wänden, hier auch Blackbox genannt, und einigen fliegenden Objekten darin. Vom Ende des Ganges aus führt ein eingezäunter Pfad auf die Mitte des schwarzen Raumes zu, dort befindet sich ein Stromgenerator mit einer Überdimensionierten Steckdose und einem darin steckenden Stecker. Ein Scheinwerfer scheint vom Raumeingang her auf die sich in der Mitte des Raumes befindliche Steckdose.

Die fliegenden Objekte sind Plane-Objekte, die alle jeweils mit einem mit negativen gesellschaftlichen Folgen der KI-Ära assoziierten Begriff versehen sind. Sie bewegen sich sich in Kreis/Helixform um die Mitte des Raumes auf und ab und richten ihre Frontseite mit dem Text auf das Generator Objekt, als ob sie dieses anschauen würden. Beweget sich die Kamera in den Raum hinein, schauen die Planes die Kamera an, bewegen sich aber weiterhin kreisend um die Mitte des Raums. Nähert sich die Kamere weiter erstarren sie in der Luft und schauen nun nur noch die Kamera an.

Der Stecker in der Steckdose lässt sich mit per Controllerinteraktion aus der Steckdose ziehen. Wenn man dies tut, teleportiert sich der Computer auf dem Altar vom Altar herunter auf die Stufen der Empore, so als ob ihm der Strom abgestellt wurde und er wortwörtlich abgestürzt wäre.

=== AR-Entities
Die Szene beinhaltet folgende identische Objekte wie die VR-Szene:
- Computer
- Podest mit ChatGPT-UI
- Kleiner Generator mit Steckdose und Stecker
- Fliegende Planes mit Stichworten

Der Hauptunterschied ist, dass diese Objekte anders angeordnet sind, sowie der Thronsaal nicht angezeigt wird, wodurch die Umgebung der User*innen mit entsprechenden HMDs gesehen werden kann.

Was die Platzierung der Objekte betrifft, sind diese deutlich näher an der Kamera platziert. Das Podest befindet sich direkt vor der Kamera, nur ca. zwei Meter entfernt. Das Papier auf dem Podest schwebt direkt zu Beginn der Szene in der Luft. Dreht man sich im HMD um, sieht man ca. eine Meter hinter sich den Genrator mit Steckdose und Stecker. Außerdem schwebt der Computer deutlich näher an der Kamera und die Planes schweben nicht um den Generator, sondern um den Computer und gucken die Kamera von Anfang an an. 

Die Interaktionen sind mti denen in der VR-Szene identisch.

== Interaktion <interaktion>
Es gibt vier Arten mit der Szene zu Interagieren. Die erste ist die Fortbewegung, diese findet mittels Teleportation statt. Teleportation ist eine gängige, etablierte und nutzerfreundliche Fortbewegungsweise in MR- und vor allem VR-Anwendungen. Ich habe mich für diese entschieden, da sie das Risiko durch die Fortbewegung in einer VR-Anwedung Motion Sickness zu erleiden deutlich reduzieren soll. Die Teleportation wird mit dem Trigger, der Button der üblicherweise mit dem Zeigefinger der Hand bedient wird, des linken Meta Tocuh Controllers ausgeführtt.

Die zweite Interaktions-Art ist der Raycaster mit dem mit dem ChatGPT-UI und den Elementen darauf interagiert werden kann. Der Raycaster ist generell immer sichtbar. Mit dem Betätigen des Triggers des rechten Meta Touch Controllers lassen sich die UI Elemente auswählen.

Die dritte Art ist das Greifen von Objekten, mit den Grip-Buttons der Meta Touch Controller. Die Grip-Buttons sind die Buttons, die mit den Mittelfingern der Hände bedient werden. Um ein Objekt zu greifen muss das Controller-Modell in das Objekt geführt werden und dann der Grip-Button dieses Controllers betätigt werden. Z.Z. ist nur der Stecker in der Steckdose greifbar.

Die vierte und letzte Art der Interaktion ist das Umherschauen durch Bewegung des HMD durch den dreidimensionalen Raum. Durch die Bewegung des HMD im dreidimensionalen Raum ließe es sich, bei einem realen Raum entsprechender Größe, auch durch die gesamte Szene bewegen.


== Design der Szene <design>
Die Szene folgt keinem festen Designpattern. Grundsätzlich habe ich hier die Funktion der Objekte, also etwas bestimmtes darzustellen wie z.B. einen Computer oder einen Altar, über ein konsistentes Design gestellt. Einzige Design-Anforderung war, dass die Objekte im Thronsaal, bis auf den Computer, einen mittelalterlichen Look haben, sollten, sowie die Objekte innerhalb der Blackbox einem neumodischen/futuristischen Design folgen dürfen.
Dieser Unterschied sollte die Diskrepanz zwischen der auf Laien undurchsichtig und einfach wirkenden und eventuell, mit Blick auf positive gesellschaftliche Veränderungen, überschätzten Technologie der LLMs und deren tatsächlichen Komplexität und Folgen verdeutlichen.

== Technische Dokumentation <technik>
=== Build-Tool
Für die Entwicklung und das Deployment wurde Vite als Build-Tool eingesetzt. Vite bietet einen schnellen Entwicklungsserver mit Hot Module Replacement und optimiert beim Build-Prozess automatisch die Assets. Die Konfiguration erfolgt über die `vite.config.js` im Wurzelverzeichnis.

=== Projektstruktur
Im root-Verzeichnis befindet sich eine `index.html`, in der die A-Frame-Szene erstellt wurde. Diese beinhaltet die Einbindung aller benötigten externen A-Frame-Bibliotheken, Custom-Components sowie aller Assets, also 3D-Modelle und Texturen. Die Szene selbst ist in zwei Hauptkomponenten unterteilt: `vr-entities-component.js` und `ar-entites-component.js`, die jeweils die VR- und AR-Entities spawnen und verwalten.

Die Ordnerstruktur gliedert sich wie folgt:
- `src/components/custom/`: Enthält alle selbst geschriebenen A-Frame-Komponenten
- `src/components/external/`: Externe Komponenten wie die A-Frame-Tastatur (die jedoch zum Zeitpunkt dieser Dokuemntation nicht in der Szene genutzt werden)
- `src/models/`: 3D-Modelle im GLTF/GLB-Format mit zugehörigen Texturen
- `src/textures/`: Bildtexturen für Materialien und UI-Elemente
- `docu/`: Projektdokumentation in Typst

=== A-Frame und Dependencies
Das Projekt basiert auf A-Frame Version 1.7.0, einem WebXR-Framework das auf Three.js aufbaut. A-Frame ermöglicht es, MR-Szenen mit HTML-ähnlicher Syntax zu erstellen und mit JavaScript-Komponenten zu erweitern.

Folgende externe A-Frame-Packages werden eingesetzt:
- *aframe-physics-system*: Ermöglicht physikalische Simulationen mittels den Physics-Engines Ammo.js oder Canon.js. Das Package wird für Kollisionserkennung und die Physics-basierten Interaktionen genutzt, z.B. bei der Kollisionserkennung von Stecker und Boden.
- *aframe-extras*: Bietet zusätzliche Komponenten und Controls, darunter die erweiterte Controller-Unterstützung.
- *ammo.js*: Die zugrundeliegende Physics-Engine, die von aframe-physics-system verwendet wird.

Die externen Dependencies werden per Content Delivery Network eingebunden, wodurch keine lokale Installation der Packages notwendig ist.
Es könen falls gewollt jedoch die lokalen Dependencies in der index.html auskommentiert werden um diese, falls installiert, offline zu nutzen.

=== Custom Components
Für die spezifischen Anforderungen der Szene wurden mehrere Custom Components entwickelt, die das Verhalten und die Interaktionen der Entities steuern:

*Szenen-Management:*
- `vr-entities-component.js`: Spawnt und verwaltet alle VR-spezifischen Entities
- `ar-entites-component.js`: Spawnt und verwaltet die AR-Variante der Szene mit angepasster Objektplatzierung

*Interaktions-Komponenten:*
- `grabbable-custom.js`: Ermöglicht das Greifen von Objekten mit den Meta Touch Controllern
- `hand-grab.js`: Verwaltet die Grip-Button-Interaktion und das Halten von Objekten
- `chat-interaction.js`: Steuert die Interaktion mit dem ChatGPT-UI
- `teleport-component.js`: Erweiterte Teleportations-Logik für spezifische Szenenanforderungen
- `on-event-teleport.js`: Ermöglicht Event-basierte Teleportation von Entities (z.B. Absturz des Computers)

*Visuelle Effekte und Animationen:*
- `spiral-movement.js`: Erzeugt die Helix-Bewegung der fliegenden Text-Planes um den Generator bzw. Computer
- `paper-glide-upwards.js`: Lässt das ChatGPT-UI-Papier vom Podest aufschweben
- `look-at-camera-component.js`: Lässt Objekte kontinuierlich zur Kamera schauen
- `blink-cursor.js`: Simuliert einen blinkenden Textcursor im ChatGPT-UI
- `torchlight-spawner.js`: Erstellt flackernde Lichtquellen für die Fackeln im Thronsaal
- `spawn-text-planes.js`: Generiert die Text-Planes mit KI-kritischen Begriffen

*Hilfsfunktionen:*
- `proximity-detection-by-circle-componente.js`: Erkennt Kamera-Nähe zu Objekten und triggert Events
- `on-event-deactivate-components.js`: Deaktiviert spezifische Komponenten bei bestimmten Events
- `camera-position-debug.js`: Debug-Tool zur Ausgabe der Kamera-Position während der Entwicklung
- `camera-persistence.js`: Debug-Tool, Speichert und lädt Kamera-Positionen zwischen Sessions

Alle Components folgen der A-Frame-Komponenten-API mit `init()`, `update()`, `tick()` und `remove()` Lifecycle-Methoden.

== Problemstellungen und Lösungen <probleme>
Wie bereits in @abschluss erwähnt, konnte die Idee der MR-Szene aus dem vorangegangenen Themevorschlag  

== LLM Nutzung <llm>

== Fazit <fazit>
