import React, { useState, useEffect } from "react";
import ItemList from "./ItemList/ItemList";
import styles from "./TasksList.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes, faMicrophone, faMicrophoneSlash } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TasksList = ({ selectedDate }) => {
    const [tasks, setTasks] = useState([]);
    const [showAddTaskPanel, setShowAddTaskPanel] = useState(false);
    const [newTaskDescription, setNewTaskDescription] = useState("");
    const [newTaskRecipient, setNewTaskRecipient] = useState("");
    const [newTaskDate, setNewTaskDate] = useState(null); // Используем null для даты, чтобы можно было отслеживать "неустановленную" дату
    const [charCount, setCharCount] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const fetchTasks = async () => {
        if (localStorage.getItem("user-information") !== null) {
            try {
                const currentDate = selectedDate.toLocaleDateString('en-US');
                const userInfo = JSON.parse(localStorage.getItem("user-information"));
                const username = userInfo.username;
                const response = await fetch(`http://localhost:3001/api/tasks/${currentDate}/${username}`);
                if (!response.ok) {
                    throw new Error('Ошибка при получении задач');
                }
                const data = await response.json();
                setTasks(data);
                console.log("Fetched tasks:", data);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/get-all-users');
            if (!response.ok) {
                throw new Error('Ошибка при получении пользователей');
            }
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchTasks();
        fetchUsers();
    }, [selectedDate]);

    const handleAddTaskClick = () => {
        if (showAddTaskPanel) {
            setNewTaskDescription("");
            setNewTaskRecipient("");
            setNewTaskDate(null);
            setCharCount(0);
        }
        setShowAddTaskPanel(!showAddTaskPanel);
    };

    const handleNewTaskDescriptionChange = (e) => {
        const description = e.target.value;
        setNewTaskDescription(description);
        setCharCount(description.length);
    };

    const handleNewTaskRecipientChange = (e) => {
        const value = e.target.value;
        setNewTaskRecipient(value);
        if (value.startsWith('@')) {
            const filtered = users.filter(user => user.username.includes(value.slice(1)));
            setFilteredUsers(filtered);
            setShowUserDropdown(true);
        } else {
            setShowUserDropdown(false);
        }

    };

    const handleUserSelect = (username) => {
        setNewTaskRecipient(`@${username}`);
        setShowUserDropdown(false);
    };

    const handleNewTaskDateChange = (date) => {
        setNewTaskDate(date);
    };

    const handleAddTask = async () => {
        if (localStorage.getItem("user-information") !== null) {
            const userInfo = JSON.parse(localStorage.getItem("user-information"));
            const username = userInfo.username;
            if (newTaskDescription.length <= 200) {
                const formattedDate = newTaskDate ? newTaskDate.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\./g, '/') : null;

                console.log(formattedDate)
                const response = await fetch('http://localhost:3001/api/add-task', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        text: newTaskDescription,
                        date: formattedDate.replaceAll("/", "."),
                        creator: username,
                        recipient: newTaskRecipient,
                        group_id: null
                    }),
                });

                if (response.ok) {
                    const newTaskData = await response.json();
                    console.log("New task added:", newTaskData);
                    setTasks((prevTasks) => [...prevTasks, newTaskData]);
                    setNewTaskDescription("");
                    setNewTaskRecipient("");
                    setNewTaskDate(null);
                    setCharCount(0);
                    setShowAddTaskPanel(false);
                } else {
                    console.error('Ошибка при добавлении задачи');
                }
            } else {
                alert("Ошибка! Описание задачи должно быть не более 200 символов!");
            }
        }
    };

    const toggleRecording = () => {
        if (isRecording) {
            recognition.stop();
            setIsRecording(false);
        } else {
            recognition.start();
            setIsRecording(true);
        }
    };

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'ru-RU';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setNewTaskDescription((prevDescription) => prevDescription + transcript);
        setCharCount((prevCount) => prevCount + transcript.length);
        setIsRecording(false);
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error', event);
        setIsRecording(false);
    };

    const startEditTask = (task) => {
        setEditingTask(task);
        setNewTaskDescription(task.text);
        setNewTaskRecipient(task.recipient);
        // Преобразуем строку даты в объект Date для установки в DatePicker
        const taskDate = task.date ? new Date(task.date) : null;
        setNewTaskDate(taskDate);
        setCharCount(task.text.length);
        setShowAddTaskPanel(true);
    };

    const cancelEditTask = () => {
        setEditingTask(null);
        setNewTaskDescription("");
        setNewTaskRecipient("");
        setNewTaskDate(null);
        setCharCount(0);
        setShowAddTaskPanel(false);
    };

    const saveEditTask = async () => {
        if (!editingTask) return;

        const updatedTask = {
            ...editingTask,
            text: newTaskDescription,
            date: newTaskDate ? newTaskDate.toLocaleDateString('en-US') : null,
            recipient: newTaskRecipient,
        };

        const response = await fetch(`http://localhost:3001/api/update-task/${editingTask.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedTask),
        });

        if (response.ok) {
            setTasks((prevTasks) => prevTasks.map(task => task.id === editingTask.id ? updatedTask : task));
            console.log("Task updated:", updatedTask);
            cancelEditTask();
        } else {
            console.error('Ошибка при обновлении задачи');
        }
    };

    const handleClickInput = (e) => {
        // Check if newTaskRecipient is empty or undefined
        if (!newTaskRecipient || newTaskRecipient === "") {
            // Set newTaskRecipient to "@" and update the state
            setNewTaskRecipient("@");
            // Trigger the handleNewTaskRecipientChange function to handle the change
            handleNewTaskRecipientChange({ target: { value: "@" } });
        }
    };



    return (
        <div style={{ marginTop: "140px" }}>
            {tasks && tasks.map(task => (
                <ItemList key={task.id} text={task.text} creator={task.creator} rec={task.recipient} task={task} onEdit={() => startEditTask(task)} />
            ))}

            <div className={styles.addTaskContainer}>
                <button className={styles.addTaskButton} onClick={handleAddTaskClick}>
                    <FontAwesomeIcon icon={showAddTaskPanel ? faTimes : faPlus} />
                </button>
                {showAddTaskPanel && (
                    <div className={styles.addTaskPanel}>
                        <div className={styles.inputWithIcon}>
                            <input
                                type="text"
                                value={newTaskDescription}
                                onChange={handleNewTaskDescriptionChange}
                                placeholder="Введите описание задачи"
                            />
                            <FontAwesomeIcon
                                icon={isRecording ? faMicrophone : faMicrophoneSlash}
                                onClick={toggleRecording}
                                className={isRecording ? styles.recordingIcon : styles.micIcon}
                            />
                        </div>
                        <div className={styles.charCount} style={{ color: charCount > 200 ? 'red' : 'inherit' }}>
                            {charCount > 200 ? `- ${charCount - 200} символов` : `${charCount} / 200`}
                        </div>
                        <div className={styles.inputWithDropdown}>
                            <input
                                type="text"
                                value={newTaskRecipient}
                                onChange={handleNewTaskRecipientChange}
                                onClick={handleClickInput}
                                placeholder="Кому адресовано @username"
                            />
                            {showUserDropdown && (
                                <div className={styles.userDropdown}>
                                    {filteredUsers.map(user => (
                                        <div key={user.username} className={styles.userDropdownItem} onClick={() => handleUserSelect(user.username)}>
                                            <div className={styles.userIcon}>{user.username.charAt(0).toUpperCase()}</div>
                                            {user.username === JSON.parse(localStorage.getItem("user-information")).username ? (
                                                <div className={styles.username}>@себе</div>
                                            ) : (
                                                <div className={styles.username}>@{user.username}</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {/* Использование DatePicker для выбора даты */}
                        <DatePicker
                            selected={newTaskDate}
                            onChange={date => handleNewTaskDateChange(date)}
                            dateFormat="dd.MM.yy"
                            placeholderText="Выберите дату"
                            className={styles.datePicker}
                        />

                        {editingTask ? (
                            <div className={styles.editButtons}>
                                <button className={styles.btn} onClick={saveEditTask}>Сохранить</button>
                                <button className={styles.btn} onClick={cancelEditTask}>Отмена</button>
                            </div>
                        ) : (
                            <button className={styles.btn} onClick={handleAddTask}>Добавить задачу</button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TasksList;
