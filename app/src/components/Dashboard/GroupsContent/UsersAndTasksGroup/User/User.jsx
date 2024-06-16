import React from 'react';
import s from './User.module.css';

const User = ({ username }) => {
    return (
        <div className={s.container}>
            <div className={s.userContainer}>
                <div className={s.userIcon}>
                    {username && typeof username === 'string' && username.length > 1
                        ? username[0].toUpperCase()
                        : '?'}
                </div>

                <div className={s.userInfo}>
                    <div className={s.userName}>
                        @{username}
                    </div>

                </div>
            </div>
            <hr className={s.userSeparator}/>
        </div>
    );
};

export default User;
