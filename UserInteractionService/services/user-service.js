const User = require('../models/user-model');
const UserDetails = require('../models/user-details-model');
const RefreshToken = require('../models/refresh-token-model');
const Role = require('../_helpers/role');
const bcrypt = require('bcrypt');

exports.create = async (userDetails) => {
    const user = new User({
        firstName: userDetails.firstName, 
        lastName: userDetails.lastName,
        // username: userDetails.username,
        email: userDetails.email,
        birthDay: userDetails.birthDay,
        birthMonth: userDetails.birthMonth,
        birthYear: userDetails.birthYear,
        passwordHash: await hashPassword(userDetails.password),
        role: Role.Admin
    });

    return await user.save();
}

exports.getAll = async () => {
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

exports.editUserDetails = async (user, userDetails) => {
    return await UserDetails.findOneAndUpdate(
        { userId: user.id },
        userDetails,
        { 
            new: true,
            upsert: true,
            useFindAndModify: false
        }
    );
}

exports.getUserDetails = async (userId) => {
    return await UserDetails.findOne({ userId: userId }).select({
        description: 1,
        photos: 1,
        userId: 1,
    });
}

exports.addPhoto = async (user, photo) => {
    return await UserDetails.findOneAndUpdate(
        { userId: user.id },
        { $push: { photos: photo.path } },
        { 
            new: true,
            upsert: true,
            useFindAndModify: false
        }
    );
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