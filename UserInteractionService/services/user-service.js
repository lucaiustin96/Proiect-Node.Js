const User = require('../models/user-model');
const RefreshToken = require('../models/refresh-token-model');
const Role = require('../_helpers/role');
const bcrypt = require('bcrypt');

exports.create = async (userDetails) => {
    const user = new User({
        firstName: userDetails.firstName, 
        lastName: userDetails.lastName,
        // username: userDetails.username,
        email: userDetails.email,
        passwordHash: await hashPassword(userDetails.password),
        role: Role.Admin
    });

    return await user.save();
}

exports.getAll = async () => {
    todos = [
        { id: 0, text: 'Learn React', completed: true },
        { id: 1, text: 'Learn Redux', completed: false, color: 'purple' },
        { id: 2, text: 'Build something fun!', completed: false, color: 'blue' }
      ];
    return todos;
    const users = await User.find();
    return users.map(x => basicDetails(x));
}

exports.getById = async (id) => {
    const user = await getUser(id);
    return basicDetails(user);
}

exports.getRefreshToken = async (token) => {
    const refreshToken = await RefreshToken.findOne({ token }).populate('user');
    if (!refreshToken || !refreshToken.isActive) throw 'Invalid token';
    return refreshToken;
}

// helper functions

async function getUser(id) {
    const user = await User.findById(id);
    if (!user) throw 'User not found';
    return user;
}

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

function basicDetails(user) {
    const { id, firstName, lastName, username, role } = user;
    return { id, firstName, lastName, username, role };
}