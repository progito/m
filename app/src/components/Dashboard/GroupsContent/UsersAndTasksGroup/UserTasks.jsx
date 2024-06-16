import React from 'react';
import User from "./User/User";
import ItemTask from "./ItemTask/ItemTask";

const UserTasks = (props) => {
    return (
        <div>
            <User username={props.user} />
            {props.tasks.map(task => (
                <ItemTask
                    key={task.id} // Assuming each task has a unique identifier
                    text={task.text}
                    creator={task.creator}
                    recipient={task.recipient}
                    task={task}
                    onEdit={() => {}}
                />
            ))}
        </div>
    );
};

export default UserTasks;
