import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        validate: (value) => {
            if (!validator.isEmail(value)) throw new Error('Invalid email address');
        }
    },
    password: {
        type: String,
        required: true,
        length: {min: 8, max: 32},
        validate: (value) => {
            if (!validator.isStrongPassword(value)) throw new Error('Invalid password');
        }
    },
    role: {
        type: String,
        enum: ['admin'],
        default: 'admin'
    },
    token: {
        type: [String],
    },
    refreshToken: {
        type: [String],
    }
}, {
    timestamps: true
})

const Admin = mongoose.model('Admin', AdminSchema);
