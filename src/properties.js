
export const properties = {
    apiHost: "http://localhost:8000",
};

export const API_URLs = {
    riders: "/api/riders",
    rider: "/api/rider/",
    ridees: "/api/ridees",
    ridee: "/api/ridee/",
    pending: "/api/ride/pending",
    history: "/api/ride/history",
    historyDetail: "/api/ride/history/detail/",
    queue: "/api/ride/queue/",
    daysAllowed: "/api/ride/daysallowed",
    rideAvailability: "/api/ride/availability/",
    rideNeeded: "/api/ride/request/",
    daysRef: "/api/reference/days",
    typesRef: "/api/reference/types",
    assignment: "/api/ride/assignment",
    login: "/api/login"
};

export const Constants = {
    DayRef: {
        1: '월',
        2: '화',
        3: '수',
        4: '목',
        5: '금',
        6: '토',
        7: '일',
    },
    RideTypes: ['교회', '귀가'],
    ChurchAddress: "1519 W Belt Line Rd, Carrollton, TX 75006"
};