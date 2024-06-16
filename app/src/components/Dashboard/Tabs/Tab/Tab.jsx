import React from "react";
import s from "./Tab.module.css";

const Tab = ({ text, active, onClick }) => {
    return (
        <div className={`${s.tab} ${active ? s.active : ""}`} onClick={onClick}>
            {text}
        </div>
    );
};

export default Tab;
