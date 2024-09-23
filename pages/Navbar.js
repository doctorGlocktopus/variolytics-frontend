import {useContext, useEffect, useRef, useState} from "react";
import AppContext from "../AppContext";
import {deleteCookie, getCookie} from 'cookies-next';
import styles from "../styles/Blog.module.css";

export default function Navbar() {

    const [posts, setPosts] = useState(null);
    const [error, setError] = useState(null);
    const [newPosts, setNewPosts] = useState(null);

    const {
        currentUser,
        setCurrentUser,
    } = useContext(AppContext);

    const logout = e => {
        setCurrentUser([...""]);
        deleteCookie("auth");
        localStorage.removeItem("user");
        window.location.reload(false);
    };

    return (
        <header>
            <div className={styles.headline}>
                <h2>Hallo {currentUser?.username}</h2>
                <a href="/">Home</a>
                <a href="/users">Benutzer</a>
                <a href="/measurements">Messungen</a>
                <a href="/devices">Geräte</a>
                {currentUser ? <a href="#" onClick={() => logout()}>Logout</a> : <a href="/login">Login</a>}
            </div>
        </header>
    );
}