import {
    useState, useRef, useContext,
} from 'react';
import styles from '../../styles/Home.module.css';
import AppContext from "../../AppContext";
import { setCookie } from 'cookies-next';
import Router from "next/router";

export function Login() {
    const username = useRef(null);
    const password = useRef(null);
    const [error, setError] = useState('');
    const { currentUser, setCurrentUser } = useContext(AppContext);

    function log() {
        fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify({
                username: username.current.value,
                password: password.current.value,
            }),
            headers: {'Content-type': 'application/json; charset=UTF-8'},
        }).then((response) => {
            if (!response.ok) {
                setError(`This is an HTTP error: The status is ${response.status}`);
                return;
            }
            return response.json();
        }).then((actualData) => {
            if (actualData?.user?.username) {
                console.log(222, actualData)
                setCookie('auth', actualData.accessToken);
                setCurrentUser(actualData.user);
                setError(null);
                localStorage.setItem("user", JSON.stringify(actualData.user));
                Router.push("/");
            } else {
                setCurrentUser(null);
                setError("Benutzername oder Passwort stimmen nicht");
            }
        }).catch((err) => {
            setError("Es gab ein Problem bei der Anfrage: " + err.message);
        });
    }

    return (
        <nav>
            <h5>{currentUser?.username}</h5>
            <h5>{error}</h5>
            <h1>Login</h1>
            <form onSubmit={(e) => {
                e.preventDefault();
                log();
            }} >
                <label className={styles.flexRunter}>Benutzername:
                    <input ref={username} required />
                </label>
                <label className={styles.flexRunter}>Passwort:
                    <input type="password" ref={password} required />
                </label>
                <button className={styles.submit} type="submit">Einloggen</button>
            </form>
        </nav>
    );
}
