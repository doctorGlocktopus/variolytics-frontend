import { useContext, useState } from "react";
import AppContext from "../AppContext";
import { deleteCookie } from 'cookies-next';
import styles from "../styles/Navbar.module.css";
import routes from '../locales/navbar';

export default function Navbar() {
    const { currentUser, setCurrentUser, language, setLanguage } = useContext(AppContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const logout = () => {
        setCurrentUser(null);
        deleteCookie("auth");
        localStorage.removeItem("user");
        window.location.reload(false);
    };

    const changeLanguage = (lang) => {
        setLanguage(lang);
    };

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    return (
        <nav className={styles.sidebar}>
            <div className={styles.rowMenue}>
                <div>
                    
                </div>
            </div>
            {isMenuOpen ? <h2>{currentUser?.username}</h2> : <div></div>}
            <div className={styles.switchContainer}>
                    <button className={styles.button} onClick={toggleMenu}>
                        {isMenuOpen ? 'Close Menu' : 'Open Menu'}
                    </button>
                    {language === 'en' ? (
                            <button 
                                onClick={() => changeLanguage('de')}
                                className={styles.button}
                            >
                                <h4>English</h4>
                            </button>
                        ) : (
                            <button 
                                onClick={() => changeLanguage('en')}
                                className={styles.button}
                            >
                                <h4>Deutsch</h4>
                            </button>
                        )}
                </div>
            <div className={`${styles.navLinks} ${isMenuOpen ? styles.show : ''}`}>
                {isMenuOpen ?
                    <button className={styles.button} onClick={toggleMenu}>
                        X
                    </button> : <div></div>}
                {Object.values(routes).map(({ path, text }) => (
                    <a key={path} href={path}>
                        {text[language] || text.de}
                    </a>
                ))}
                {currentUser ? (
                    <a href="#" onClick={logout}>Logout</a>
                ) : <div></div>}
            </div>
        </nav>
    );
}
