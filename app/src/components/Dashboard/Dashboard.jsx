import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Tabs from "./Tabs/Tabs";
import TasksContent from "./TasksContent/TasksContent";
import GroupsContent from "./GroupsContent/GroupsContent";

const Dashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('user-information') || localStorage.getItem('user-information') === null) {
            navigate('/');
        }
    }, [navigate]);

    return (
        <div className="dashboard">
            <Tabs/>
            {/* Здесь можно добавить компоненты для отображения задач и групп */}

        </div>
    );
}

export default Dashboard;
