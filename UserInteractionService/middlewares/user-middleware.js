//https://jasonwatmore.com/post/2018/11/28/nodejs-role-based-authorization-tutorial-with-example-api

const jwt = require('express-jwt');
const User = require('../models/user-model');

exports.authUser = (roles = []) => {
    // roles param can be a single role string (e.g. Role.User or 'User') 
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        // authenticate JWT token and attach user to request object (req.user)
        jwt({ secret: 'ana are mere', algorithms: ['HS256'] }),

        // authorize based on user role
        async (req, res, next) => {
            const user = await User.findById(req.user.id);

            if (!user || (roles.length && !roles.includes(user.role))) {
                // user no longer exists or role not authorized
                return res.status(401).send({ message: 'Unauthorized' });
            }

            // authentication and authorization successful
            req.user.role = user.role;

            next();
        }
    ];
}

