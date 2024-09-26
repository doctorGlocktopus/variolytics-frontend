import { useRef} from 'react';
import styles from '../../styles/Login.module.css';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../redux/notificationSlice';

export default function Register() {
    const dispatch = useDispatch();
    const username = useRef(null);
    const email = useRef(null);
    const password = useRef(null);
    const passwordTypo = useRef(null);

    async function register(event) {
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
                        headers: { 'Content-type': 'application/json; charset=UTF-8' },
                    });

                    if (!res.ok) {
                        throw new Error('Fehler beim Erstellen des Benutzers');
                    }

                    const data = await res.json();

                    const newNotification = {
                        id: Date.now(),
                        message: `Der Benutzer ${username.current.value} wurde regestriert!`,
                    };
                    dispatch(addNotification(newNotification));

                } catch (err) {
                    const newNotification = {
                        id: Date.now(),
                        message: `Registrierung fehlgeschlagen: ${err.message}`,
                    };
                    dispatch(addNotification(newNotification));
                }
            } else {
                setError('Die Passwörter stimmen nicht überein');
                const newNotification = {
                    id: Date.now(),
                    message: 'Die Passwörter stimmen nicht überein.',
                };
                dispatch(addNotification(newNotification));
            }
        } else {
            setError('Das Passwort muss mindestens 5 Zeichen lang sein');
            const newNotification = {
                id: Date.now(),
                message: 'Das Passwort muss mindestens 5 Zeichen lang sein.',
            };
            dispatch(addNotification(newNotification));
        }
    }

    return (
        <div>
            <h1>Registrieren</h1>
            <form className={styles.form} onSubmit={register}>
                <label>Benutzername:
                    <input ref={username} required />
                </label>

                <label>E-Mail Adresse:
                    <input ref={email} required />
                </label>

                <label>Passwort:
                    <input type="password" ref={password} required />
                </label>

                <label>Passwort wiederholen:
                    <input type="password" ref={passwordTypo} required />
                </label>

                <button className={styles.submit} type="submit">Registrieren</button>
            </form>
        </div>
    );
}
