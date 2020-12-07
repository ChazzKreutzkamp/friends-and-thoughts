const { Thought, User } = require('../models');

const thoughtController = {

    getAllThoughts(req, res) {
        Thought.find({})
            .populate({
                path: 'replies',
                select: '-__v'
            })
            .select('-__v')
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    getThoughtById({ params }, res) {
        User.findOne({ _id: params.id })
            .populate({
                path: 'replies',
                select: '-__v'
            })
            .select('-__v')
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    addThought({ params, body }, res) {
        console.log(body);
        Thought.create(body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { _id: params.userId },
                    { $push: { comments: _id } },
                    { new: true }
                );
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No User found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },

    removeThought({ params, body }, res) {
        Thought.findOneAndDelete({ _id: params.thoughtId })
            .then(deletedThought => {
                if (!deletedThought) {
                    return res.status(404).json({ message: 'No thought with this id!' })
                }
                return User.findOneAndUpdate(
                    { _id: params.userId },
                    { $pull: { comments: params.commentId } },
                    { new: true }
                );
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No User found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },

    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.thoughtId })
            .then(updatedThought => {
                if (!updatedThought) {
                    return res.status(404).json({ message: 'No Thought with this id! ' })
                }
                return User.findOneAndUpdate(
                    { _id: params.userId },
                    { $set: { comments: params.commentId } },
                    { runValidators: true, new: true }
                )
            })
    },
    // reply
    addReply({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { replies: body } },
            { new: true, runValidators: true }
        )
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id!' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    },

    // remove reply
    removeReply({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { replies: { replyId: params.replyId } } },
            { new: true }
        )
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => res.json(err));
    }
}

module.exports = thoughtController;