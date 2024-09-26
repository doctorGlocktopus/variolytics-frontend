import { Login } from "./Login";
import Register from "./Register";
import styles from '../../styles/Login.module.css';

export default function Home() {
    return (
        <div className={styles.mainContainer}>
            <div className={styles.tabContainer}>
                <Login />
            </div>
            <div className={styles.tabContainer}>
                <Register />
            </div>
        </div>
    );
}
