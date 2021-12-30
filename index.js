const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const router = express.Router();

// use the environment variable first
const port = process.env.PORT || '3333';

// use a static directory
app.use(express.static(path.join(__dirname, 'public')));

// set the pug views directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: true }));

app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({ extended: true }));

let sess; // global session for demo purposes

router.get('/', (req, res) => {
    sess = req.session;
    if (sess.email) {
        return res.redirect('/admin');
    }
    res.render('index', { title: 'Login'});
});

router.get('/login', (req, res) => {
    res.redirect('/');
});
router.post('/login', (req, res) => {
    sess = req.session;
    sess.email = req.body.email;
    res.redirect('/admin');
});

router.get('/admin', (req, res) => {
    sess = req.session;
    if (sess.email) {
        res.write(`<b>Hello ${sess.email}</b> | <a href="/logout">Logout</a>`);
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
