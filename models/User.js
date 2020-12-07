const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const FriendSchema = new Schema(
    {
        friendId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        username: {
            type: String,
            required: true,
            trim: true
        },
        friendedAt: {
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

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: "Please enter a Username",
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: "Please enter an email address",
        match: [/.+@.+\..+/, 'Please enter a valid email address']
    },
    thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Thought'
        }
    ],
    friends: [FriendSchema]
},
    {
        toJSON: {
            virtuals: true
        },
        id: false
    }
);

UserSchema.virtual('friendCount').get(function () {
    return this.friends.length;
})

const User = model('User', UserSchema);

module.exports = User;