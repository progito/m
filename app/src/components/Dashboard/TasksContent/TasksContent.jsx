import React, { useState, useEffect, useRef } from "react";
import { ScaleLoader } from "react-spinners";
import DateChoose from "./DateChoose/DateChoose";
import TasksList from "./TasksList/TasksList";
import s from "./TasksContent.module.css";

const TasksContent = ({ selectedDate: initialSelectedDate }) => {
    const [selectedDate, setSelectedDate] = useState(() => {
        const savedDate = localStorage.getItem("selectedDate");
        return savedDate ? new Date(savedDate) : initialSelectedDate;
    });
    const [isLoading, setIsLoading] = useState(false);
    const containerRef = useRef(null);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        localStorage.setItem("selectedDate", date.toISOString());
    };

    const handleScroll = (e) => {
        if (e.deltaY > 0) {
            handleNextDay();
        } else if (e.deltaY < 0) {
            handlePreviousDay();
        }
    };

    const handlePreviousDay = () => {
        const prevDay = new Date(selectedDate);
        prevDay.setDate(selectedDate.getDate() - 1);
        setSelectedDate(prevDay);
    };

    const handleNextDay = () => {
        const nextDay = new Date(selectedDate);
        nextDay.setDate(selectedDate.getDate() + 1);
        setSelectedDate(nextDay);
    };

    const handleTouchStart = (e) => {
        containerRef.current.startX = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        if (!containerRef.current.startX) return;
        const diff = e.touches[0].clientX - containerRef.current.startX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                handlePreviousDay();
            } else {
                handleNextDay();
            }
            containerRef.current.startX = null;
        }
    };

    const handleTouchEnd = () => {
        containerRef.current.startX = null;
    };

    useEffect(() => {
        window.addEventListener("wheel", handleScroll, { passive: true });
        window.addEventListener("touchstart", handleTouchStart);
        window.addEventListener("touchmove", handleTouchMove);
        window.addEventListener("touchend", handleTouchEnd);

        return () => {
            window.removeEventListener("wheel", handleScroll);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, [selectedDate]);

    useEffect(() => {
        if (isLoading) {
            const timeout = setTimeout(() => {
                setIsLoading(false);
            }, 2000); // Имитация загрузки данных

            return () => clearTimeout(timeout);
        }
    }, [isLoading]);

    return (
        <div className={s.container} ref={containerRef}>
            <div className={s.containerContent}>
                <div className={s.dateChooseContainer}>
                    <DateChoose date={selectedDate} onDateChange={handleDateChange} />
                </div>
                <hr />
            </div>
            {isLoading ? (
                <div className={s.center}>
                    <ScaleLoader size={50} color={"#0062ffd1"} loading={isLoading} />
                </div>
            ) : (
                <TasksList selectedDate={selectedDate} />
            )}
        </div>
    );
};

export default TasksContent;
