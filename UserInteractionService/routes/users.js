const express = require('express');
const userController = require('../controllers/user-controller');
const userMiddleware = require('../middlewares/user-middleware');
const Role = require('../_helpers/role');
const userValidation = require('../validations/user-validation');

const router = express.Router();

router.post('/create', userValidation.createUserSchema, userController.create);
router.get('/', userMiddleware.authUser(Role.Admin), userController.getAll);
router.get('/:id', userMiddleware.authUser(), userController.getById);

module.exports = router;