const router = require('express').Router();
const passport = require('passport');
const CrudService = require('../services/crud.service');
const validate = require('../middleware/validate-schema');
const messageValidator = require('../validators/message.validator');

/**
 * Method used to create a message.
 */
const sendMessage = async function (req, res) {
  req.body['sentBy'] = req.user.id;
  let [err, message] = await to(CrudService.addData('message', 'create', req.body));
  if (err) return ReE(res, err, 422);
  return ReS(
    res,
    {

      message
    },
    200
  );
}

/**
 * Method used to add like for a message.
 */
const likeMessage = async function (req, res) {
  req.body['likedBy'] = req.user.id;
  let [err, message] = await to(CrudService.addData('like', 'create', req.body));
  if (err) return ReE(res, err, 422);
  return ReS(
    res,
    {
      message
    },
    200
  );
}

/**
 * Method used to fetch list of message for a group chat.
 */
const getMessages = async function (req, res) {
  let [err, messages] = await to(CrudService.getData('message', 'findAll', {
    condition: {
      groupId: req.params.groupId,
      ...req.query.searText ? { content: { [Op.iLike]: '%' + req.query.searchText + '%' } } : {}
    },
    attributes: ['id', 'content', 'createdAt', 'sentBy'],
    include: [{
      tableName: 'like',
      attributes: ['id', 'likedBy'],
      required: false
    }]
  }, [{ instanceName: 'Like', tableName: 'like' }]));
  if (err) return ReE(res, err, 422);
  return ReS(
    res,
    {
      messages
    },
    200
  );
}
router.post('', passport.authenticate('jwt', { session: false }), messageValidator.sendMessage, validate.validate, sendMessage);
router.post('/like', passport.authenticate('jwt', { session: false }), messageValidator.likeMessage, validate.validate, likeMessage);
router.get('/:groupId', passport.authenticate('jwt', { session: false }), messageValidator.getMessages, validate.validate, getMessages);

module.exports = {
  router,
  sendMessage,
  likeMessage,
  getMessages
};