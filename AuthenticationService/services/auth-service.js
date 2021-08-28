const User = require('../models/user-model');
const RefreshToken = require('../models/refresh-token-model');
const Role = require('../_helpers/role');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

exports.authenticate = async (username, password, ipAddress) => {
    const user = await User.findOne({ username: username});
    
    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
        throw 'Username or password is incorrect';
    }
    // authentication successful so generate jwt and refresh tokens
    const jwtToken = generateJwtToken(user);
    const refreshToken = generateRefreshToken(user, ipAddress);

    // save refresh token
    await refreshToken.save();

    // return basic details and tokens
    return { 
        ...basicDetails(user),
        jwtToken,
        refreshToken: refreshToken.token
    };
}

exports.refreshToken = async (token, ipAddress) => {
    const refreshToken = await getRefreshToken(token);
    const { user } = refreshToken;
    
    // replace old refresh token with a new one and save
    const newRefreshToken = generateRefreshToken(user, ipAddress);
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    refreshToken.replacedByToken = newRefreshToken.token;
    await refreshToken.save();
    await newRefreshToken.save();
    
    // generate new jwt
    const jwtToken = generateJwtToken(user);

    return { 
        ...basicDetails(user),
        jwtToken,
        refreshToken: newRefreshToken.token
    };
}

exports.revokeToken = async (token, ipAddress) => {
    const refreshToken = await getRefreshToken(token);
    
    // revoke token and save
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    await refreshToken.save();
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

// helper functions

async function getUser(id) {
    const user = await User.findById(id);
    if (!user) throw 'User not found';
    return user;
}

function generateJwtToken(user) {
    // create a jwt token containing the user id that expires in 15 minutes
    return jwt.sign({ sub: user.id, id: user.id }, 'ana are mere', { expiresIn: '15m' });
}

function generateRefreshToken(user, ipAddress) {
    // create a refresh token that expires in 7 days
    const refreshToken =  new RefreshToken({
        user: user.id,
        token: randomTokenString(),
        expires: new Date(Date.now() + 7*24*60*60*1000),
        createdByIp: ipAddress
    });

    return refreshToken;
}

function randomTokenString() {
    return crypto.randomBytes(40).toString('hex');
}

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

function basicDetails(user) {
    const { id, firstName, lastName, username, role } = user;
    return { id, firstName, lastName, username, role };
}

async function getRefreshToken(token) {
    const refreshToken = await RefreshToken.findOne({ token: token}).populate('user');
    if (!refreshToken || !refreshToken.isActive) throw 'Invalid token';
    
    return refreshToken;
}