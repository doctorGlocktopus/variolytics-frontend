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
import routes from '../../locales/login';

export function Login() {
    const dispatch = useDispatch();
    const username = useRef(null);
    const password = useRef(null);
    const { setCurrentUser, language } = useContext(AppContext);

    const getText = (key) => routes.login[key][language] || routes.login[key].en;

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
                const newNotification = {
                    id: Date.now(),
                    message: getText('errorMessage'),
                };
                dispatch(addNotification(newNotification));
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
                    message: getText('exportSuccess'),
                };
                dispatch(addNotification(newNotification));
            } else {
                setCurrentUser(null);
                const newNotification = {
                    id: Date.now(),
                    message: getText('invalidCredentials'),
                };
                dispatch(addNotification(newNotification));
            }
        } catch (err) {
            dispatch(addNotification(err));
        }
    };

    return (
        <div>
            <h1>{getText('title')}</h1>
            <form className={styles.form} onSubmit={(e) => {
                e.preventDefault();
                login();
            }}>
                <label>{getText('usernameLabel')}
                    <input ref={username} required />
                </label>
                <label>{getText('passwordLabel')}
                    <input type="password" ref={password} required />
                </label>
                <button type="submit">{getText('loginButton')}</button>
            </form>
        </div>
    );
}
