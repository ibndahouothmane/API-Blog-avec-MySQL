const express = require('express');
const router = express.Router();

const postsController = require('../controllers/posts');
const { validerPost } = require('../middlewares/validators/post');
const { verifierValidation } = require('../middlewares/validationResult');

router.get('/posts', postsController.getAll);
router.get('/posts/:id', postsController.getById);
router.post('/posts', validerPost, verifierValidation, postsController.create);
router.delete('/posts/:id', postsController.remove);

module.exports = router;