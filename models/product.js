const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        subCategory: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'SubCategory'
        },
        price: {
            type: Number,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        discount: {
            type: Number,
            required: true
        },
        trending: {
            type: Boolean,
            required: true
        },
        avatar: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('SubCategory', productSchema);