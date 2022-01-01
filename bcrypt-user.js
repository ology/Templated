const sqlite = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const read = require('read')

const myArgs = process.argv.slice(2);
const who = myArgs[0];

read({ prompt: 'Password: ', silent: true }, (er, password) => {
    passcode = password;
});
const passcode = myArgs[1];
console.log('Updating passcode for:', who, '...');

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
        else {
            console.log('Done.');
        }
    });
});

db.close();
console.log('Disonnected from sqlite');