const Joi = require('joi');
const validateRequest = require('../middlewares/validate-request-middleware');

exports.authenticateSchema = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    });

    validateRequest(req, next, schema);
}

exports.revokeTokenSchema = (req, res, next) => {
    const schema = Joi.object({
        token: Joi.string().empty('')
    });
    
    validateRequest(req, next, schema);
}