import styles from '../../styles/User.module.css';
import AppContext from "../../AppContext";
import { useContext, useState, useEffect } from "react";
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';

function OneUser() {
    const { currentUser } = useContext(AppContext);
    const router = useRouter();
    const { id } = router.query;
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedUser, setUpdatedUser] = useState({
        username: '',
        admin: 'false',
    });

    const fetchUserData = async (userId) => {
        try {
            const jwt = getCookie("auth");
            const urlID = `/api/users/${userId}`;

            const response = await fetch(urlID, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth': jwt,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch user data");
            }

            const data = await response.json();
            setUser(data);
            setUpdatedUser({
                username: data.username,
                admin: data.admin.toString(),
            });
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    useEffect(() => {
        if (id) {
            fetchUserData(id);
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUser(prev => ({
            ...prev,
            [name]: name === 'admin' ? value === 'true' : value
        }));
    };

    const handleUpdate = async () => {
        try {
            const jwt = getCookie("auth");
            const urlID = `/api/users/${id}`;

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
                throw new Error(errorMessage);
            }

            const updatedUserData = await response.json();
            console.log("User updated successfully:", updatedUserData);
            setIsEditing(false);
        } catch (error) {
            console.error("Update error:", error);
        }
    };

    const delUser = async () => {
        try {
            const jwt = getCookie("auth");
            const urlID = `/api/users/${id}`;

            const response = await fetch(urlID, {
                method: 'DELETE',
                headers: {
                    'auth': jwt,
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete the user');
            }

            router.push('/users');
        } catch (error) {
            console.error('There was a problem with the delete operation:', error);
        }
    };

    if (!user) {
        return (
            <nav className={styles.container}>
                <h2>Loading...</h2>
            </nav>
        );
    }

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
                                    <button onClick={delUser} className={styles.deleteButton}>
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
}

export default OneUser;
