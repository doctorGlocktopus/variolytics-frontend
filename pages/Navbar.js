import { useContext } from "react";
import AppContext from "../AppContext";
import { deleteCookie } from 'cookies-next';
import styles from "../styles/Navbar.module.css";

export default function Navbar() {
    const { currentUser, setCurrentUser } = useContext(AppContext);

    const logout = () => {
        setCurrentUser(null); // Resetting currentUser
        deleteCookie("auth");
        localStorage.removeItem("user");
        window.location.reload(false);
    };

    return (
        <nav className={styles.sidebar}>
            <h2>Hallo {currentUser?.username}</h2>
            <div className={styles.navLinks}>
                <a href="/">Home</a>
                <a href="/users">Benutzer</a>
                <a href="/measurements">Messungen</a>
                <a href="/devices">Geräte</a>
                {currentUser ? (
                    <a href="#" onClick={logout}>Logout</a>
                ) : (
                    <a href="/login">Login</a>
                )}
            </div>
        </nav>
    );
}
