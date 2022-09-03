const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

// @desc Get all users
// @route GET /user
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean();
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' });
    }

    res.json(users);
});

// @desc Get a user
// @route GET /user/:id
// @access Private
const getUser = asyncHandler(async (req, res) => {
    const id = req?.params?.id;
    const user = await User.findOne({ _id: id }).select('-password').lean();
    if (!user) {
        return res.status(400).json({ message: 'No user found' });
    }

    res.json(user);
});

// @desc Create new user
// @route POST /user
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
    const { email, password, roles } = req.body;

    // Confirm data
    if (!email || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for duplicate
    const duplicate = await User.findOne({ email }).lean().exec();

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate email' });
    }

    // Hash password
    const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

    const userObject = {
        email,
        "password": hashedPwd,
        roles
    };

    // Create and store new user
    const user = User.create(userObject);

    if (user) {
        // created
        res.status(201).json({ message: `New user ${email} created` });
    } else {
        res.status(400).json({ message: 'Invalid user data received' });
    }
});

// @desc Update a user
// @route PATCH /user/:id
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const { tel, address, active } = req.body;
    const id = req?.params?.id;

    // Confirm data
    if (!id || !tel || !address || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findById(id).exec();

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    // Check for duplicate
    // const duplicate = await User.findOne({ username }).lean().exec();
    
    // Allow updates to the original user
    // if (duplicate && duplicate?._id.toString() !== id) {
    //     return res.status(409).json({ message: 'Duplicate username' });
    // }

    user.tel = tel;
    user.address = address;
    user.active = active;

    // if (password) {
    //     // Hash password
    //     user.password = await bcrypt.hash(password, 10); // salt rounds
    // }

    const updatedUser = await user.save();

    res.json({ message: `${updatedUser.email} updated` });
});

// @desc Delete a user
// @route DELETE /user/:id
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const id = req?.params?.id;

    if (!id) {
        return res.status(400).json({ message: 'User ID Required' });
    }

    const user = await User.findById(id).exec();

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    const result = await user.deleteOne();

    const reply = `Username ${result.email} with ID ${result._id} deleted`;

    res.json(reply);
});

module.exports = {
    getAllUsers,
    getUser,
    createNewUser,
    updateUser,
    deleteUser
};