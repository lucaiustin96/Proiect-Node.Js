    const Product = require('../models/product-model');
var path = require('path')

exports.getAll = async () => {
    const products = await Product.find();
    return products.map(x => basicDetails(x));
}

exports.getById = async (product) => {
    return basicDetails(product);
}

exports.create = async (productInfo, productImage) => {
    const product = new Product({
        name: productInfo.name,
        description: productInfo.description,
        price: productInfo.price,
        imageName: productImage.filename
    });

    const savedProduct = await product.save()
    return basicDetails(savedProduct);
}

exports.patch = async (product, productDetails) => {
    if (productDetails.name != null) {
        product.name = productDetails.name;
    }

    if (productDetails.name != null) {
        product.name = productDetails.name;
    }

    if (productDetails.name != null) {
        product.name = productDetails.name;
    }

    const updatedProduct = await product.save();
    return basicDetails(updatedProduct);
}

exports.put = async (product, productDetails) => {
    const updatedProduct = await product.set(productDetails)
    return basicDetails(updatedProduct);
}

exports.delete = async (product) => {
    return await product.delete();
}

function basicDetails(product) {
    const { id, name, description, price, imageName } = product;
    return { id, name, description, price, imageName };
}
