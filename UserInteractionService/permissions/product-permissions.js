const Role = require('../_helpers/role');

exports.canViewProduct = (user, product) => {
    return(
        user.role === Role.Admin ||
        product.userId === user.id
    );
}

exports.canEditProduct = (user, product) => {
    return(
        user.role === Role.Admin ||
        product.userId === user.id
    );
}

exports.canDeleteProduct = (user, product) => {
    return(
        user.role === Role.Admin ||
        product.userId === user.id
    );
}