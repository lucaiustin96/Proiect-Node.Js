const Joi = require('joi')
const validateRequest = require('../middlewares/validate-request-middleware');

exports.createProductSchema = async (req, res, next) => {
    console.log(req);
    const schema = Joi.object({
        name: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required()
            .messages({
                'string.base': `Name should be a type of 'text'`,
                'string.min': 'Name has to be least {#limit} characters.',
                'string.max': 'Name has to be max {#limit} characters.',
                'any.required': `Name is a required field`
            }), 
        description: Joi.string()
            .required(), 
        price: Joi.number()
            .required()
            .min(3)
            .max(30)
            .messages({
                'number.base': `Price should be a type of 'number'`,
                'number.min': 'Price has to be at least {#limit}',
                'number.max': 'Price has to be at most {#limit}',
                'any.required': `Price is a required field`
            }),
    });

    validateRequest(req, next, schema);
}