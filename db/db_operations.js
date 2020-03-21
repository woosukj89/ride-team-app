const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('../db/rideteam.db', (err) => {
    if (err) {
        console.log(err);
        throw err;
    } else {
        console.log("Connected to RideTeam Database.");
    }
});

function getRiders() {
    let results;
    db.all('SELECT * FROM RIDER', [], (err, rows) => {
        if(err) {
            console.log(err);
        }
        results = rows;
    });

    return results;
}

function getRider(id) {
    let result;
    db.get('SELECT * FROM RIDER WHERE ID = ?', [id], (err, row) => {
        if (err) {
            console.log(err);
        }
        result = row;
    });

    return result;
}

module.exports = db;