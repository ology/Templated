const sqlite = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const myArgs = process.argv.slice(2);
const who = myArgs[0];
const passcode = myArgs[1];
console.log('Updating passcode for', who, '...');

const saltRounds = 10;

const db = new sqlite.Database('auth.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to sqlite');
});

bcrypt.hash(passcode, saltRounds, (err, hash) => {
    let sql = 'SELECT * FROM user WHERE username = ?';
    db.get(sql, [who], (err, row) => {
        if (err) {
            console.log(err.message);
        }
        else {
            if (row) {
                sql = 'UPDATE user SET passcode = ? WHERE username = ?';
                db.run(sql, [hash, who], (err) => {
                    if (err) {
                        console.log(err.message);
                    }
                    console.log('Done.');
                });
            }
            else {
                console.log(`No such user ${who}`)
            }
        }
    });
});