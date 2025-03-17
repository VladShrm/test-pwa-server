require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'https://client.yourdomain.com'],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.listen(5001, () => console.log('Server running on http://localhost:5001'));

const SECRET = 'testsecret';

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'test' && password === 'test') {
        const token = jwt.sign({ user: username }, SECRET, { expiresIn: '24h' });
        res.cookie('authToken', token, { httpOnly: true, secure: true, sameSite: 'None' });
        return res.json({ message: 'Logged in' });
    }
    res.status(401).json({ message: 'Unauthorized' });
});

app.get('/api/me', (req, res) => {
    console.log("Cookies:", req.cookies);
    const token = req.cookies.authToken;
    if (!token) return res.status(401).json({ message: 'Not logged in' });

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        res.json({ user: decoded.user });
    });
});
