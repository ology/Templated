const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const sqlite = require('sqlite3').verbose();
const { open } = require('sqlite');
const bcrypt = require('bcrypt');

const app = express();
const router = express.Router();

// use the environment variable first
const port = process.env.PORT || '3333';

// use a static directory
app.use(express.static(path.join(__dirname, 'public')));

// set the pug views directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// have a session!
app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: true }));
let sess; // global session for demo purposes

// setup bodyParser...
app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({ extended: true }));

// global db - oof!
let db;
(async () => {
    db = await open({
      filename: 'auth.db',
      driver: sqlite.Database
    })
})()

router.get('/', (req, res) => {
    sess = req.session;
    if (sess.username) {
        return res.redirect('/admin');
    }
    res.render('index', { title: 'Login'});
});

router.get('/login', (req, res) => {
    res.redirect('/');
});
router.post('/login', async (req, res, next) => {
    sess = req.session;
    data = await getUser(req.body.username);
    bcrypt.compare(req.body.passcode, data.passcode, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            if (result == true) {
                sess.username = data.username;
            }
            else {
                console.log(`Incorrect passcode for ${req.body.username}`);
            }
        }
        res.redirect('/admin');
    });
});

router.get('/admin', (req, res) => {
    sess = req.session;
    if (sess.username) {
        res.write(`<b>Hello ${sess.username}</b> | <a href="/logout">Logout</a>`);
        res.end();
    }
    else {
        res.redirect('/');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/');
    });
});

app.use('/', router);

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}/`);
});

async function getUser(who) {
    try {
        const sql = 'SELECT * FROM user WHERE username = ?';
        const row = await db.get(sql, [who]);
        return row;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}