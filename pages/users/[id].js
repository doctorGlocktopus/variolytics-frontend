import styles from '../../styles/User.module.css';
import AppContext from "../../AppContext";
import { useContext, useState } from "react";
import { getCookie } from 'cookies-next';

function OneUser({ user }) {
    const { currentUser } = useContext(AppContext);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedUser, setUpdatedUser] = useState({
        username: user.username,
        admin: user.admin,
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
        const urlID = `/api/users/${user._id}`;
    
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
            console.error("Update error:", errorMessage);
            return;
        }
    
        const updatedUserData = await response.json();
        console.log("User updated successfully:", updatedUserData);
        setIsEditing(false);
    }
    

    function delUser(_id) {
        const jwt = getCookie("auth");
        const urlID = `/api/users/${_id}`;

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
            window.location.reload();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }

    if (user?._id) {
        return (
            <div className={styles.container}>
                <div className={styles.post}>
                    <div className={styles.article}>
                        <nav>
                            <h2>Der User Nr. {user._id}</h2>
                            <div className={styles.flexRunter}>
                                <label>
                                    Name:
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
                                </label>
                                <label>
                                    Rolle:
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
                                        <option value="false">User</option>
                                        <option value="true">Admin</option>
                                    </select>
                                </label>
                                {currentUser?.admin && (
                                    <div>
                                        <button onClick={handleUpdate} className={styles.updateButton}>
                                            Ändern
                                        </button>
                                        <button onClick={() => delUser(user._id)} className={styles.deleteButton}>
                                            Löschen
                                        </button>
                                    </div>
                                )}
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <nav className={styles.container}>
                <h2>Der User existiert nicht mehr</h2>
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
