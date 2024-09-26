## Messungen als separate Dokumente (Flacher Ansatz mit Geräte-ID)

{
  "MeasureId": 100001,
  "DeviceId": 1.695520394744324,
  "DeviceName": "Device G",
  "N2O": "25.82",
  "CH4": "49.90",
  "CO2": "13.23",
  "O2": "38.98",
  "FlowRate": "3941.19",
  "Temperature": "64.84",
  "Date": "2024-08-01T21:59:59.000Z"
}

Vorteile:
Skalierbarkeit:
Da jede Messung ein eigenes Dokument ist, stößt du nicht auf das Größenlimit von 16 MB pro Dokument. Du kannst also unbegrenzt viele Messungen pro Gerät speichern.

Effiziente Filterung:
Abfragen nach bestimmten Zeitstempeln, Werten oder anderen Kriterien können schnell erfolgen, da jede Messung ihr eigenes Dokument hat. Dies ist nützlich, wenn du nur eine Teilmenge der Messungen (z.B. alle Messungen eines bestimmten Zeitraums) benötigst.

Einfachere Aktualisierung:
Das Aktualisieren, Hinzufügen oder Löschen einer einzelnen Messung ist einfacher und effizienter, da du nur das betroffene Dokument ändern musst.

# Benutzerverwaltungs-App

Eine einfache Benutzerverwaltungs-App, die es ermöglicht, Benutzer zu registrieren, sich anzumelden und eine Benutzerliste anzuzeigen. Die Daten werden in einer MongoDB gespeichert.

## Voraussetzungen

- Node.js (Version 14 oder höher)
- NPM oder Yarn

## Installation

1. **Repository klonen**:

   ```bash
   git clone https://github.com/doctorGlocktopus/variolytics-frontend.git
   cd variolytics-frontend
   npm i / yarn install

2. **Mock Daten generieren**:
    
    node scripts/generateMockData.js

    MongoDB Atlas installieren
    neue Verbindung aufbauen (mongodb://localhost:27017)
    neue Datenbank + Collection erstellen
    Werte eintragen mit:
    node scripts/generateMdbData.js
  

## Routenbeschreibung

### 1. Benutzerregistrierung
- **Route:** `POST /api/users`
- **Beschreibung:** Diese Route ermöglicht es Benutzern, sich zu registrieren. Benutzer müssen ihren Benutzernamen, ihre E-Mail-Adresse und ein Passwort bereitstellen.
- **Anforderungsparameter:**
  - `username` (String): Der gewünschte Benutzername.
  - `email` (String): Die E-Mail-Adresse des Benutzers.
  - `password` (String): Ein sicheres Passwort.
- **Antwort:**
  - Erfolgreiche Registrierung: HTTP 201 Created mit Benutzerinformationen.
  - Fehler: HTTP 400 Bad Request mit einer Fehlermeldung.

### 2. Benutzeranmeldung
- **Route:** `POST /api/users/login`
- **Beschreibung:** Diese Route ermöglicht es Benutzern, sich mit ihrem Benutzernamen und Passwort anzumelden.
- **Anforderungsparameter:**
  - `username` (String): Der Benutzername des Anmeldenden.
  - `password` (String): Das Passwort des Anmeldenden.
- **Antwort:**
  - Erfolgreiche Anmeldung: HTTP 200 OK mit einem JWT-Token und Benutzerinformationen.
  - Fehler: HTTP 401 Unauthorized, wenn die Anmeldedaten falsch sind.

### 3. Benutzerliste
- **Route:** `GET /api/users`
- **Beschreibung:** Diese Route gibt die Liste aller registrierten Benutzer zurück.
- **Antwort:**
  - HTTP 200 OK mit einer Liste von Benutzern im JSON-Format.

### 4. Einzelner Benutzer
- **Route:** `GET /api/users/[id]`
- **Beschreibung:** Diese Route gibt die Details eines einzelnen Benutzers zurück, basierend auf der angegebenen ID.
- **Antwort:**
  - HTTP 200 OK mit den Benutzerinformationen.
  - HTTP 404 Not Found, wenn der Benutzer nicht existiert.

### 5. Benutzer löschen
- **Route:** `DELETE /api/users/[id]`
- **Beschreibung:** Diese Route ermöglicht es einem Administrator, einen Benutzer anhand seiner ID zu löschen.
- **Anforderungsparameter:**
  - `id` (String): Die ID des zu löschenden Benutzers.
- **Antwort:**
  - HTTP 200 OK mit einer Bestätigungsmeldung.
  - HTTP 404 Not Found, wenn der Benutzer nicht existiert.

### 6. Middleware zur Authentifizierung
- **Route:** `middleware`
- **Beschreibung:** Diese Middleware überprüft, ob ein Benutzer mit einem gültigen JWT-Token angemeldet ist. Bei erfolgreicher Validierung wird der Benutzer umgeleitet, wenn er bereits eingeloggt ist.
- **Antwort:**
  - Redirect zu einer anderen Seite bei erfolgreicher Authentifizierung.
  - HTTP 401 Unauthorized, wenn kein Token vorhanden ist.
