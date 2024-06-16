import React from 'react';
import styles from './AddedItem.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const AddedItem = () => {
    return (
        <div className={styles.circle}>
            <div className={styles.gradientBackground}>
                <FontAwesomeIcon icon={faPlus} />
            </div>
        </div>
    );
};

export default AddedItem;
