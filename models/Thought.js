const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const ReplySchema = new Schema(
    {
        replyId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        replyText: {
            type: String,
            required: "Please enter text for your reply",
            trim: true,
            validate: [({ length }) => length <= 280, 'Thought text does not comply to thought length rules.']
        },
        username: {
            type: String,
            required: "Please provide your username to create a reply.",
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        }
    },
    {
        toJson: {
            getters: true
        }
    }
);

const ThoughtSchema = new Schema({
    username: {
        type: String,
        required: "Please enter your username to create a thought.",
        trim: true
    },
    thoughtText: {
        type: String,
        required: "Please enter text for your thought to create a thought.",
        trim: true,
        validate: [({ length }) => length <= 280, 'Thought text does not comply to thought length rules.']
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
    },
    replies: [ReplySchema]
},
    {
        toJson: {
            virtuals: true,
            getters: true
        },
        id: false
    }
);

ThoughtSchema.virtual('reactionCount').get(function () {
    return this.replies.length;
});

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;