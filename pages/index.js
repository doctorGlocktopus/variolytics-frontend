import styles from '../styles/Login.module.css';
import LoginForm from './login/index.js'
export default function Home() {

    return (
        <div className={styles.loginForm}>
            <LoginForm />
        </div>
    );
}