import styles from '../../styles/User.module.css';
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
        <div className={styles.container}>
            <h2>Benutzerliste</h2>
            <table className={styles.userTable}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Benutzername</th>
                        <th>Rolle</th>
                        {currentUser?.admin && <th>Aktionen</th>} {/* Show actions column only for admin */}
                    </tr>
                </thead>
                <tbody>
                    {props.users.map(user => (
                        <tr key={user._id} className={styles.cursorPointer} onClick={() => handleUserClick(user._id)}>
                            <td>{user._id}</td>
                            <td>{user.username}</td>
                            <td>{user.admin ? "Admin" : "User"}</td>
                            {currentUser?.admin && (
                                <td>
                                    <button className={styles.deleteButton} onClick={(e) => { e.stopPropagation(); delUser(user._id); }}>
                                        Löschen
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export async function getStaticProps() {
    const query = await fetch(`http://localhost:3000/api/users`);
    const users = await query.json();

    return { props: { users } };
}

export default ListPageComponent;
