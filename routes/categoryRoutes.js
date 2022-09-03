const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const categoryController = require('../controllers/categoryController');

router.get('/', categoryController.getAllCategory);
router.get('/:id', categoryController.getCategory);
router.post('/', upload.single('avatar'), categoryController.createNewCategory);
router.patch('/:id', upload.single('avatar'), categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;