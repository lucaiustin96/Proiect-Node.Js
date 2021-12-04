const Role = require('../_helpers/role');
const userService = require('../services/user-service');
const userPermissions = require('../permissions/user-permissions');

exports.create = (req, res, next) => {
    userService.create(req.body)
        .then((user) => {
            res.status(200).send(user);
        })
        .catch(next);
}

exports.getAll = (req, res, next) => {
    userService.getAll()
        .then(users => res.send(users))
        .catch(next);
}

exports.getById = (req, res, next) => {
    // regular users can get their own record and admins can get any record
    if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    userService.getById(req.params.id)
        .then(user => user ? res.send(user) : res.sendStatus(404))
        .catch(next);
}

exports.editUserDetails = (req, res, next) => {
    userService.editUserDetails(req.user, req.body)
        .then((userDetails) => {
            res.status(200).send(userDetails);
        })
        .catch(next);
}

exports.getUserDetails = (req, res, next) => {
    userService.getUserDetails(req.params.userId)
        .then(userDetails => userDetails ? res.send(userDetails) : res.sendStatus(404))
        .catch(next);    
}

exports.addPhoto = (req, res, next) => {
    userService.addPhoto(req.user, req.file)
        .then((response) => {
            res.status(200).send(response);
        })
        .catch(next);
}