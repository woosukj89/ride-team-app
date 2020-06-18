import React, { useState, useEffect } from "react";
import userService from "../service/UserService";
import helper from "../service/helpers";

const QueueContext = React.createContext({activeQueue: null, queueError: null});

const QueueProvider = (props) => {
    const [activeQueue, setActiveQueue] = useState(null);
    const [queueError, setQueueError] = useState(null);

    useEffect(() => {
        userService.getQueue(helper.getDate(new Date())).then(res => {
            if (res.data) {
                setActiveQueue(res.data);
            }
            if (res.error) {
                setQueueError(res.error);
            }
        })
    }, []);

    return (
       <QueueContext.Provider value={{activeQueue, queueError}}>
           {props.children}
       </QueueContext.Provider>
    )
};

export { QueueContext, QueueProvider };

