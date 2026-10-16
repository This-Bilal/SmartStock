
const mongoose = require ('mongoose')

const ownerSchema = new mongoose.Schema (
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                "Please provide a valid email address"
            ]
        },

        businessName: {
            type: String,
            required: true,
            trim: true,
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        isEmailVerified: {
            type: Boolean,
            default: true
        },

        emailVerificationTokenHash: {
            type: String,
            select: false
        },

        emailVerificationExpires: {
            type: Date,
            select: false
        },

        role: {
            type: String,
            enum: ['owner'],
            default: 'owner'
        },
    },
    {timestamps: true}
)

module.exports = mongoose.model("Owner", ownerSchema)