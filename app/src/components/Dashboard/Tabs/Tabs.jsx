import React, { useState } from "react";
import MenuPanel from "./MenuPanel/MenuPanel";
import Tab from "./Tab/Tab";
import TasksContent from "../TasksContent/TasksContent";
import GroupsContent from "../GroupsContent/GroupsContent";
import s from "./Tabs.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripLines } from "@fortawesome/free-solid-svg-icons";

const Tabs = () => {
    const [activeTab, setActiveTab] = useState("Задачи");
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date()); // Состояние для выбранной даты

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setIsMenuVisible(false);
    };

    const toggleMenuVisibility = () => {
        setIsMenuVisible(!isMenuVisible);
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);

        setActiveTab("Задачи"); // Переключаемся на вкладку "Задачи" при выборе даты
    };

    const renderContent = () => {
        if (activeTab === "Задачи") {
            return <TasksContent selectedDate={selectedDate} />;
        } else if (activeTab === "Группы") {
            return <GroupsContent />;
        }
    };

    return (
        <div>
            <div className={s.tabs}>
                <div className={s.tabContainer}>
                    <Tab text="Задачи" active={activeTab === "Задачи"} onClick={() => handleTabClick("Задачи")} />
                    <Tab text="Группы" active={activeTab === "Группы"} onClick={() => handleTabClick("Группы")} />
                    <div className={s.menuIcon} onClick={toggleMenuVisibility}>
                        <FontAwesomeIcon icon={faGripLines} style={{ fontSize: "24px" }} />
                    </div>
                </div>

                <MenuPanel isVisible={isMenuVisible} onClose={toggleMenuVisibility} onDateSelect={handleDateSelect} />
            </div>
            {renderContent()}
        </div>
    );
};

export default Tabs;
