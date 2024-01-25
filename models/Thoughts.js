const mongoose = require('mongoose');
const Reaction = require('../Reaction');

const thoughtSchema = new mongoose.Schema({
    thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAt) => new Date(createdAt).toISOString(),
    },
    username: {
        type: String,
        required: true,
    },
    reactions: [Reaction.schema],
});

// Virtual for reactionCount
thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});

const Thought = mongoose.model('Thought', thoughtSchema);

module.exports = Thought;
