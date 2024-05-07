const { body } = require('express-validator');

module.exports = {
  createCustomer: [
    body('firstName').isString().withMessage('First Name must be string'),
    body('lastName').optional().isString().withMessage('Last Name must be string'),
    body('userName').isString().withMessage('User Name must be string'),
    body('password').isString().withMessage('Password must be string')
  ],
  editCustomer: [
    body('firstName').optional().isString().withMessage('First Name must be string'),
    body('lastName').optional().isString().withMessage('Last Name must be string'),
    body('userName').optional().isString().withMessage('User Name must be string'),
    body('password').optional().isString().withMessage('Password must be string')
  ],
  login: [
    body('userName').isString().withMessage('User Name must be string'),
    body('password').isString().withMessage('Password must be string')
  ]
}