const express = require('express');
const shortid = require('shortid');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve the frontend HTML file
app.use(express.static(path.join(__dirname, '../frontend')));

// In-memory storage for long and short URL mappings
const urlDatabase = {};

// Endpoint to shorten a URL
app.post('/shorten', (req, res) => {
    const longUrl = req.body.longUrl;

    if (!longUrl) {
        return res.status(400).send('Invalid input');
    }

    const shortCode = generateShortCode();
    const shortUrl = `http://${req.hostname}/${shortCode}`;

    urlDatabase[shortCode] = longUrl;

    res.send(shortUrl);
});

// Endpoint to redirect short URL to original URL
app.get('/:shortCode', (req, res) => {
    const shortCode = req.params.shortCode;
    const longUrl = urlDatabase[shortCode];

    if (!longUrl) {
        return res.status(404).send('Short URL not found');
    }

    res.redirect(longUrl);
});

// Function to generate a unique short code
function generateShortCode() {
    let code = shortid.generate().substring(0, 6); // Get the first 6 characters of the generated shortid
    while (urlDatabase.hasOwnProperty(code)) {
        code = shortid.generate().substring(0, 6);
    }
    return code;
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
