const express = require('express');
const authController = require('../controllers/auth-controller');
const authMiddleware = require('../middlewares/auth-middleware');
const Role = require('../_helpers/role');
const authValidation = require('../validations/auth-validation');

const router = express.Router();

router.post('/authenticate', authValidation.authenticateSchema, authController.authenticate);
router.post('/refresh-token', authController.refreshToken);
router.post('/revoke-token', authMiddleware.authUser(), authValidation.revokeTokenSchema, authController.revokeToken);
router.get('/', authMiddleware.authUser(Role.Admin), authController.getAll);
router.get('/:id', authMiddleware.authUser(), authController.getById);

module.exports = router;