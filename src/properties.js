
export const properties = {
    apiHost: "http://localhost:8000",
    googleAPIkey: "AIzaSyATCBfUza4SMCMo-TKMqHu9UtCucSrMcxs",
};

export const API_URLs = {
    riders: "/api/riders",
    rider: "/api/rider/",
    ridees: "/api/ridees",
    ridee: "/api/ridee/",
    history: "/api/ride/history",
    queue: "/api/ride/queue",
    daysAllowed: "/api/ride/daysallowed",
    rideAvailability: "/api/ride/availability/",
    rideNeeded: "/api/ride/request/",
    daysRef: "/api/reference/days",
    typesRef: "/api/reference/types"
};

export const Constants = {
    DayRef: {
        1: '월',
        2: '화',
        3: '수',
        4: '목',
        5: '금',
        6: '토',
        0: '일',
    },
    RideTypes: ['교회', '귀가'],
};