import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import s from "./TabOption.module.css";

const TabOption = ({ isVisible, onClose, onDone, onEdit, onDuplicate, onNextDay, onOtherDate, onDelete, task }) => {
    const [editMode, setEditMode] = useState(false);
    const [editedTask, setEditedTask] = useState({
        text: task.text,
        recipient: task.recipient,
        date: task.date,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedTask({ ...editedTask, [name]: value });
    };

    const handleSave = async () => {
        await fetch(`http://localhost:3001/api/update-task/${task.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editedTask),
        });

        setEditMode(false);
        onEdit(); // Обновление списка задач после редактирования
    };

    const handleDateChange = (date) => {
        // Преобразование даты в нужный формат "день.месяц.год"
        const formattedDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
        setEditedTask({ ...editedTask, date: formattedDate });
    };

    return (
        <div className={`${s.tabOption} ${isVisible ? s.visible : s.disable}`}>
            {editMode ? (
                <div className={s.editInputs}>
                    <input
                        type="text"
                        name="text"
                        value={editedTask.text}
                        onChange={handleInputChange}
                        placeholder="Описание задачи"
                    />
                    <input
                        type="text"
                        name="recipient"
                        value={editedTask.recipient}
                        onChange={handleInputChange}
                        placeholder="Кому адресовано @username"
                    />
                    <div className={s.datePicker}>
                        <DatePicker
                            selected={new Date(editedTask.date)} // Преобразование строки в объект Date
                            onChange={handleDateChange}
                            dateFormat="dd.MM.yyyy" // Формат даты "день.месяц.год"
                            placeholderText="Выберите дату"
                        />
                    </div>
                    <button className={s.button} onClick={handleSave}>Сохранить</button>
                    <button className={s.button} onClick={() => setEditMode(false)}>Отмена</button>
                </div>
            ) : (
                <>
                    <button className={s.button} onClick={() => setEditMode(true)}>Изменить</button>
                    <button className={s.button} onClick={onDuplicate}>Дублировать</button>
                    <button className={s.button} onClick={onNextDay}>На следующий день</button>
                    <button className={s.button} onClick={onOtherDate}>На другую дату</button>
                    <button className={`${s.button} ${s.deleteButton}`} onClick={onDelete}>Удалить задачу</button>
                    <button className={`${s.button} ${s.closeButton}`} onClick={onClose}>Закрыть</button>
                </>
            )}
        </div>
    );
};

export default TabOption;
