import styles from '../../styles/User.module.css';
import AppContext from "../../AppContext";
import { useContext, useState } from "react";
import { getCookie } from 'cookies-next';
import routes from '../../locales/users.js';
import { addNotification } from '../../redux/notificationSlice';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

function OneUser({ user }) {
    const dispatch = useDispatch();
    const router = useRouter();
    const { setCurrentUser, language } = useContext(AppContext);
    const [updatedUser, setUpdatedUser] = useState({
        username: user?.username,
        admin: user?.admin,
        email: user?.email, 
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUser(prev => ({
            ...prev,
            [name]: name === 'admin' ? value === 'true' : value
        }));
    };

    async function handleUpdate() {
        const jwt = getCookie("auth");
        const urlID = `/api/users/update?id=${user._id}`;
    
        const response = await fetch(urlID, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth': jwt,
            },
            body: JSON.stringify(updatedUser),
        });
    
        if (!response.ok) {
            const errorMessage = await response.text();
            const newNotification = {
                id: Date.now(),
                message: errorMessage,
            };
            dispatch(addNotification(newNotification));
            router.reload();
            return;
        }
    
        const updatedUserData = await response.json();
        setCurrentUser(updatedUserData.username);
        localStorage.setItem("user", JSON.stringify(updatedUserData.username));
        setUpdatedUser(updatedUserData);
    }
    
    function delUser(_id) {
        const jwt = getCookie("auth");
        const urlID = `/api/users/update?id=${_id}`;
    
        fetch(urlID, {
            method: 'DELETE',
            headers: {
                auth: jwt,
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            router.push("/users");
        })
        .catch(error => {
            const newNotification = {
                id: Date.now(),
                message: error.errorMessage,
            };
            dispatch(addNotification(newNotification));
        });
    }    

    if (user?._id) {
        return (
            <div className={styles.deviceTable}>
                <div>
                    <h2>{routes.userDetail.title[language]}: {user.username} Id: {user._id}</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <tbody>
                            <tr>
                                <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                                    <label>{routes.userDetail.labels.name[language]}</label>
                                </td>
                                <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                                    <input
                                        type="text"
                                        name="username"
                                        value={updatedUser.username}
                                        onChange={handleChange}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            outline: 'none',
                                            fontSize: '1rem',
                                            width: '100%',
                                        }}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                                    <label>{routes.userDetail.labels.email[language]}</label>
                                </td>
                                <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                                    <input
                                        type="email"
                                        name="email"
                                        value={updatedUser.email}
                                        onChange={handleChange}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            outline: 'none',
                                            fontSize: '1rem',
                                            width: '100%',
                                        }}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                                    <label>{routes.userDetail.labels.role[language]}</label>
                                </td>
                                <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                                    <select
                                        name="admin"
                                        value={updatedUser.admin}
                                        onChange={handleChange}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            outline: 'none',
                                            fontSize: '1rem',
                                            width: '100%',
                                        }}
                                    >
                                        <option value="false">{routes.userDetail.labels.user[language]}</option>
                                        <option value="true">{routes.userDetail.labels.admin[language]}</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                                    <label>{routes.userDetail.labels.password[language]}</label>
                                </td>
                                <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                                    <input
                                        type="password"
                                        name="password"
                                        value={updatedUser.password}
                                        onChange={handleChange}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            outline: 'none',
                                            fontSize: '1rem',
                                            width: '100%',
                                        }}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2} style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'right' }}>
                                    <button onClick={handleUpdate} className={styles.updateButton}>
                                        {routes.userDetail.labels.update[language]}
                                    </button>
                                    <button onClick={() => delUser(user._id)} className={styles.deleteButton}>
                                        {routes.userDetail.labels.delete[language]}
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>        
        );
    } else {
        return (
            <nav className={styles.container}>
                <h2>{routes.userDetail.labels.notFound[language]}</h2>
            </nav>
        );
    }
}

export default OneUser;

export async function getServerSideProps(ctx) {
    const jwt = getCookie('auth', { req: ctx.req, res: ctx.res });

    if (!jwt) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    let urlID = `http://localhost:3000/api/users/`;

    try {
        const response = await fetch(urlID, {
            headers: {
                auth: jwt,
            },
        });

        if (!response.ok) {
            return {
                notFound: true,
            };
        }

        const data = await response.json();

        const filteredUser = data.filter(user => user._id === ctx.params.id);
        
        return { props: { user: filteredUser.length > 0 ? filteredUser[0] : null } };

    } catch (error) {
        console.error("Fetch error:", error);
        return { props: { user: null } };
    }
}
