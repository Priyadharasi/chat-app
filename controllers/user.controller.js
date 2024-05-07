const router = require('express').Router();
const passport = require('passport');
const CrudService = require('../services/crud.service');
const CommonService = require('../services/common.service');
require('../global_functions');
const checkAdmin = require('../middleware/check-admin');
const validate = require('../middleware/validate-schema');
const userValidator = require('../validators/user.validator');


/**
 * Method used to create a new customer.
 */
const createCustomer = async function (req, res) {
  let [err, customer] = await to(CrudService.addData('user', 'create', req.body));
  if (err) return ReE(res, err, 422);
  return ReS(
    res,
    {
      customer
    },
    200
  );
}

/**
 * Method used to edit customer details.
 */
const editCustomer = async function (req, res) {
  let [err, customer] = await to(CrudService.editData('user', req.body, { id: req.params.id }));
  if (err) return ReE(res, err, 422);
  return ReS(
    res,
    {
      customer
    },
    200
  );
}

/**
 * Method used to login a customer.
 */
const login = async function (req, res) {
  let [err, customer] = await to(CrudService.getData('user', 'findOne', {
    condition: {
      userName: req.body.userName
    },
    attributes: { exclude: ['createdAt', 'modifiedAt'] }
  }));
  if (err) return ReE(res, err, 422);
  if (customer) {
    [err, customer] = await to(customer.comparePassword(req.body.password));
    if (err) return ReE(res, err, 422);
    if (customer) {
      const jwtPayload = {
        id: customer.dataValues.id,
        userName: customer.dataValues.userName,
        name: customer.firstName + (customer.lastName ? (' ' + customer.lastName) : ''),
        isAdmin: customer.dataValues.isAdmin
      };
      [err, token] = await to(CommonService.getJWT(CONFIG.jwt_encryption, jwtPayload));
      if (err) return ReE(res, err, 422);
      return ReS(
        res,
        {
          token
        },
        200
      );
    }
  }
}

router.post('', passport.authenticate('jwt', { session: false }), checkAdmin, userValidator.createCustomer, validate.validate, createCustomer);
router.put('/:id', passport.authenticate('jwt', { session: false }), checkAdmin, userValidator.editCustomer, validate.validate, editCustomer);
router.post('/login', userValidator.login, validate.validate, login);

module.exports = {
  router,
  createCustomer,
  editCustomer,
  login
};