const mapper = require('./data_validate_map');

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;
const bodyParser = require('body-parser');

const db = require('../db/db_operations');

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.header("Access-Control-Allow-Method", 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
//     next();
// });

// app.options('*', cors());

// Start server
app.listen(PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", PORT))
});
// Root endpoint
app.get("/", (req, res, next) => {
    res.json({"message":"OK"})
});

app.post("/api/login", (req, res) => {
    if (!req.body.phone_number) {
        console.log("under phone_number missing");
        res.status(401).json({'error': "Phone number does not exist"});
        return;
    }
    const sql = 'SELECT USER_ID, ROLE, USERNAME FROM USER WHERE PHONE_NUMBER = ?';
    const params = req.body.phone_number;
    db.get(sql, [params], (err, row) => {
        if (err) {
            res.status(400).json({'error': err.message});
            return;
        }
        res.json({
            "message": "success",
            "data": row
        })
    })
});

app.get("/api/riders", (req, res, next) => {
    const sql = 'SELECT * FROM RIDER';
    db.all(sql, [], (err, rows) => {
        if(err) {
            res.status(400).json({'error': err.message});
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        })
    })
});

app.get("/api/rider/:id", (req, res, next) => {
    const sql = 'SELECT * FROM RIDER WHERE ID = ?';
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if(err) {
            res.status(400).json({'error': err.message});
            return;
        }
        res.json({
            "message": "success",
            "data": row
        })
    });
});

app.get("/api/ridees", (req, res, next) => {
    const sql = 'SELECT * FROM RIDEE';
    db.all(sql, [], (err, rows) => {
        if(err) {
            res.status(400).json({'error': err.message});
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        })
    })
});

app.get("/api/ridee/:id", (req, res, next) => {
    const sql = 'SELECT * FROM RIDEE WHERE ID = ?';
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if(err) {
            res.status(400).json({'error': err.message});
            return;
        }
        res.json({
            "message": "success",
            "data": row
        })
    });
});

app.post("/api/rider", (req, res, next) => {
    const sql = 'INSERT INTO RIDER (NAME, ADDRESS, PHONE_NUMBER, LEADER, BIRTHDAY, KAKAO) VALUES (?, ?, ?, ?, ?, ?)';
    const data = {
        name: req.body.name,
        address: req.body.address,
        tel: req.body.tel,
        leader: req.body.leader || '',
        birthday: req.body.birthday || '',
        kakao: req.body.kakao || ''
    };
    const params = [data.name, data.address, data.tel, data.leader, data.birthday, data.kakao];
    db.run(sql, params, function(err, result) {
        if(err) {
            res.status(400).json({'error': err.message});
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id": this.lastID
        })
    });
});

app.post("/api/ridee", (req, res, next) => {
    const sql = 'INSERT INTO RIDEE (NAME, ADDRESS, PHONE_NUMBER, LEADER, KAKAO, LOCATION, SMALL_GROUP) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const data = {
        name: req.body.name,
        address: req.body.address,
        tel: req.body.tel,
        leader: req.body.leader || null,
        kakao: req.body.kakao || null,
        location: req.body.location || null,
        small_group: req.body.small_group || null
    };
    const params = [data.name, data.address, data.tel, data.leader, data.kakao, data.location, data.small_group];
    db.run(sql, params, function(err, result) {
        if(err) {
            res.status(400).json({'error': err.message});
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id": this.lastID
        })
    });
});

// UPDATE RIDER
app.patch("/api/rider/:id", (req, res, next) => {
    const sql = "UPDATE RIDER SET \
        NAME = COALESCE(?, NAME), \
        ADDRESS = COALESCE(?, ADDRESS), \
        PHONE_NUMBER = COALESCE(?, PHONE_NUMBER), \
        LEADER = COALESCE(?, LEADER), \
        BIRTHDAY = COALESCE(?, BIRTHDAY), \
        KAKAO = COALESCE(?, KAKAO) \
        WHERE ID = ?";
    const data = {
        name: req.body.name || null,
        address: req.body.address || null,
        tel: req.body.tel || null,
        leader: req.body.leader || null,
        birthday: req.body.birthday || null,
        kakao: req.body.kakao || null
    };
    const params = [data.name, data.address, data.tel, data.leader, data.birthday, data.kakao, req.params.id];
    db.run(sql, params,
        function(err, result) {
            if(err) {
                console.log(err.message);
                res.status(400).json({'error': err.message});
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
        })
});

// UPDATE RIDEE
app.patch("/api/ridee/:id", (req, res, next) => {
    const sql = "UPDATE RIDEE SET \
        NAME = COALESCE(?, NAME), \
        ADDRESS = COALESCE(?, ADDRESS), \
        PHONE_NUMBER = COALESCE(?, PHONE_NUMBER), \
        LEADER = COALESCE(?, LEADER), \
        KAKAO = COALESCE(?, KAKAO), \
        LOCATION = COALESCE(?, LOCATION), \
        SMALL_GROUP = COALESCE(?, SMALL_GROUP) \
        WHERE ID = ?";
    const data = {
        name: req.body.name || null,
        address: req.body.address || null,
        tel: req.body.tel || null,
        leader: req.body.leader || null,
        kakao: req.body.kakao || null,
        location: req.body.location || null,
        small_group: req.body.small_group || null,
    };
    const params = [data.name, data.address, data.tel, data.leader, data.kakao, data.location, data.small_group, req.params.id];
    db.run(sql, params,
        function(err, result) {
            if(err) {
                res.status(400).json({'error': err.message});
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
        })
});

// app.options("/*", function(req, res, next){
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET,PATCH,PUT,POST,DELETE,OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
//     res.send(200);
// });

app.delete("/api/rider/:id", (req, res, next) => {
    const sql = 'DELETE FROM RIDER WHERE ID = ?';
    const params = [req.params.id];
    db.run(sql, params,
        function (err, result) {
            if (err) {
                res.status(400).json({"error": res.message});
                return;
            }
            res.json({"message": "deleted", changes: this.changes})
        })
});

app.delete("/api/ridee/:id", (req, res, next) => {
    const sql = 'DELETE FROM RIDEE WHERE ID = ?';
    const params = [req.params.id];
    db.run(sql, params,
        function (err, result) {
            if (err) {
                res.status(400).json({"error": res.message});
                return;
            }
            res.json({"message": "deleted", changes: this.changes})
        })
});

app.get("/api/ride/pending", (req, res) => {
    let sql = `SELECT
               D.DAY AS DAY_NAME, 
               T.RIDE_TYPE AS TYPE_NAME,
               P.*
               FROM RIDE_PENDING P
               JOIN DAY_REF D
               ON D.ID = P.DAY
               JOIN TYPE_REF T
               ON T.KEY = P.TYPE`;
    const query = req.query;
    const conditions = [];
    const params = [];

    if (query.queueID) {
        conditions.push('P.QUEUE_ID=?');
        params.push(req.query.queueID);
    }
    if (query.userID && query.role) {
        if (query.role === "rider" || query.role === "admin") {
            conditions.push('P.RIDER_ID=?');
        } else {
            conditions.push('P.RIDEE_ID=?');
        }
        params.push(query.userID);
    }
    if (query.day) {
        conditions.push('P.DAY=?');
        params.push(query.day);
    }
    if (query.type) {
        conditions.push('P.TYPE=?');
        params.push(query.type);
    }

    if (params.length > 0) {
        sql += ' WHERE ';
        sql += conditions.join(' AND ');
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({'error': err.message});
            return;
        }
        res.json({
            "message": "success",
            "data": query.role === "ridee" ? rows : mapper.mapPendingRidesByRider(rows)
        })
    });
});

app.get("/api/ride/pending/all", (req, res) => {
    let sql = `SELECT
               D.DAY AS DAY_NAME, 
               T.RIDE_TYPE AS TYPE_NAME,
               P.*
               FROM RIDE_PENDING P
               JOIN DAY_REF D
               ON D.ID = P.DAY
               JOIN TYPE_REF T
               ON T.KEY = P.TYPE`;
    const query = req.query;
    const conditions = [];
    const params = [];

    if (query.queueID) {
        conditions.push('P.QUEUE_ID=?');
        params.push(req.query.queueID);
    }
    if (query.userID && query.role) {
        if (query.role === "rider" || query.role === "admin") {
            conditions.push('P.RIDER_ID=?');
        } else {
            conditions.push('P.RIDEE_ID=?');
        }
        params.push(query.userID);
    }

    if (params.length > 0) {
        sql += ' WHERE ';
        sql += conditions.join(' AND ');
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({'error': err.message});
            return;
        }
        res.json({
            "message": "success",
            "data": query.role === "ridee" ? rows : mapper.mapPendingRidesByDayType(rows)
        })
    });
});

app.post("/api/ride/pending", (req, res) => {
    let sql = `INSERT INTO RIDE_PENDING (QUEUE_ID, DATE, DAY, TYPE, RIDEE, RIDEE_ID, RIDEE_ADDRESS, RIDER, RIDER_ID, RIDER_ADDRESS) VALUES `;
    const placeholders = req.body.data.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').join(', ');
    sql += placeholders;
    const data = req.body.data.map((row) => [
        row.queueID,
        row.date,
        row.day,
        row.type,
        row.ridee,
        row.rideeID,
        row.rideeAddress,
        row.rider,
        row.riderID,
        row.riderAddress
    ]);
    const params = data.flat();

    db.run(sql, params, function(err, result) {
        if(err) {
            res.status(400).json({'error': err.message});
            console.log(err);
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id": this.lastID
        })
    });

});

app.get("/api/ride/history", (req, res, next) => {
    let sql = 'SELECT * FROM RIDE_HISTORY ';
    let conditions = [];
    const condition = 'DATE BETWEEN ? AND ?';
    const condition2 = 'RIDER=?';
    const condition3 = 'RIDEE=?';

    let params = [];
    if (req.query.start_date && req.query.end_date) {
       conditions.push(condition);
       params = [req.query.start_date, req.query.end_date];
    }
    if (req.query.userID && req.query.role) {
        if (req.query.role === "rider") {
            conditions.push(condition2);
            params.push(req.query.userID);
        }
        else if (req.query.role === "ridee") {
            conditions.push(condition3);
            params.push(req.query.userID);
        }
    }
    if (conditions.length) {
        sql += 'WHERE ';
        sql += conditions.join(" AND");
    }
    db.all(sql, params, (err, rows) => {
        if(err) {
            res.status(400).json({'error': err.message});
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        })
    })
});

app.post("/api/ride/history", (req, res, next) => {
    let sql = 'INSERT INTO RIDE_HISTORY (RIDEE, RIDER, DAY, DATE, TYPE) VALUES ';
    const placeholders = req.body.data.map(() => '(?, ?, ?, ?, ?)').join(', ');
    sql += placeholders;
    const data = req.body.data.map((row) => [row.ridee, row.rider, row.day, row.date, row.type]);
    const params = data.flat();

    db.run(sql, params, function(err, result) {
        if(err) {
            res.status(400).json({'error': err.message});
            console.log(err);
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id": this.lastID
        })
    });
});

app.get("/api/ride/history/detail/:id", (req, res) => {
    let sql = `SELECT
                H.DATE,
                D.DAY,
                T.RIDE_TYPE,
                R.NAME AS RIDER_NAME,
                R.ADDRESS AS RIDER_ADDRESS,
                R.PHONE_NUMBER AS RIDER_PHONE,
                E.NAME AS RIDEE_NAME,
                E.ADDRESS AS RIDEE_ADDRESS,
                E.PHONE_NUMBER AS RIDEE_PHONE,
                H.DISTANCE1,
                H.DISTANCE2
            FROM
            RIDE_HISTORY H
            JOIN RIDER R
            ON H.RIDER_ID = R.ID
            JOIN RIDEE E
            ON H.RIDEE_ID = E.ID
            JOIN DAY_REF D
            ON H.DAY = D.ID
            JOIN TYPE_REF T
            ON H.TYPE = T.KEY
            WHERE H.ID = ?`;
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
            if (err) {
                res.status(400).json({"error": res.message});
                return;
            }
            res.json({"message": "success", data: row})
        })
});

app.patch("/api/ride/history/:id", (req, res, next) => {
    const sql = `UPDATE RIDE_HISTORY SET
        RIDEE = COALESCE(?, RIDEE),
        RIDER = COALESCE(?, RIDER),
        DAY = COALESCE(?, DAY),
        DATE = COALESCE(?, DATE),
        TYPE = COALESCE(?, TYPE),
        CANCELLED = COALESCE(?, CANCELLED),
        WHERE ID = ?`;
    const data = {
        ridee: req.body.ridee || '',
        rider: req.body.rider || '',
        day: req.body.day || '',
        date: req.body.date || '',
        type: req.body.type || '',
        cancelled: req.body.cancelled || ''
    };
    const params = [data.ridee, data.rider, data.day, data.date, data.type, data.cancelled, req.params.id];
    db.run(sql, params,
        function(err, result) {
            if(err) {
                res.status(400).json({'error': err.message});
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
        })
});

app.get("/api/ride/queue", (req, res) => {
    const date = req.query.date;
    const sql = "SELECT * FROM RIDE_QUEUE WHERE ? BETWEEN START_DATE AND END_DATE";
    db.get(sql, [date], (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).json({'error': err.message});
            return;
        }
        res.json({
            message: "success",
            data: result
        })
    });
});

app.patch("/api/ride/queue/:id", (req, res) => {
    const sql = `UPDATE RIDE_QUEUE SET
        START_DATE = COALESCE(?, START_DATE),
        END_DATE = COALESCE(?, END_DATE),
        EXPIRE_DATE = COALESCE(?, EXPIRE_DATE),
        ACTIVE = COALESCE(?, ACTIVE),
        ASSIGNMENT_COMPLETE = COALESCE(?, ASSIGNMENT_COMPLETE)
        WHERE ID = ?`;
    const data = {
        ...req.body,
        ACTIVE: req.body.ACTIVE ? 1 : 0,
        ASSIGNMENT_COMPLETE: req.body.ASSIGNMENT_COMPLETE ? 1 : 0
    };
    const params = [data.START_DATE, data.END_DATE, data.EXPIRE_DATE, data.ACTIVE, data.ASSIGNMENT_COMPLETE, req.params.id];

    db.run(sql, params, function(err, result) {
        if(err) {
            res.status(400).json({'error': err.message});
            return;
        }
        res.json({
            message: "success",
            data: data,
            changes: this.changes
        })
    });
});

app.post("/api/ride/queue", (req, res) => {
    const sql = `INSERT INTO RIDE_QUEUE (START_DATE, END_DATE, EXPIRE_DATE, ACTIVE, ASSIGNMENT_COMPLETE) 
                 VALUES (?, ?, ?, ?, ?)`;
    const data = {
        ...req.body,
        ACTIVE: req.body.ACTIVE ? 1 : 0,
        ASSIGNMENT_COMPLETE: req.body.ASSIGNMENT_COMPLETE ? 1 : 0
    };
    const params = [data.START_DATE, data.END_DATE, data.EXPIRE_DATE, data.ACTIVE, data.ASSIGNMENT_COMPLETE];

    db.run(sql, params, function(err, result) {
        if(err) {
            res.status(400).json({'error': err.message});
            console.log(err);
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id": this.lastID
        })
    });
});

app.get("/api/ride/daysallowed", (req, res) => {
    const sql = `SELECT *
                 FROM DAYS_ALLOWED
                 WHERE ACTIVE = 1`;
    db.all(sql, [], (error, result) => {
        if (error) {
            console.log(error);
            res.status(400).json({'error': error.message});
            return;
        }
        res.json({
            message: "success",
            data: mapper.mapDaysAllowed(result)
        })
    })
});

app.get("/api/reference/days", (req, res) => {
    const sql = "SELECT * FROM DAY_REF";
    db.all(sql, [], (error, result) => {
        if (error) {
            console.log(error);
            res.status(400).json({'error': error.message});
            return;
        }
        res.json({
            message: "success",
            data: result
        })
    })
});

app.get("/api/reference/types", (req, res) => {
    const sql = "SELECT * FROM TYPE_REF";
    db.all(sql, [], (error, result) => {
        if (error) {
            console.log(error);
            res.status(400).json({'error': error.message});
            return;
        }
        res.json({
            message: "success",
            data: result
        })
    })
});

app.get("/api/ride/availability", (req, res) => {
    let params, sql;

    if (req.query.userID) {
        params = [req.query.queueID, req.query.userID];
        sql = `SELECT * FROM RIDER_AVAILABILITY WHERE QUEUE_ID=? AND RIDER_ID=?`;
    } else {
        params = [req.query.queueID];
        sql = `SELECT RA.*, R.NAME
            FROM RIDER_AVAILABILITY RA
            INNER JOIN RIDER R
            ON R.ID = RA.RIDER_ID
            WHERE QUEUE_ID=? ORDER BY DAY, TYPE, RIDER_ID`;
    }

    db.all(sql, params, (error, result) => {
        if (error) {
            res.status(400).json({'error': error.message});
            return;
        }
        res.json({
            message: "success",
            data: result
        })
    });
});

app.get("/api/ride/request", (req, res) => {
    let params, sql;

    if (req.query.userID) {
        params = [req.query.queueID, req.query.userID];
        sql = `SELECT * FROM RIDE_REQUEST WHERE QUEUE_ID=? AND RIDEE_ID=?`;
    } else {
        params = [req.query.queueID];
        sql = `SELECT RQ.*, E.NAME
            FROM RIDE_REQUEST RQ
            INNER JOIN RIDEE E
            ON E.ID = RQ.RIDEE_ID
            WHERE QUEUE_ID=? ORDER BY DAY, TYPE, RIDEE_ID`;
    }

    db.all(sql, params, (error, result) => {
        if (error) {
            res.status(400).json({'error': error.message});
            return;
        }
        res.json({
            message: "success",
            data: result
        })
    });
});

app.put("/api/ride/availability/:id", (req, res) => {
    const riderID = req.params.id;
    const queueID = req.body.queueID;
    const data = req.body.data.map(row => [queueID, row.day, row.type, riderID]);
    const params = data.flat();
    const placeholders = req.body.data.map(() => '(?, ?, ?, ?)').join(', ');
    const sql1 = "DELETE FROM RIDER_AVAILABILITY WHERE RIDER_ID = ? AND QUEUE_ID = ?";
    const sql2 = "INSERT INTO RIDER_AVAILABILITY (QUEUE_ID, DAY, TYPE, RIDER_ID) VALUES " + placeholders;

    db.run(sql1, [riderID, queueID], (err) => {
        if(err) {
            res.status(400).json({'error': err.message});
            return;
        }
        if(data.length) {
            db.run(sql2, params,
                function(err, result) {
                    if(err) {
                        res.status(400).json({'error': err.message});
                        return;
                    }
                    res.json({
                        message: "success",
                        data: data,
                        changes: this.changes
                    })
                }
            )
        } else {
            res.json({
                message: "success"
            })
        }
    });
});

app.put("/api/ride/request/:id", (req, res) => {
    const rideeID = req.params.id;
    const queueID = req.body.queueID;
    const data = req.body.data.map(row => [queueID, row.day, row.type, rideeID]);
    const params = data.flat();
    const placeholders = req.body.data.map(() => '(?, ?, ?, ?)').join(', ');
    const sql1 = "DELETE FROM RIDE_REQUEST WHERE RIDEE_ID = ? AND QUEUE_ID = ?";
    const sql2 = "INSERT INTO RIDE_REQUEST (QUEUE_ID, DAY, TYPE, RIDEE_ID) VALUES " + placeholders;

    db.run(sql1, [rideeID, queueID], (err) => {
        if(err) {
            res.status(400).json({'error': err.message});
            return;
        }
        if(data.length) {
            db.run(sql2, params,
                function(err, result) {
                    if(err) {
                        res.status(400).json({'error': err.message});
                        return;
                    }
                    res.json({
                        message: "success",
                        data: data,
                        changes: this.changes
                    })
                }
            )
        } else {
            res.json({
                message: "success"
            })
        }
    });
});

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});