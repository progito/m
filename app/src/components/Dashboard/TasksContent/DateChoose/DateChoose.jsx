import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import s from "./DateChoose.module.css";
import ru from 'date-fns/locale/ru';


const DateChoose = ({ date, onDateChange }) => {
    const [selectedDate, setSelectedDate] = useState(date);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [touchStartX, setTouchStartX] = useState(null);
    const containerRef = useRef(null);

    const handleDateChange = (date) => {
        onDateChange(date);
        setSelectedDate(date);
        setIsDatePickerOpen(false); // Закрываем выбор даты после изменения
    };

    const toggleDatePicker = () => {
        setIsDatePickerOpen(!isDatePickerOpen);
    };
    useEffect(() => {
        setSelectedDate(date);
    }, [date]);



    const handleContainerClick = () => {
        setIsDatePickerOpen(true);
    };

    const handleSwipeStart = (e) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleSwipeMove = (e) => {
        if (!touchStartX) return;
        const touchCurrentX = e.touches[0].clientX;
        const diff = touchStartX - touchCurrentX;

        if (diff > 50) { // Порог свайпа, можно настроить под себя
            handleNextDay();
            setTouchStartX(null);
        } else if (diff < -50) {
            handlePreviousDay();
            setTouchStartX(null);
        }
    };

    const handleSwipeEnd = () => {
        setTouchStartX(null);
    };

    const handlePreviousDay = () => {
        const prevDay = new Date(selectedDate);
        prevDay.setDate(selectedDate.getDate() - 1);
        setSelectedDate(prevDay);
        onDateChange(prevDay);
    };

    const handleNextDay = () => {
        const nextDay = new Date(selectedDate);
        nextDay.setDate(selectedDate.getDate() + 1);
        setSelectedDate(nextDay);
        onDateChange(nextDay);
    };

    // Закрытие datepicker при клике вне его области
    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsDatePickerOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className={`${s.container} ${isDatePickerOpen ? s.active : ""}`} ref={containerRef} onClick={handleContainerClick}
             onTouchStart={handleSwipeStart} onTouchMove={handleSwipeMove} onTouchEnd={handleSwipeEnd}>
            {selectedDate && (
                <p className={s.dateText}>
                    {selectedDate.toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" })}
                </p>
            )}

            {isDatePickerOpen && (
                <div className={s.datePicker}>
                    <DatePicker
                        selected={date}
                        onChange={handleDateChange}
                        dateFormat="MMMM d, yyyy"
                        locale={ru} // устанавливаем русскую локаль для DatePicker
                        inline
                    />
                </div>
            )}
        </div>
    );
};

export default DateChoose;
