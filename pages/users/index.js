import styles from '../../styles/Blog.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AppContext from "../../AppContext";
import { setCookie, getCookie } from 'cookies-next';
import { useContext } from "react";

function delUser(_id) {
    let jwt = getCookie("auth");
    let urlID = `/api/users/${_id}`;

    fetch(urlID, {
        method: 'DELETE',
        headers: {
            auth: jwt,
            'Content-type': 'application/json; charset=UTF-8',
        },
    }).then(() => window.location.reload(false));
}

function ListPageComponent(props) {
    const { currentUser } = useContext(AppContext);
    const router = useRouter();

    const handleUserClick = (userId) => {
        setCookie('user_id', userId);
        router.push(`/users/${userId}`);
    };

    return (
        <div className={styles.main}>
            <div className={styles.post}>
                <div className={styles.article}>
                    <h2>Benutzerliste</h2>
                    {props.users.map(user => (
                        <div className={styles.post} key={user._id}>
                            <nav>
                                <div
                                    className={styles.cursorPointer}
                                    onClick={() => handleUserClick(user._id)}
                                >
                                    Nr. {user._id} {user.username}
                                    <h3>Rolle: {user.admin ? "Admin" : "User"}</h3>
                                </div>
                                {currentUser?.admin && (
                                    <div>
                                        <button onClick={() => delUser(user._id)}>Löschen</button>
                                    </div>
                                )}
                            </nav>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export async function getStaticProps() {
    const query = await fetch(`http://localhost:3000/api/users`);
    const users = await query.json();

    return { props: { users } };
}

export default ListPageComponent;
