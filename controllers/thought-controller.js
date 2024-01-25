const { User, Thought } = require('../models');

const thoughtController = {
    // Get all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
            .select('-__v')
            .sort({ createdAt: -1 })
            .then((dbThoughtData) => res.json(dbThoughtData))
            .catch((err) => {
                console.error(err);
                res.status(500).json(err);
            });
    },

    // Get a single thought by its _id
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.thoughtId })
            .select('-__v')
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                    return res.status(404).json({ message: 'No thought found with this id' });
                }
                res.json(dbThoughtData);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json(err);
            });
    },

    // Create a new thought
    createThought({ body }, res) {
        Thought.create(body)
            .then(({ _id }) => {
                // Push the created thought's _id to the associated user's thoughts array field
                return User.findOneAndUpdate(
                    { username: body.username },
                    { $push: { thoughts: _id } },
                    { new: true }
                );
            })
            .then((dbUserData) => {
                if (!dbUserData) {
                    return res.status(404).json({ message: 'No user found with this username' });
                }
                res.json({ message: 'Thought created successfully' });
            })
            .catch((err) => res.status(500).json(err));
    },

    // Update a thought by its _id
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.thoughtId }, body, { new: true, runValidators: true })
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                    return res.status(404).json({ message: 'No thought found with this id' });
                }
                res.json(dbThoughtData);
            })
            .catch((err) => res.status(500).json(err));
    },

    // Remove a thought by its _id
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.thoughtId })
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                    return res.status(404).json({ message: 'No thought found with this id' });
                }
                // Remove the thought's _id from the associated user's thoughts array field
                return User.findOneAndUpdate(
                    { username: dbThoughtData.username },
                    { $pull: { thoughts: params.thoughtId } },
                    { new: true }
                );
            })
            .then(() => res.json({ message: 'Thought deleted successfully' }))
            .catch((err) => res.status(500).json(err));
    },

    // Create a reaction stored in a single thought's reactions array field
    createReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true, runValidators: true }
        )
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                    return res.status(404).json({ message: 'No thought found with this id' });
                }
                res.json(dbThoughtData);
            })
            .catch((err) => res.status(500).json(err));
    }}
