const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');

// Aplica o middleware de autenticação em todas as rotas de produtos
router.use(authMiddleware);

router.post('/', productController.create);
router.get('/', productController.getAll);
router.get('/:id', productController.getById);
router.put('/:id', productController.update);
router.delete('/:id', productController.delete);

module.exports = router;