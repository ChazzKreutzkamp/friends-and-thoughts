const router = require('express').Router();
const {
    getAllThoughts,
    getThoughtById,
    addThought,
    removeThought,
    updateThought,
    addReply,
    removeReply
} = require('../../controllers/thought-controller');

router
    .route('/')
    .get(getAllThoughts);

router
    .route('/:id')
    .get(getThoughtById);

router
    .route('/:userId')
    .post(addThought);

router
    .route('/:userId/:thoughtId')
    .delete(removeThought)
    .put(updateThought);

router
    .route('/reply/:thoughtId')
    .post(addReply);

router
    .route('/reply/:thoughtId/:replyId')
    .delete(removeReply);

module.exports = router;