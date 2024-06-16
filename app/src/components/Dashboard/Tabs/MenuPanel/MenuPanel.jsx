import React, { useState, useEffect } from "react";
import s from "./MenuPanel.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const MenuPanel = ({ isVisible, onClose, onDateSelect }) => {
    const [taskDates, setTaskDates] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            if (localStorage.getItem("user-information") !== null) {
                const userInfo = JSON.parse(localStorage.getItem("user-information"));
                const username = userInfo.username;
                const response = await fetch(`http://localhost:3001/api/alltasks?username=${username}`);
                if (response.ok) {
                    const newTaskData = await response.json();
                    console.log("Tasks fetched:", newTaskData);
                    if (newTaskData.tasks !== undefined){
                        const dates = newTaskData.tasks.map(task => task.date);
                        const uniqueDates = Array.from(new Set(dates));
                        const formattedDates = uniqueDates.map(date => formatTaskDate(date));
                        setTaskDates(formattedDates);
                    }

                } else {
                    console.error('Ошибка при получении задач');
                }
            }
        };

        fetchTasks();
    }, []);

    const formatTaskDate = (dateString) => {
        const parts = dateString.split(".");
        const formattedDate = `${parts[0]}.${parts[1]}`;
        const currentYear = new Date().getFullYear();
        const dateObject = new Date(currentYear, parts[1] - 1, parts[0]);
        const daysOfWeek = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
        const dayOfWeek = daysOfWeek[dateObject.getDay()];
        return `${formattedDate} ${dayOfWeek}`;
    };

    const handleDateClick = (dateString) => {
        const datePart = dateString.split(" ")[0]; // Extract the date part
        const parts = datePart.split(".");
        const currentYear = new Date().getFullYear();
        const dateObject = new Date(currentYear, parts[1] - 1, parts[0]);
        onDateSelect(dateObject);
        console.log(dateObject);
        onClose();
    };

    return (
        <div className={`${s.menuPanel} ${isVisible ? s.open : ""}`}>
            <div className={s.menuIcon} onClick={onClose}>
                <FontAwesomeIcon icon={faTimes} />
            </div>
            <ul className={s.menuItems}>
                {taskDates &&
                taskDates.map((date, index) => (
                    <li key={index} onClick={() => handleDateClick(date)}>
                        {date}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MenuPanel;
