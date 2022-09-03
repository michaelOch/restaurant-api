const SubCategory = require('../models/subCategory');
const asyncHandler = require('express-async-handler');

// @desc Get all sub categories
// @route GET /subcategory
// @access Private
const getAllSubCategory = asyncHandler(async (req, res) => {
    const subCategories = await SubCategory.find().select().lean();
    if (!subCategories?.length) {
        return res.status(400).json({ message: 'No subcategory found' });
    }

    res.json(subCategories);
});

// @desc Get a subcategory
// @route GET /subcategory/:id
// @access Private
const getSubCategory = asyncHandler(async (req, res) => {
    const id = req?.params?.id;
    const subCategory = await SubCategory.findOne({ _id: id }).select().lean();
    if (!subCategory) {
        return res.status(400).json({ message: 'No subcategory found' });
    }

    res.json(subCategory);
});

// @desc Create new subcategory
// @route POST /subcategory
// @access Private
const createNewSubCategory = asyncHandler(async (req, res) => {
    const { name, category } = req.body;
    const avatar = req.file?.path;

    // Confirm data
    if (!name || !category || !avatar) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for duplicate
    const duplicate = await SubCategory.findOne({ name }).lean().exec();

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate name' });
    }

    const subCategoryObject = {
        name,
        category,
        avatar
    };

    // Create and store new subcatgeory
    const subCategory = SubCategory.create(subCategoryObject);

    if (subCategory) {
        // created
        res.status(201).json({ message: `New subcategory ${name} created` });
    } else {
        res.status(400).json({ message: 'Invalid subcategory data received' });
    }
});

// @desc Update a subcategory
// @route PATCH /subcategory/:id
// @access Private
const updateSubCategory = asyncHandler(async (req, res) => {
    const { name, category } = req.body;
    const id = req?.params?.id;
    const avatar = req.file?.path;

    // Confirm data
    if (!id || !name || !category || !avatar) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const subCategory = await SubCategory.findById(id).exec();

    if (!subCategory) {
        return res.status(400).json({ message: 'Subcategory not found' });
    }

    // Check for duplicate
    const duplicate = await SubCategory.findOne({ name }).lean().exec();
    
    // Allow updates to the original subcategory
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate name' });
    }

    duplicate.name = name;
    duplicate.category = category;
    duplicate.avatar = avatar;

    const updatedSubCategory = await subCategory.save();

    res.json({ message: `${updatedSubCategory.name} updated` });
});

// @desc Delete a subcategory
// @route DELETE /subcategory/:id
// @access Private
const deleteSubCategory = asyncHandler(async (req, res) => {
    const id = req?.params?.id;

    if (!id) {
        return res.status(400).json({ message: 'Subcategory ID Required' });
    }

    const subCategory = await SubCategory.findById(id).exec();

    if (!subCategory) {
        return res.status(400).json({ message: 'Subcategory not found' });
    }

    const result = await subCategory.deleteOne();

    const reply = `Subcategory ${result.name} with ID ${result._id} deleted`;

    res.json(reply);
});

module.exports = {
    getAllSubCategory,
    getSubCategory,
    createNewSubCategory,
    updateSubCategory,
    deleteSubCategory
};