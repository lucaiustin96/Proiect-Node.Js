const express = require('express');
const multer  = require('multer')
const productController = require('../controllers/product-controller');
const userMiddleware = require('../middlewares/user-middleware');
const productMiddleware = require('../middlewares/product-middleware');
const productsValidation = require('../validations/products-validation');
const path = require('path')

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
        if (file.mimetype == 'image/jpeg' && file.fieldname === 'image') {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Invalid upload: The file must be an image'));
        }
    }  
});

const router = express.Router();

router.get('/', productController.getAll);
router.get('/:id', productMiddleware.setProduct, productController.getById);
router.post('/create', upload.single('image'), productsValidation.createProductSchema, productController.create);
router.patch('/:id', productMiddleware.setProduct, userMiddleware.authUser(), productController.patch);
router.put('/:id', productMiddleware.setProduct, productController.put);
// router.put('/:id', productMiddleware.setProduct, userMiddleware.authUser(), productController.put);
router.delete('/:id', productMiddleware.setProduct, userMiddleware.authUser(), productController.delete);

module.exports = router;