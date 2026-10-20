
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

        isEmailVerified: {
            type: Boolean,
            default: true
        },

        emailVerificationToken: {
            type: String,
            select: false
        },

        emailVerificationExpiresAt: {
            type: Date,
            select: false
        },

        passwordResetToken: {
            type: String,
            select: false
        },

        passwordResetExpiresAt: {
            type: Date,
            select: false
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

        role: {
            type: String,
            enum: ['owner'],
            default: 'owner'
        },
    },
    {timestamps: true}
)

ownerSchema.index({ passwordResetToken: 1 }, { sparse: true });

module.exports = mongoose.model("Owner", ownerSchema)