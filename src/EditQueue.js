import React, { useEffect, useState } from "react";
import userService from "./service/UserService";
import helper from "./service/helpers";

const EditQueue = (props) => {
    const [activeQueue, setActiveQueue] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        userService.getQueue(helper.getDate(new Date())).then(queue => {
            if (queue.data) {
                const queueData = queue.data;
                queueData.new = false;
                setActiveQueue(queue.data)
            }
        });
    }, []);

    const handleChange = (event) => {
        const name = event.target.name;
        const value = name === "ACTIVE" || name === "ASSIGNMENT_COMPLETE" ? event.target.checked : event.target.value;
        console.log(value);
        const state = {
            ...activeQueue,
            [name]: value
        };
        setActiveQueue(state);
    };

    const addNewQueue = () => {
        const queueData = {
            START_DATE: undefined,
            END_DATE: undefined,
            EXPIRE_DATE: undefined,
            ACTIVE: true,
            ASSIGNMENT_COMPLETE: false
        };
        setActiveQueue(queueData);
    };

    const saveChanges = () => {
        setSaving(true);
        userService.saveQueue(activeQueue).then(res => {
            setSaving(false);
            console.log(res);
        });
    };

    return (
        <div>
            <div>
                Active Queue
            </div>
            {!!activeQueue &&
            <div>
                <label>Start Date: <input name="START_DATE"
                                          type="date"
                                          value={activeQueue.START_DATE}
                                          onChange={handleChange} /></label>
                <label>End Date: <input type="date"
                                        name="END_DATE"
                                        value={activeQueue.END_DATE}
                                        onChange={handleChange}/></label>
                <label>Expire Date: <input name="EXPIRE_DATE"
                                           type="date"
                                           value={activeQueue.EXPIRE_DATE}
                                           onChange={handleChange}/></label>
                <label>Active? : <input name="ACTIVE"
                                        type="checkbox"
                                        checked={activeQueue.ACTIVE}
                                        onChange={handleChange} /></label>
                <label>Assignment Complete? : <input name="ASSIGNMENT_COMPLETE"
                                                     type="checkbox"
                                                     checked={activeQueue.ASSIGNMENT_COMPLETE}
                                                     onChange={handleChange}/></label>
                {!saving ?
                <button onClick={saveChanges}>Save</button> : <button disabled>Saving...</button>}
            </div>
            }
            {!activeQueue &&
            <div>
                <button onClick={addNewQueue}>Add New Queue</button>
            </div>}
        </div>
    )
};

export default EditQueue;