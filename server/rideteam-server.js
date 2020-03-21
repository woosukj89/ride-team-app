const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;
const bodyParser = require('body-parser');

const db = require('../db/db_operations');

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Method", 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    next();
});

app.options('*', cors());

// Start server
app.listen(PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", PORT))
});
// Root endpoint
app.get("/", (req, res, next) => {
    res.json({"message":"OK"})
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

app.get("/api/ride/history", (req, res, next) => {
    let sql = 'SELECT * FROM RIDE_HISTORY ';
    const condition = 'WHERE DATE BETWEEN ? AND ?';
    let params = [];
    if(req.body.start_date && req.body.end_date) {
       sql += condition;
       params = [req.body.start_date, req.body.end_date];
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

app.patch("/api/ride/history/:id", (req, res, next) => {
    const sql = "UPDATE RIDE_HISTORY SET \
        RIDEE = COALESCE(?, RIDEE),\
        RIDER = COALESCE(?, RIDER),\
        DAY = COALESCE(?, DAY),\
        DATE = COALESCE(?, DATE),\
        TYPE = COALESCE(?, TYPE),\
        CANCELLED = COALESCE(?, CANCELLED),\
        WHERE ID = ?";
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

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});