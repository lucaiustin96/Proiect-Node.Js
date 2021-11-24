const Role = require('../_helpers/role');
const userService = require('../services/user-service');
const userPermissions = require('../permissions/user-permissions');

exports.create = (req, res, next) => {
    console.log(req.body);
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