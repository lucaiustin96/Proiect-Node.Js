/*https://jasonwatmore.com/post/2020/06/17/nodejs-mongodb-api-jwt-authentication-with-refresh-tokens#user-model-js*/
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const users = require('./routes/users');
const products = require('./routes/products');
// const errorHandler = require('./middlewares/error-handler-middleware');
const cors = require('cors')


const app = express();

const mongoDB = 'mongodb://127.0.0.1/e_commerce_platform';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(cors())
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
 
app.use('/api/v1/users', users);
app.use('/api/v1/products', products);

app.use(express.static('public'))

// app.use(function(err, req, res, next) {
//     switch (true) {
//         case typeof err === 'string':
//             // custom application error
//             const is404 = err.toLowerCase().endsWith('not found');
//             const statusCode = is404 ? 404 : 400;
//             return res.status(statusCode).json({ message: err });
//         case err.name === 'ValidationError':
//             // mongoose validation error
//             return res.status(422).json({ errors: err.details });
//         case err.name === 'UnauthorizedError':
//             // jwt authentication error
//             return res.status(401).json({ message: 'Unauthorized' });
//         default:
//             return res.status(500).json({ message: err.message });
//     }
// })
app.listen(3000, () => {
    console.log('Example app listening at http://localhost:3000')
})
// module.exports = app;
