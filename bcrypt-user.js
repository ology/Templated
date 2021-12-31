const sqlite = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const who = 'fred'; //'gene';
const passcode = 'flintstone'; //'abc123';
const saltRounds = 10;

const db = new sqlite.Database('auth.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to sqlite');
});

bcrypt.hash(passcode, saltRounds, function(err, hash) {
    const sql = 'UPDATE user SET passcode = ? WHERE username = ?';
    db.run(sql, [hash, who], (err, row) => {
        if (err) {
            console.log(err);
        }
    });
});

db.close();