const Joi = require('joi');
const validateRequest = require('../middlewares/validate-request-middleware');

exports.createUserSchema = async (req, res, next) => {
    const schema = Joi.object({
        firstName: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),

        lastName: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),

        username: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),    
            
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),

        birth_year: Joi.number()
            .integer()
            .min(1900)
            .max(2013),
                
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        
        repeat_password: Joi.ref('password'),
    });

    validateRequest(req, next, schema);
}

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