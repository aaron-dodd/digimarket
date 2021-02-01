const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    wallet: {
        type: String
    }
});

UserSchema.pre(
    'save',
    async function (next) {
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash;

        this.wallet = this.username;

        next();
    }
);

UserSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;