require('dotenv').config();

const express = require('express');
const app = express();

const postsRoutes = require('./src/routes/posts');
const usersRoutes = require('./src/routes/users');

app.use(express.json());

app.use(postsRoutes);
app.use(usersRoutes);

app.use((err, req, res, next) => {
    console.error(err);

    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({ erreur: 'user_id invalide : utilisateur inexistant' });
    }

    res.status(500).json({ erreur: 'Erreur serveur' });
});

app.listen(3000, () => {
    console.log('Serveur démarré sur http://localhost:3000');
});