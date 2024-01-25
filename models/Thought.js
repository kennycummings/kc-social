const { Schema, model } = require('mongoose');
const Reaction = require('./Reaction'); // Adjust the path based on your structure

const thoughtSchema = new Schema({
    thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAt) => dateFormat(createdAt),
    },
    username: {
        type: String,
        required: true,
    },
    reactions: [Reaction.schema],
});

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;
