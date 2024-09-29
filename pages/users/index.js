import styles from '../../styles/User.module.css';
import { useRouter } from 'next/router';
import AppContext from "../../AppContext";
import { setCookie, getCookie } from 'cookies-next';
import { useContext } from "react";
import routes from '../../locales/users.js';
import { addNotification } from '../../redux/notificationSlice';
import { useDispatch } from 'react-redux';

async function delUser(_id) {
    let jwt = getCookie("auth");
    let urlID = `/api/users/update?id=${_id}`;

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
        throw error;
    }
}

function ListPageComponent(props) {
    const dispatch = useDispatch();
    const router = useRouter();
    const { currentUser, language } = useContext(AppContext);

    const handleUserClick = (userId) => {
        setCookie('user_id', userId);
        router.push(`/users/${userId}`);
    };

    const handleDeleteUser = async (userId) => {
        try {
            await delUser(userId);
            router.reload();
        } catch (error) {
            const newNotification = {
                id: Date.now(),
                message: error[0],
            };
            dispatch(addNotification(newNotification));
            router.reload();
        }
    };

    return (
        <div className={styles.container}>
            <h2>{routes.userList.title[language]}</h2>
            <table className={styles.deviceTable}>
                <thead>
                    <tr>
                        <th>{routes.userList.headers.id[language]}</th>
                        <th>{routes.userList.headers.username[language]}</th>
                        <th>{routes.userList.headers.role[language]}</th>
                        {currentUser?.admin && <th>{routes.userList.headers.actions[language]}</th>}
                    </tr>
                </thead>
                <tbody>
                    {props.users.map(user => (
                        <tr key={user._id} className={styles.cursorPointer} onClick={() => handleUserClick(user._id)}>
                            <td>{user._id}</td>
                            <td>{user.username}</td>
                            <td>{user.admin ? routes.userList.headers.admin[language] : routes.userList.headers.user[language]}</td>
                            {currentUser?.admin && (
                                <td>
                                    <button 
                                        className={styles.deleteButton} 
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            handleDeleteUser(user._id); 
                                        }}
                                    >
                                        {routes.userList.headers.delete[language]}
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
