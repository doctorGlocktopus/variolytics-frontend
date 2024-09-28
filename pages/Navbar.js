import { useContext } from "react";
import AppContext from "../AppContext";
import { deleteCookie } from 'cookies-next';
import styles from "../styles/Navbar.module.css";
import routes from '../locales/navbar';

export default function Navbar() {
    const { currentUser, setCurrentUser, language, setLanguage } = useContext(AppContext);

    const logout = () => {
        setCurrentUser(null);
        deleteCookie("auth");
        localStorage.removeItem("user");
        window.location.reload(false);
    };

    const changeLanguage = (lang) => {
        setLanguage(lang);
    };

    return (
        <nav className={styles.sidebar}>
            <h2>{currentUser?.username}</h2>
            <div className={styles.navLinks}>
                {Object.values(routes).map(({ path, text }) => (
                    <a key={path} href={path}>
                        {text[language] || text.de}
                    </a>
                ))}
                {currentUser ? (
                    <a href="#" onClick={logout}>Logout</a>
                ) : (
                    <a href={routes.login.path}>
                        {routes.login.text[language] || routes.login.text.de}
                    </a>
                )}
            </div>
            <div className={styles.languageSwitcher}>
                <button 
                    className={`${styles.button} ${language === 'en' ? styles.hidden : ''}`}
                    onClick={() => changeLanguage('en')}
                >
                    <h4>English</h4>
                </button>
                <button 
                    className={`${styles.button} ${language === 'de' ? styles.hidden : ''}`}
                    onClick={() => changeLanguage('de')}
                >
                    <h4>Deutsch</h4>
                </button>
            </div>
        </nav>
    );
}
