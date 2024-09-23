import styles from '../../styles/Blog.module.css';
import AppContext from "../../AppContext";
import { useContext } from "react";
import { getCookie } from 'cookies-next';

function oneUser({ user }) {
    const { currentUser } = useContext(AppContext);

    if (user?._id) {
        return (
            <div className={styles.main}>
                <div className={styles.post}>
                    <div className={styles.article}>
                        <nav>
                            <h2>Der User Nr.{user._id}</h2>
                            <div className={styles.flexRunter}>
                                <h2>Name: {user.username}</h2>
                                <h3>Rolle: {user.admin ? "Admin" : "User"}</h3>
                                {currentUser?.admin && (
                                    <div onClick={() => delUser(user._id)}>
                                        <button>löschen</button>
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
            <nav>
                <h2>Der User existiert nicht mehr</h2>
            </nav>
        );
    }
}

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

export default oneUser;



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
