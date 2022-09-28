const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        // name: {
        //     type: String,
        //     required: true
        // },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        roles: [{
            type: String,
            default: "user"
        }],
        tel: {
            type: String
        },
        address: {
            type: String
        },
        verified: {
            type: Boolean,
            default: true
        },
        active: {
            type: Boolean,
            default: true
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('User', userSchema);