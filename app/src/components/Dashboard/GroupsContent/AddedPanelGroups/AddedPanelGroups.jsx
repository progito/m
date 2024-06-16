import React, { useState, useEffect } from 'react';
import styles from './AddedPanelGroups.module.css';
import Item from "./Item/Item";
import UserTasks from "../UsersAndTasksGroup/UserTasks";

const AddedPanelGroups = () => {
    const [groups, setGroups] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedUsername, setSelectedUsername] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem("user-information"));
            if (!userInfo || !userInfo.username) {
                console.error('Неверный формат данных пользователя в localStorage');
                return;
            }
            const username = userInfo.username;
            const response = await fetch(`http://localhost:3001/api/groups/${username}`);
            if (response.ok) {
                const groupsData = await response.json();
                setGroups(groupsData);
            } else {
                console.error('Ошибка при получении списка групп');
            }
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
        }
    };

    const handlerClick = async (groupName) => {
        try {
            const response = await fetch(`http://localhost:3001/api/alltasks?username=${groupName.replace("@", "")}`);
            if (response.ok) {
                const tasksData = await response.json();
                setSelectedUsername(groupName); // Trigger UserTasks rendering with selected username
                setTasks(tasksData);
                setSelectedGroup(groupName); // Set selected group
            } else {
                console.error('Ошибка при получении задач для группы:', response.statusText);
            }
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
        }
    };

    const startEditTask = (task) => {
        // Logic to handle edit task functionality
        console.log('Edit task:', task);
    };

    return (
        <div>
            <div className={styles.scrollContainer}>
                <div className={styles.circleContainer}>
                    {groups.map((group) => (
                        group.recipient !== ("@" + JSON.parse(localStorage.getItem('user-information')).username) && (
                            <Item
                                key={group.id}
                                groupName={group.recipient}
                                clicker={() => handlerClick(group.recipient)}
                                isSelected={selectedGroup === group.recipient}
                            />
                        )
                    ))}
                </div>
            </div>
            {selectedUsername && <UserTasks tasks={tasks.tasks} user={selectedUsername.replace("@", "")}/>}
        </div>
    );
};

export default AddedPanelGroups;
