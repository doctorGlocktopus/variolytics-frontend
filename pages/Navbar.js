import {useContext, useEffect, useRef, useState} from "react";
import AppContext from "../AppContext";
import {deleteCookie, getCookie} from 'cookies-next';
import styles from "../styles/Blog.module.css";
import Autocomplete from "./components/Autocomplete";

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

    async function DbCon() {
        try {
            let jwt = getCookie("auth");
            const query = await fetch(`http://localhost:3000/posts`, { headers: { auth: jwt } });

            const posts = await query.json();
            if (posts) {
                setPosts(posts);
            }
        } catch (err) {
            setError(err.message);
        }
    }

    useEffect(() => {
        DbCon();
    }, []);


    async function find(filterString) {
        try {
            let jwt = getCookie("auth");
            const query = await fetch(`http://localhost:3000/posts?filter=${filterString}`, { headers: { auth: jwt } });

            const newPosts = await query.json();
            if (newPosts) {
                setNewPosts(newPosts);
            }
        } catch (err) {
            setError(err.message);
        }
    }
    return (
        <header>
            <div className={styles.headline}>
                <h2>Hallo {currentUser?.username}</h2>
                <a href="/">Home</a>
                <a href="/users">Benutzer</a>
                <a href="/dashboard">Dashboard</a>
                {currentUser ? <a href="#" onClick={() => logout()}>Logout</a> : <a href="/login">Login</a>}
                <Autocomplete
                    onChange={find}
                    suggestions={newPosts && newPosts.map(({ title }) => (
                        title
                    ))}
                />
            </div>
        </header>
    );
}