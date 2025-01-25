const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const { rateLimit } = require('express-rate-limit');

const app = express();
const port = 3000;

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, 
	limit: 100,
	standardHeaders: 'draft-8', 
	legacyHeaders: false, 
    message: 'Too many requests, please try again later.',
})

app.use(limiter);
app.use(bodyParser.json());
app.use(cors());

const db = new sqlite3.Database('./azebin.db', (err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the SQLite database.');
});

db.run(`CREATE TABLE IF NOT EXISTS pastes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    identifier TEXT UNIQUE NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

app.post('/pastes', (req, res) => {
    const { title, content } = req.body;
    const identifier = makeid(5);
    if(title.length > 200 || content.length > 10000) {
        return res.status(400).json({ error: 'Title or content too long' });
    }
    const query = `
        INSERT INTO pastes (title, content, identifier, timestamp)
        VALUES (?, ?, ?, datetime('now'))
    `;
    db.run(query, [title, content, identifier], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: identifier });
    });
});

app.get('/pastes/:identifier', (req, res) => {
    const { identifier } = req.params;
    db.get('SELECT * FROM pastes WHERE identifier = ?', [identifier], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Paste not found' });
        }
        res.json(row);
    });
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});