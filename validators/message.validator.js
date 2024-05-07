const { body, param } = require('express-validator');

module.exports = {
  sendMessage: [
    body('content').isString().withMessage('Content must be string'),
    body('groupId').isNumeric().withMessage('Group Id must be number')
  ],
  likeMessage: [
    body('messageId').isString().withMessage('Message Id must be number'),
    body('groupId').isNumeric().withMessage('Group Id must be number')
  ],
  getMessages: [
    param('groupId').isNumeric().withMessage('Group Id must be number')
  ]
};