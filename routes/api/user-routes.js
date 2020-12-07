const router = require('express').Router();
const {
    getAllUsers,
    getUserById,
    createUser,
    deleteUser,
    updateUser,
    addFriend,
    removeFriend
} = require('../../controllers/user-controller');

router
    .route('/')
    .get(getAllUsers)
    .post(createUser);

router
    .route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

router
    .route('/:userId/friends')
    .post(addFriend);

router
    .route('/:userId/friends/:friendId')
    .delete(removeFriend);

module.exports = router;