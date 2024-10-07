const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    department: { type: String },
    role: { type: String, default: 'user' },
    status: { type: String, default: 'active' },
    profilePicture: { type: String },
    phone: { type: String },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        zipCode: { type: String },
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    lastLogin: { type: Date },
    passwordResetToken: { type: String },
    passwordResetExpiry: { type: Date },
    securityQuestions: [
        {
            question: { type: String },
            answer: { type: String },
        },
    ],
    preferences: { type: Object },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    lastIpAddress: { type: String },
});

userSchema.methods.isPasswordValid = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10); // Hashing the password
    }
    this.updatedAt = Date.now(); // Update the timestamp
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
