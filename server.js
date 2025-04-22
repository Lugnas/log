import express from 'express';
import sqlite3 from 'sqlite3';
import session from 'express-session';
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');


app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true
}));




app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Failed to logout.");
        }

        res.render("logout");
    });
});

app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Failed to logout.");
        }
        res.redirect("/");
    });
});



const db = new sqlite3.Database('quotes.db', (err) => {
    if (err) {
        console.error("error", err);
    } else {
        console.log("Databasen fungerar!");


        db.run(`
            CREATE TABLE IF NOT EXISTS info (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS quotes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,men
                quote TEXT NOT NULL,
                author TEXT NOT NULL
            )
        `);


    }
});




app.get("/login", (req, res) => {
    res.render("login");
});


app.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.get(
        'SELECT * FROM info WHERE email = ? AND password = ?',
        [email, password],
        (err, user) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Something went wrong!");
            }

            if (!user) {
                return res.status(401).send("Wrong password.");
            }

            res.render("dashboard", { user });
        }
    );
});







//post login


app.get("/", (req, res) => {
    db.all('SELECT * FROM quotes', (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).send('Database error');
            return;
        }
        res.render('index', { quotes: rows });
    });
});

app.get("/register", (req, res) => {
    res.render('register');
});

app.post("/register", (req, res) => {
    const { name, email, password } = req.body;

    db.run(
        'INSERT INTO info (name, email, password) VALUES (?, ?, ?)',
        [name, email, password],
        function (err) {
            if (err) {
                console.error(err);
                return res.status(500).send("Något gick fel vid registreringen!");
            }

            res.send("Login successful");
        }
    );
});
app.listen(3000, () => {
    console.log('server is up and running');
});
