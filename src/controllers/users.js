const pool = require('../config/db');

async function getUserPosts(req, res, next) {
    try {
        const { id } = req.params;

        const [users] = await pool.query(
            'SELECT id, nom, email FROM users WHERE id = ?',
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({ erreur: 'Utilisateur introuvable' });
        }

        const [posts] = await pool.query(
            `
      SELECT *
      FROM posts
      WHERE user_id = ?
      ORDER BY created_at DESC
      `,
            [id]
        );

        res.json({
            utilisateur: users[0],
            posts
        });
    } catch (err) {
        next(err);
    }
}

module.exports = { getUserPosts };