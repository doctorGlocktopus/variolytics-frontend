import styles from '../../styles/Blog.module.css';
import Link from 'next/link';
import AppContext from "../../AppContext";
import {
    setCookie, getCookie,
} from 'cookies-next';
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
    return (
        <div className={styles.main}>
            <div className={styles.post}>
                <div className={styles.article}>
                    <h2>Benutzerliste</h2>
                    {props.users.map(users =>
                        <div className={styles.post} key={users._id}>
                            <nav>
                                <Link
                                    onClick={() => setCookie('user_id', users._id)}
                                    href={{
                                        pathname: "users/[id]",
                                        query: { id: users._id },
                                    }}>
                                    <div className={styles.cursorPointer}>
                                        Nr. {users._id} {users.username}
                                        <h3>Rolle: {users.admin ? "Admin" : "User"}</h3>
                                    </div>
                                </Link>
                                {currentUser?.admin && (
                                    <div>
                                        <button onClick={() => delUser(users._id)}>Löschen</button>
                                    </div>
                                )}
                            </nav>
                        </div>
                    )}
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
