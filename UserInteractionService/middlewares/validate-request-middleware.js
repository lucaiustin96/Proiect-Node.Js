module.exports = validateRequest;

function validateRequest(req, next, schema) {
    const options = {
        abortEarly: false, // include all errors
    };
    const { error, value } = schema.validate(req.body, options);
    if (error) {
        errorArray = error.details.map(err => {
            let obj = {};
            obj[err.path[0]] = err.message

            return obj
        })

        error.details = errorArray
        
        next(error)
    } else {
        req.body = value;
        next();
    }
}