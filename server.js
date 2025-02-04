const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

//static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Default route 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
