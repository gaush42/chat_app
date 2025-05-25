const express = require('express');
const router = express.Router();
const groupController = require('../controller/group_conroller');
const auth = require('../middleware/authJWT');

router.post('/create', auth.authenticate, groupController.createGroup);
router.post('/add-member', auth.authenticate, groupController.addMember);
router.post('/remove-member', auth.authenticate, groupController.removeMember);
router.post('/make-admin', auth.authenticate, groupController.makeAdmin);
router.post('/join', auth.authenticate, groupController.joinGroup);
router.get('/:groupId/info', auth.authenticate, groupController.getGroupInfo);
router.get('/my-groups', auth.authenticate, groupController.getUserGroups);
router.get('/:groupId/messages', auth.authenticate, groupController.getGroupMessages);
router.post('/:groupId/send', auth.authenticate, groupController.sendMessage);
router.post('/leave-group', auth.authenticate, groupController.leaveGroup);

module.exports = router;
