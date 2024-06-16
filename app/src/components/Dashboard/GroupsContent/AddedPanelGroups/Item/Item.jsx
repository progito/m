import React from 'react';
import styles from './Item.module.css';

const Item = ({ groupName, clicker, isSelected }) => {
    const firstLetter = groupName.charAt(1).toUpperCase();

    return (
        <div className={styles.container} onClick={clicker}>
            <div className={styles.circle}>
                <div className={styles.gradientBackground}>
                    {firstLetter}
                </div>
            </div>
            <div className={styles.dotContainer}>
                {isSelected && <div className={styles.dot}></div>}
            </div>
        </div>
    );
};

export default Item;
