import styles from '../../styles/Blog.module.css'
import {Login} from "./Login";
import Register from "./Register";

export default function Home() {

    return (
        <main className={styles.main}>
            <div className={styles.flexRechtsEnd}>
                <Login />
                <Register />
            </div>
        </main>
    );
}