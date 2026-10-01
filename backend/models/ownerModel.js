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
            lowercase: true
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

module.exports = mongoose.model("Owner", ownerSchema)