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
                <button className={styles.menuToggle} onClick={toggleMenu}>
                    {isMenuOpen ? 'Close Menu' : 'Open Menu'}
                </button>
                <div>
                    {language === 'en' ? (
                        <button 
                            onClick={() => changeLanguage('de')}
                            style={{
                                display: 'block',
                                marginBottom: '1rem',
                                background: '#00c49f',
                                color: 'white',
                                border: 'none',
                                padding: '0.5rem',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            <h4>English</h4>
                        </button>
                    ) : (
                        <button 
                            onClick={() => changeLanguage('en')}
                            style={{
                                display: 'block',
                                marginBottom: '1rem',
                                background: '#00c49f',
                                color: 'white',
                                border: 'none',
                                padding: '0.5rem',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            <h4>Deutsch</h4>
                        </button>
                    )}
                </div>
            </div>
            {isMenuOpen ? <h2>{currentUser?.username}</h2> : <div></div>}
            <div className={`${styles.navLinks} ${isMenuOpen ? styles.show : ''}`}>
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
        </nav>
    );
}
