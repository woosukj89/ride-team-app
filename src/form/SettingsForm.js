
const createInitialNotificationsForm = () => {
    return {
        active: false,
        touched: false,
        error: false,
    }
};

 const getInitialRideeNotificationsSettingsForm = () => {
    return {
        whenWeekStarts: createInitialNotificationsForm(),
        requestReminder: createInitialNotificationsForm(),
        whenRiderStarts: createInitialNotificationsForm(),
        whenRiderArrives: createInitialNotificationsForm(),
        whenAssigned: createInitialNotificationsForm()
    }
 };

 const getInitialRiderNotificationsSettingsForm = () => {
     return {
         whenWeekStarts: createInitialNotificationsForm(),
         whenAssigned: createInitialNotificationsForm(),
         availabilityReminder: createInitialNotificationsForm()
     }
 };

 const displayNameReference = {
     whenWeekStarts: "Remind me when new week starts",
     requestReminder: "Remind me to make ride requests",
     whenRiderStarts: "Notify me when rider starts",
     whenRiderArrives: "Notify me when rider arrives",
     whenAssigned: "Notify me when rides are assigned",
     availabilityReminder: "Remind me to select availability"
 };

 export {
     getInitialRideeNotificationsSettingsForm,
     getInitialRiderNotificationsSettingsForm,
     displayNameReference
 }