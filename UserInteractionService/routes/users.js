const express = require('express');
const userController = require('../controllers/user-controller');
const userMiddleware = require('../middlewares/user-middleware');
const path = require('path');
const Role = require('../_helpers/role');
const userValidation = require('../validations/user-validation');
const userDetailsValidation = require('../validations/user-details-validation');
const multer  = require('multer');
// const storage = multer.memoryStorage();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() +  path.extname(file.originalname))
    }
})

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == 'image/jpeg' && file.fieldname === 'photo') {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Invalid upload: The file must be an image'));
        }
    }  
});

const router = express.Router();

router.post('/create', userValidation.createUserSchema, userController.create);
router.get('/', userMiddleware.authUser(Role.Admin), userController.getAll);
router.get('/:id', userMiddleware.authUser(), userController.getById);

router.patch('/edit-details', userMiddleware.authUser(), userDetailsValidation.editUserDetails, userController.editUserDetails);
router.get('/get-details/:userId', userMiddleware.authUser(), userController.getUserDetails);
router.patch('/add-photo', userMiddleware.authUser(), upload.single('photo'), userController.addPhoto);

module.exports = router;