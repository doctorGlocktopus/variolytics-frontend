import styles from '../../styles/User.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AppContext from "../../AppContext";
import { setCookie, getCookie } from 'cookies-next';
import { useContext } from "react";

async function delUser(_id) {
    let jwt = getCookie("auth");
    let urlID = `/api/users/${_id}`;

    try {
        const response = await fetch(urlID, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json; charset=UTF-8',
            },
        });

        if (!response.ok) {
            throw new Error('Fehler beim Löschen des Benutzers');
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

function ListPageComponent(props) {
    const { currentUser } = useContext(AppContext);
    const router = useRouter();

    const handleUserClick = (userId) => {
        setCookie('user_id', userId);
        router.push(`/users/${userId}`);
    };

    const handleDeleteUser = async (userId) => {
        try {
            await delUser(userId);
            window.location.reload();
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className={styles.container}>
            <h2>Benutzerliste</h2>
            <table  className={styles.deviceTable}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Benutzername</th>
                        <th>Rolle</th>
                        {currentUser?.admin && <th>Aktionen</th>}
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
                                    <button 
                                        className={styles.deleteButton} 
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            handleDeleteUser(user._id); 
                                        }}
                                    >
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

export async function getServerSideProps() {
    const response = await fetch(`http://localhost:3000/api/users`);
    const users = await response.json();

    return { props: { users } };
}

export default ListPageComponent;
