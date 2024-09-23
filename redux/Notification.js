import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeNotification } from './notificationSlice';
import styles from './Notification.module.css';

const Notification = () => {
    const notifications = useSelector((state) => state.notifications);
    const dispatch = useDispatch();

    return (
        <div className={styles.notificationContainer}>
            {notifications.map((notification) => (
                <div key={notification.id} className={styles.notification}>
                    <span>{notification.message}</span>
                    <button onClick={() => dispatch(removeNotification(notification.id))}>
                        X
                    </button>
                </div>
            ))}
        </div>
    );
};

export default Notification;
