const Joi = require('joi');
const validateRequest = require('../middlewares/validate-request-middleware');

exports.editUserDetails = async (req, res, next) => {
    const schema = Joi.object({
        description: Joi.string()
            .alphanum()
            .min(3)
    });

    validateRequest(req, next, schema);
}