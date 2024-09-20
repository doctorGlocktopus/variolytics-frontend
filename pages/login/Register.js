import { useState, useRef } from 'react';
import styles from '../../styles/Home.module.css';

export default function Register() {
    const username = useRef(null);
    const email = useRef(null);
    const password = useRef(null);
    const passwordTypo = useRef(null);
    const [error, setError] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();

        if (password.current.value.length >= 5) {
            if (password.current.value === passwordTypo.current.value) {
                try {
                    const res = await fetch('/api/register', {
                        method: 'POST',
                        body: JSON.stringify({
                            username: username.current.value,
                            password: password.current.value,
                            email: email.current.value,
                            admin: false,
                        }),
                        headers: {'Content-type': 'application/json; charset=UTF-8'},
                    });

                    if (!res.ok) {
                        throw new Error('Fehler beim Erstellen des Benutzers');
                    }

                    const data = await res.json();
                    setError(data.message);
                } catch (err) {
                    setError(err.message);
                }
            } else {
                setError('Die Passwörter stimmen nicht überein');
            }
        } else {
            setError('Das Passwort muss mindestens 5 Zeichen lang sein');
        }
    }

    return (
        <nav>
            {error}
            <div>
                <h1>Register</h1>
                <form onSubmit={handleSubmit}>
                    <label className={styles.flexRunter}>Benutzername:
                        <input ref={username} required />
                    </label>

                    <label className={styles.flexRunter}>E-Mail Adresse:
                        <input ref={email} required />
                    </label>

                    <label className={styles.flexRunter}>Passwort:
                        <input type="password" ref={password} required />
                    </label>

                    <label className={styles.flexRunter}>Passwort wiederholen:
                        <input type="password" ref={passwordTypo} required />
                    </label>

                    <button className={styles.submit} type="submit">Registrieren</button>
                </form>
            </div>
        </nav>
    );
}
