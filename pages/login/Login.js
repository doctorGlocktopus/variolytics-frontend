import {
    useRef,
    useContext,
} from 'react';
import styles from '../../styles/Login.module.css';
import AppContext from "../../AppContext";
import { setCookie } from 'cookies-next';
import Router from "next/router";
import { useDispatch } from 'react-redux';
import { addNotification } from '../../redux/notificationSlice';

export function Login() {
    const dispatch = useDispatch();
    const username = useRef(null);
    const password = useRef(null);
    const { currentUser, setCurrentUser } = useContext(AppContext);

    const login = async () => {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                body: JSON.stringify({
                    username: username.current.value,
                    password: password.current.value,
                }),
                headers: { 'Content-type': 'application/json; charset=UTF-8' },
            });

            if (!response.ok) {
                setError(`This is an HTTP error: The status is ${response.status}`);
                return;
            }

            const actualData = await response.json();

            if (actualData?.user?.username) {
                setCookie('auth', actualData.accessToken);
                setCurrentUser(actualData.user);
                localStorage.setItem("user", JSON.stringify(actualData.user));
                Router.push("/");

                const newNotification = {
                    id: Date.now(),
                    message: 'Erfolgreich eingeloggt!',
                };
                dispatch(addNotification(newNotification));
            } else {
                setCurrentUser(null);
                setError("Benutzername oder Passwort stimmen nicht");
            }
        } catch (err) {
            dispatch(addNotification(err));
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form  className={styles.form} onSubmit={(e) => {
                e.preventDefault();
                login();
            }} >
                <label>Benutzername:
                    <input ref={username} required />
                </label>
                <label>Passwort:
                    <input type="password" ref={password} required />
                </label>
                <button type="submit">Einloggen</button>
            </form>
        </div>
    );
}
