const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users');

router.get('/users/:id/posts', usersController.getUserPosts);

module.exports = router;