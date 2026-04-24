const pool = require('../config/db');

async function getAll(req, res, next) {
    try {
        const [rows] = await pool.query(`
      SELECT 
        posts.*,
        users.nom AS auteur
      FROM posts
      JOIN users ON posts.user_id = users.id
      WHERE posts.publie = TRUE
      ORDER BY posts.created_at DESC
    `);

        res.json(rows);
    } catch (err) {
        next(err);
    }
}

async function getById(req, res, next) {
    try {
        const { id } = req.params;

        const [posts] = await pool.query(
            `
      SELECT 
        posts.*,
        users.nom AS auteur
      FROM posts
      JOIN users ON posts.user_id = users.id
      WHERE posts.id = ?
      `,
            [id]
        );

        if (posts.length === 0) {
            return res.status(404).json({ erreur: 'Post introuvable' });
        }

        const post = posts[0];

        const [commentaires] = await pool.query(
            `
      SELECT 
        comments.id,
        comments.texte,
        comments.user_id,
        comments.post_id,
        comments.created_at,
        users.nom AS auteur
      FROM comments
      JOIN users ON comments.user_id = users.id
      WHERE comments.post_id = ?
      ORDER BY comments.created_at ASC
      `,
            [id]
        );

        res.json({
            ...post,
            commentaires
        });
    } catch (err) {
        next(err);
    }
}

async function create(req, res, next) {
    try {
        const { titre, contenu, user_id, publie = false } = req.body;

        const [result] = await pool.query(
            `
      INSERT INTO posts (titre, contenu, publie, user_id)
      VALUES (?, ?, ?, ?)
      `,
            [titre, contenu, publie, user_id]
        );

        const [rows] = await pool.query(
            `
      SELECT *
      FROM posts
      WHERE id = ?
      `,
            [result.insertId]
        );

        res.status(201).json(rows[0]);
    } catch (err) {
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        const { id } = req.params;

        const [countRows] = await pool.query(
            `
      SELECT COUNT(*) AS total
      FROM comments
      WHERE post_id = ?
      `,
            [id]
        );

        if (countRows[0].total > 0) {
            return res.status(409).json({
                erreur: 'Impossible de supprimer un post avec des commentaires'
            });
        }

        const [result] = await pool.query(
            `
      DELETE FROM posts
      WHERE id = ?
      `,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ erreur: 'Post introuvable' });
        }

        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = { getAll, getById, create, remove };