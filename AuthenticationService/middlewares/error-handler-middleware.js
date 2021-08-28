// module.exports = errorHandler;

exports.errorHandler = (err, req, res, next) => {
    console.log(err);
    switch (true) {
        case typeof err === 'string':
            // custom application error
            const is404 = err.toLowerCase().endsWith('not found');
            const statusCode = is404 ? 404 : 400;
            return res.status(statusCode).send({ message: err });
        case err.name === 'ValidationError':
            // mongoose validation error
            return res.status(400).send({ message: err.message });
        case err.name === 'UnauthorizedError':
            // jwt authentication error
            return res.status(401).send({ message: 'Unauthorized' });
        default:
            return res.status(500).send({ message: err.message });
    }
}