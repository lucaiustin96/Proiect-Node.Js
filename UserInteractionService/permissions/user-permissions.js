const Role = require('../_helpers/role');
const RefreshToken = require('../models/refresh-token-model');

exports.canRevokeToken = (user, token) => {
    return(
        user.role === Role.Admin ||
        ownsToken(user.id, token)
    );
}

async function ownsToken(userId, token) {
    const refreshTokens = await RefreshToken.find({ user: user.id });
    console.log(refreshTokens.find(x => x.token === token));
    return refreshTokens.find(x => x.token === token);
}