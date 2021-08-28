const Role = require('../_helpers/role');
const userService = require('../services/user-service');
const userPermissions = require('../permissions/user-permissions');

exports.create = (req, res, next) => {
    userService.create(req.body)
        .then((user) => {
            res.status(200).send(user);
        })
        .catch(next);
}

exports.authenticate = (req, res, next) => {
    userService.authenticate(
        req.body.username, 
        req.body.password, 
        req.body.ipAddress
    )
        .then(({ refreshToken, ...user }) => {
            setTokenCookie(res, refreshToken);
            res.send(user);
        })
        .catch(next);
}

exports.refreshToken = (req, res, next) => {
    const token = req.cookies.refreshToken;
    console.log(`token: ${token}`)
    const ipAddress = req.ip;
    
    userService.refreshToken(token, ipAddress)
        .then(({ refreshToken, ...user }) => {
            setTokenCookie(res, refreshToken);
            res.send(user);
        })
        .catch(next);
}

exports.revokeToken = (req, res, next) => {
    // accept token from request body or cookie
    const token = req.body.token || req.cookies.refreshToken;
    const ipAddress = req.ip;

    if (!token) return res.status(400).send({ message: 'Token is required' });

    // users can revoke their own tokens and admins can revoke any tokens
    if (!userPermissions.canRevokeToken(req.user, token)) {
        return res.status(401).status({ message: 'Unauthorized' });
    }

    userService.revokeToken(token, ipAddress)
        .then(() => res.send({ message: 'Token revoked' }))
        .catch(next);
}

exports.getAll = (req, res, next) => {
    userService.getAll()
        .then(users => res.send(users))
        .catch(next);
}

exports.getById = (req, res, next) => {
    // regular users can get their own record and admins can get any record
    if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    userService.getById(req.params.id)
        .then(user => user ? res.send(user) : res.sendStatus(404))
        .catch(next);
}

// helper functions
function setTokenCookie(res, token)
{
    // create http only cookie with refresh token that expires in 7 days
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 7*24*60*60*1000)
    };
    res.cookie('refreshToken', token, cookieOptions);
}
