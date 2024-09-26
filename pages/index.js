export default function Home() {

    return (
        <div>
            <h2>Messungen als separate Dokumente (Flacher Ansatz mit Geräte-ID)</h2>

            <h3>Vorteile:</h3>
            <ul>
                <li><strong>Skalierbarkeit:</strong> Da jede Messung ein eigenes Dokument ist, stößt du nicht auf das Größenlimit von 16 MB pro Dokument. Du kannst also unbegrenzt viele Messungen pro Gerät speichern.</li>
                <li><strong>Effiziente Filterung:</strong> Abfragen nach bestimmten Zeitstempeln, Werten oder anderen Kriterien können schnell erfolgen, da jede Messung ihr eigenes Dokument hat. Dies ist nützlich, wenn du nur eine Teilmenge der Messungen (z.B. alle Messungen eines bestimmten Zeitraums) benötigst.</li>
                <li><strong>Einfachere Aktualisierung:</strong> Das Aktualisieren, Hinzufügen oder Löschen einer einzelnen Messung ist einfacher und effizienter, da du nur das betroffene Dokument ändern musst.</li>
            </ul>

            <h2>Benutzerverwaltungs-App</h2>

            <p>Eine einfache Benutzerverwaltungs-App, die es ermöglicht, Benutzer zu registrieren, sich anzumelden und eine Benutzerliste anzuzeigen. Die Daten werden in einer MongoDB gespeichert.</p>

            <h3>Voraussetzungen</h3>
            <ul>
                <li>Node.js (Version 14 oder höher)</li>
                <li>NPM oder Yarn</li>
            </ul>

            <h3>Installation</h3>
            <ol>
                <li><strong>Repository klonen:</strong>
                    <pre><code>git clone https://github.com/doctorGlocktopus/variolytics-frontend.git
            cd variolytics-frontend
            npm i / yarn install</code></pre>
                </li>
                <li><strong>Mock Daten generieren:</strong>
                    <pre><code>node scripts/generateMockData.js</code></pre>
                    <p>MongDB Atlas installieren, neue Verbindung aufbauen (<code>mongodb://localhost:27017</code>), neue Datenbank + Collection erstellen, Werte eintragen mit:</p>
                    <pre><code>node scripts/generateMdbData.js</code></pre>
                </li>
            </ol>

            <h3>Routenbeschreibung</h3>

            <h4>1. Benutzerregistrierung</h4>
            <ul>
                <li><strong>Route:</strong> <code>POST /api/users</code></li>
                <li><strong>Beschreibung:</strong> Diese Route ermöglicht es Benutzern, sich zu registrieren. Benutzer müssen ihren Benutzernamen, ihre E-Mail-Adresse und ein Passwort bereitstellen.</li>
                <li><strong>Anforderungsparameter:</strong>
                    <ul>
                        <li><code>username</code> (String): Der gewünschte Benutzername.</li>
                        <li><code>email</code> (String): Die E-Mail-Adresse des Benutzers.</li>
                        <li><code>password</code> (String): Ein sicheres Passwort.</li>
                    </ul>
                </li>
                <li><strong>Antwort:</strong>
                    <ul>
                        <li>Erfolgreiche Registrierung: HTTP 201 Created mit Benutzerinformationen.</li>
                        <li>Fehler: HTTP 400 Bad Request mit einer Fehlermeldung.</li>
                    </ul>
                </li>
            </ul>

            <h4>2. Benutzeranmeldung</h4>
            <ul>
                <li><strong>Route:</strong> <code>POST /api/users/login</code></li>
                <li><strong>Beschreibung:</strong> Diese Route ermöglicht es Benutzern, sich mit ihrem Benutzernamen und Passwort anzumelden.</li>
                <li><strong>Anforderungsparameter:</strong>
                    <ul>
                        <li><code>username</code> (String): Der Benutzername des Anmeldenden.</li>
                        <li><code>password</code> (String): Das Passwort des Anmeldenden.</li>
                    </ul>
                </li>
                <li><strong>Antwort:</strong>
                    <ul>
                        <li>Erfolgreiche Anmeldung: HTTP 200 OK mit einem JWT-Token und Benutzerinformationen.</li>
                        <li>Fehler: HTTP 401 Unauthorized, wenn die Anmeldedaten falsch sind.</li>
                    </ul>
                </li>
            </ul>

            <h4>3. Benutzerliste</h4>
            <ul>
                <li><strong>Route:</strong> <code>GET /api/users</code></li>
                <li><strong>Beschreibung:</strong> Diese Route gibt die Liste aller registrierten Benutzer zurück.</li>
                <li><strong>Antwort:</strong>
                    <ul>
                        <li>HTTP 200 OK mit einer Liste von Benutzern im JSON-Format.</li>
                    </ul>
                </li>
            </ul>

            <h4>4. Einzelner Benutzer</h4>
            <ul>
                <li><strong>Route:</strong> <code>GET /api/users/[id]</code></li>
                <li><strong>Beschreibung:</strong> Diese Route gibt die Details eines einzelnen Benutzers zurück, basierend auf der angegebenen ID.</li>
                <li><strong>Antwort:</strong>
                    <ul>
                        <li>HTTP 200 OK mit den Benutzerinformationen.</li>
                        <li>HTTP 404 Not Found, wenn der Benutzer nicht existiert.</li>
                    </ul>
                </li>
            </ul>

            <h4>5. Benutzer löschen</h4>
            <ul>
                <li><strong>Route:</strong> <code>DELETE /api/users/[id]</code></li>
                <li><strong>Beschreibung:</strong> Diese Route ermöglicht es einem Administrator, einen Benutzer anhand seiner ID zu löschen.</li>
                <li><strong>Anforderungsparameter:</strong>
                    <ul>
                        <li><code>id</code> (String): Die ID des zu löschenden Benutzers.</li>
                    </ul>
                </li>
                <li><strong>Antwort:</strong>
                    <ul>
                        <li>HTTP 200 OK mit einer Bestätigungsmeldung.</li>
                        <li>HTTP 404 Not Found, wenn der Benutzer nicht existiert.</li>
                    </ul>
                </li>
            </ul>

            <h4>6. Middleware zur Authentifizierung</h4>
            <ul>
                <li><strong>Route:</strong> <code>middleware</code></li>
                <li><strong>Beschreibung:</strong> Diese Middleware überprüft, ob ein Benutzer mit einem gültigen JWT-Token angemeldet ist. Bei erfolgreicher Validierung wird der Benutzer umgeleitet, wenn er bereits eingeloggt ist.</li>
                <li><strong>Antwort:</strong>
                    <ul>
                        <li>Redirect zu einer anderen Seite bei erfolgreicher Authentifizierung.</li>
                        <li>HTTP 401 Unauthorized, wenn kein Token vorhanden ist.</li>
                    </ul>
                </li>
            </ul>
        </div>
    );
}