import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import s from "./ItemList.module.css";
import TabOption from "../TabOption/TabOption";

const ItemList = (props) => {
    const [isOptionVisible, setIsOptionVisible] = useState(false);
    const [isChecked, setIsChecked] = useState((props.task.success === 1)); // Добавляем состояние для чекбокса
    let name = undefined;
    let isUppercase= false;
    const [c, rec] = props.rec ? props.rec.split("@") : ["", ""]; // Добавлена проверка на существование props.rec

    if (props.creator !== rec && props.creator !== null) {
        name = props.creator[0].toUpperCase();
        isUppercase = name.charAt(0) === name.charAt(0).toUpperCase();
    }



    const toggleOptionVisibility = () => {
        setIsOptionVisible(!isOptionVisible);
    };

    const toggleCheckbox = async () => {
        setIsChecked(!isChecked);
        console.log(props.task);

        const updatedTask = {
            ...props.task,
            // Здесь можно добавить любые другие поля, которые вы хотите обновить при изменении состояния чекбокса
            success: (isChecked === false) ? 1 : 0 // Пример: обновление состояния выполнения задачи
        };
        console.log(updatedTask);

        try {
            const response = await fetch(`http://localhost:3001/api/update-task/${props.task.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTask),
            });

            if (response.ok) {
                console.log('Task updated successfully');
                // Если требуется выполнить дополнительные действия после обновления задачи
            } else {
                console.error('Failed to update task');
            }
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const formatTaskText = (text) => {
        // Регулярное выражение для поиска времени в формате HH:MM
        const timeRegex = /(\b\d{1,2}:\d{2}\b)/g;
        // Заменяем найденные временные строки на HTML с тегом для стилизации
        return text.replace(timeRegex, `<span class="${s.timeHighlight}">$1</span>`);
    };

    const deleteTask = async (taskId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/delete-task/${taskId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                console.log('Task deleted successfully');
                // Perform any additional actions after deletion if needed
            } else {
                console.error('Failed to delete task');
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
        setIsOptionVisible(false);
    };
    const moveTaskToNextDay = async (taskId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/move-task-to-next-day/${taskId}`, {
                method: 'PUT'
            });
            if (response.ok) {
                console.log('Task moved to next day successfully');
                // Perform any additional actions after moving the task if needed
            } else {
                console.error('Failed to move task to next day');
            }
        } catch (error) {
            console.error('Error moving task to next day:', error);
        }
        setIsOptionVisible(false);
    };


    return (
        <div className={s.taskContainer}>
            <div className={`${s.taskCheckBox} ${isChecked ? s.checked : ''}`} onClick={toggleCheckbox}></div>
            <div className={s.blockText} onClick={toggleOptionVisibility}>
            <span className={`${s.taskText} ${isChecked ? s.checked : ''}`}
                  dangerouslySetInnerHTML={{__html: formatTaskText(props.text)}}>
            </span>
                {name && <span className={`${s.creator} ${isUppercase ? s.uppercase : s.lowercase}`}>{name}</span>}
            </div>

            {isOptionVisible && (
                <TabOption
                    isVisible={isOptionVisible}
                    onDone={() => console.log("Выполнено")}
                    onEdit={() => console.log("Изменить")}
                    onDuplicate={() => console.log("Дублировать")}
                    onNextDay={() => moveTaskToNextDay(props.task.id)}
                    onOtherDate={() => console.log("На другую дату")}
                    onDelete={()=> deleteTask(props.task.id)}
                    onClose={() => setIsOptionVisible(false)}
                    task={props.task}
                />
            )}
        </div>
    );

};

export default ItemList;
