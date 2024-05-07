const router = require('express').Router();
const passport = require('passport');
const CrudService = require('../services/crud.service');
require('../global_functions');
const validate = require('../middleware/validate-schema');
const groupValidator = require('../validators/group.validator');

/**
 * Method used to create a new group along with group members.
 */
const createGroup = async function (req, res) {
  return models.sequelize.transaction({ autocomit: false }).then(async (transaction) => {
    try {
      req.body.groupData['createdBy'] = req.user.id;
      let [err, group] = await to(CrudService.addData('group', 'create', req.body.groupData, transaction));
      if (err) return TE(err.message);
      req.body.memberData.forEach(item => {
        item['groupId'] = group.dataValues.id;
        item['createdBy'] = req.user.id;
      });
      let [error, member] = await to(CrudService.addData('userGroupMapping', 'bulkCreate', req.body.memberData, transaction));
      if (error) return TE(error.message);
      else {
        transaction.commit();
        return ReS(
          res,
          {
            group,
            member
          },
          200
        );
      }
    } catch (error) {
      await transaction.rollback();
      return ReE(
        res,
        error,
        422
      );
    }
  });
}

/**
 * Method used to update group details.
 */
const editGroup = async function (req, res) {
  let [err, group] = await to(CrudService.editData('group', req.body, { id: req.params.id }));
  if (err) return ReE(res, err, 422);
  return ReS(
    res,
    {
      group
    },
    200
  );
}

/**
 * Method used to add member to a group.
 */
const addMemberToGroup = async function (req, res) {
  req.body['createdBy'] = req.user.id;
  let [err, group] = await to(CrudService.addData('userGroupMapping', 'create', req.body));
  if (err) return ReE(res, err, 422);
  return ReS(
    res,
    {
      group
    },
    200
  );
}

/**
 * Method used to remove member from a group.
 */
const removeMemberFromGroup = async function (req, res) {
  let [err, group] = await to(CrudService.removeData('userGroupMapping', { id: req.params.id }));
  if (err) return ReE(res, err, 422);
  return ReS(
    res,
    {
      group
    },
    200
  );
}

/**
 * Method used to remove member from a group.
 */
const deleteGroup = async function (req, res) {
  let [err, group] = await to(CrudService.removeData('group', { id: req.params.id }));
  if (err) return ReE(res, err, 422);
  return ReS(
    res,
    {
      group
    },
    200
  );
}


router.post('', passport.authenticate('jwt', { session: false }), groupValidator.createGroup, validate.validate, createGroup);
router.put('/:id', passport.authenticate('jwt', { session: false }), groupValidator.editGroup, validate.validate, editGroup);
router.post('/member', passport.authenticate('jwt', { session: false }), groupValidator.addMemberToGroup, validate.validate, addMemberToGroup);
router.delete('/:id', passport.authenticate('jwt', { session: false }), groupValidator.removeGroup, validate.validate, deleteGroup);
router.delete('/member/:id', passport.authenticate('jwt', { session: false }), groupValidator.removeGroup, validate.validate, removeMemberFromGroup);

module.exports = {
  router,
  createGroup,
  editGroup,
  removeMemberFromGroup,
  deleteGroup
};