require('dotenv').config();
const express = require('express');
const pool = require('./src/config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Test database connection
app.get('/test-db', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        await connection.ping();
        connection.release();
        res.json({ message: 'Database connection successful!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});