const Product = require('../models/product-model');

exports.setProduct = async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) throw 'Product not found';
    
    req.product = product
    next();
}