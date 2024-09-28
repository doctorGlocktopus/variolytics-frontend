import { useRef, useContext } from 'react';
import styles from '../../styles/Login.module.css';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../redux/notificationSlice';
import routes from '../../locales/login.js';
import AppContext from '../../AppContext';

export default function Register() {
    const dispatch = useDispatch();
    const username = useRef(null);
    const email = useRef(null);
    const password = useRef(null);
    const passwordTypo = useRef(null);
    const { language } = useContext(AppContext);

    const getText = (key) => routes.register[key][language] || routes.register[key].en;

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
                        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
                    });

                    if (!res.ok) {
                        const errorData = await res.json();
                        throw new Error(errorData.message || getText('defaultError'));
                    }

                    const data = await res.json();

                    const newNotification = {
                        id: Date.now(),
                        message: getText('registrationSuccess').replace('{username}', username.current.value),
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
                const newNotification = {
                    id: Date.now(),
                    message: getText('passwordMismatch'),
                };
                dispatch(addNotification(newNotification));
            }
        } else {
            const newNotification = {
                id: Date.now(),
                message: getText('passwordTooShort'),
            };
            dispatch(addNotification(newNotification));
        }
    }

    return (
        <div>
            <h1>{getText('title')}</h1>
            <form className={styles.form} onSubmit={register}>
                <label>{getText('usernameLabel')} 
                    <input ref={username} required />
                </label>

                <label>{getText('emailLabel')}
                    <input ref={email} type="email" required />
                </label>

                <label>{getText('passwordLabel')}
                    <input type="password" ref={password} required />
                </label>

                <label>{getText('confirmPasswordLabel')} 
                    <input type="password" ref={passwordTypo} required />
                </label>

                <button className={styles.submit} type="submit">{getText('registerButton')}</button>
            </form>
        </div>
    );
}
