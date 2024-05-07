const { body, param } = require('express-validator');

module.exports = {
  createGroup: [
    body('name').isString().withMessage('Name must be string'),
    body('description').optional().isString().withMessage('Description must be string')
  ],
  editGroup: [
    body('name').optional().isString().withMessage('Name must be string'),
    body('description').optional().isString().withMessage('Description must be string')
  ],
  addMemberToGroup: [
    body('groupId').isNumeric().withMessage('Group Id must be number'),
    body('memberId').isNumeric().withMessage('Member Id must be number')
  ],
  removeGroup: [
    param('id').isNumeric().withMessage('Id must be number')
  ]
};