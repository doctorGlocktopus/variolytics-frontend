import fs from 'fs';
import path from 'path';
import styles from '../../styles/Blog.module.css';

export default function UserPage({ user }) {
    return (
        <div className={styles.main}>
            <div className={styles.post}>
                <div className={styles.article}>
                    <h2>Benutzer Nr. {user._id}</h2>
                    <h3>Name: {user.username}</h3>
                    <h3>Rolle: {user.admin ? "Admin" : "User"}</h3>
                </div>
            </div>
        </div>
    );
}

export async function getServerSideProps(ctx) {
    const { id } = ctx.params;

    const filePath = path.join(process.cwd(), 'data', 'users.json');
    const fileData = fs.readFileSync(filePath);
    const users = JSON.parse(fileData);

    const user = users.find(user => user._id === id);

    if (!user) {
        return {
            notFound: true,
        };
    }

    return {
        props: { user },
    };
}
