const Category = require('../models/category');
const asyncHandler = require('express-async-handler');

// @desc Get all categories
// @route GET /category
// @access Private
const getAllCategory = asyncHandler(async (req, res) => {
    const categories = await Category.find().select().lean();
    if (!categories?.length) {
        return res.status(400).json({ message: 'No category found' });
    }

    res.json(categories);
});

// @desc Get a category
// @route GET /category/:id
// @access Private
const getCategory = asyncHandler(async (req, res) => {
    const id = req?.params?.id;
    const category = await Category.findOne({ _id: id }).select().lean();
    if (!category) {
        return res.status(400).json({ message: 'No category found' });
    }

    res.json(category);
});

// @desc Create new category
// @route POST /category
// @access Private
const createNewCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const avatar = req.file?.path;

    // Confirm data
    if (!name || !avatar) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for duplicate
    const duplicate = await Category.findOne({ name }).lean().exec();

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate name' });
    }

    const categoryObject = {
        name,
        avatar
    };

    // Create and store new category
    const category = Category.create(categoryObject);

    if (category) {
        // created
        res.status(201).json({ message: `New category ${name} created` });
    } else {
        res.status(400).json({ message: 'Invalid category data received' });
    }
});

// @desc Update a category
// @route PATCH /category/:id
// @access Private
const updateCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const id = req?.params?.id;
    const avatar = req.file?.path;

    // Confirm data
    if (!id || !name || !avatar) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const category = await Category.findById(id).exec();

    if (!category) {
        return res.status(400).json({ message: 'Category not found' });
    }

    // Check for duplicate
    const duplicate = await Category.findOne({ name }).lean().exec();
    
    // Allow updates to the original category
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate name' });
    }

    duplicate.name = name;
    duplicate.avatar = avatar;

    const updatedCategory = await category.save();

    res.json({ message: `${updatedCategory.name} updated` });
});

// @desc Delete a category
// @route DELETE /category/:id
// @access Private
const deleteCategory = asyncHandler(async (req, res) => {
    const id = req?.params?.id;

    if (!id) {
        return res.status(400).json({ message: 'Category ID Required' });
    }

    const category = await Category.findById(id).exec();

    if (!category) {
        return res.status(400).json({ message: 'Category not found' });
    }

    const result = await category.deleteOne();

    const reply = `Category ${result.name} with ID ${result._id} deleted`;

    res.json(reply);
});

module.exports = {
    getAllCategory,
    getCategory,
    createNewCategory,
    updateCategory,
    deleteCategory
};