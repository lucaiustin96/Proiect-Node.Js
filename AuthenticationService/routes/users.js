const express = require('express');
const userController = require('../controllers/user-controller');
const userMiddleware = require('../middlewares/user-middleware');
const Role = require('../_helpers/role');
const userValidation = require('../validations/user-validation');

const router = express.Router();

router.post('/create', userValidation.createUserSchema, userController.create);
router.post('/authenticate', userValidation.authenticateSchema, userController.authenticate);
router.post('/refresh-token', userController.refreshToken);
router.post('/revoke-token', userMiddleware.authUser(), userValidation.revokeTokenSchema, userController.revokeToken);
router.get('/', userMiddleware.authUser(Role.Admin), userController.getAll);
router.get('/:id', userMiddleware.authUser(), userController.getById);

module.exports = router;