const Product = require('../models/product-model');
const productService = require('../services/product-service');
const userPermissions = require('../permissions/product-permissions');


exports.getAll = async (req, res, next) => {
    productService.getAll()
        .then(products => res.send(products))
        .catch(next);
}

exports.getById = async (req, res, next) => {
    // if (!userPermissions.canViewProduct(req.user, req.product))
    //     return res.status(401).send({ message: 'Unauthorized' });

    productService.getById(req.product)
        .then(product => res.send(product))
        .catch(next);
}

exports.create = (req, res, next) => {
    productService.create(req.body, req.file)
        .then((product) => {
            res.status(200).send(product);
        })
        .catch(next);
}

exports.patch = async (req, res, next) => {    
    if (!userPermissions.canEditProduct(req.user, req.product))
        return res.status(401).send({ message: 'Unauthorized' });

    productService.patch(req.product, req.body)
        .then((response) => {
            res.status(202).send(response);
        })
        .catch(next)
}

exports.put = async (req, res, next) => {
    if (!userPermissions.canEditProduct(req.user, req.product))
        return res.status(401).send({ message: 'Unauthorized' });

    productService.put(req.product, req.body)
        .then((response) => {
            res.status(202).send(response);
        })
        .catch(next)
}

exports.delete = async (req, res, next) => {
    if (!userPermissions.canDeleteProduct(req.user, req.product))
        return res.status(401).send({ message: 'Unauthorized' });

    productService.delete(req.product)
        .then((response) => {
            res.status(201).send({ message: 'The product has been deleted' });
        })
        .catch(next)
}
