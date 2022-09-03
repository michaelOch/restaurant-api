const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const subCategoryController = require('../controllers/subCategoryController');

router.get('/', subCategoryController.getAllSubCategory);
router.get('/:id', subCategoryController.getSubCategory);
router.post('/', upload.single('avatar'), subCategoryController.createNewSubCategory);
router.patch('/:id', upload.single('avatar'), subCategoryController.updateSubCategory);
router.delete('/:id', subCategoryController.deleteSubCategory);

module.exports = router;