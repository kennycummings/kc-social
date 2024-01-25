const { User, Thought } = require('../models');

const userController = {
    // Get all users
    getAllUsers(req, res) {
        User.find({})
            .populate({
                path: 'thoughts',
                select: '-__v',
            })
            .populate({
                path: 'friends',
                select: '-__v',
            })
            .select('-__v')
            .then((dbUserData) => res.json(dbUserData))
            .catch((err) => {
                console.error(err);
                res.status(500).json(err);
            });
    },

    // Get a single user by its _id and populated thought and friend data
    getUserById({ params }, res) {
        User.findOne({ _id: params.userId })
            .populate({
                path: 'thoughts',
                select: '-__v',
            })
            .populate({
                path: 'friends',
                select: '-__v',
            })
            .select('-__v')
            .then((dbUserData) => {
                if (!dbUserData) {
                    return res.status(404).json({ message: 'No user found with this id' });
                }
                res.json(dbUserData);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json(err);
            });
    },

    // Create a new user
    createUser({ body }, res) {
        User.create(body)
            .then((dbUserData) => res.json(dbUserData))
            .catch((err) => res.status(500).json(err));
    },

    // Update a user by its _id
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.userId }, body, { new: true, runValidators: true })
            .then((dbUserData) => {
                if (!dbUserData) {
                    return res.status(404).json({ message: 'No user found with this id' });
                }
                res.json(dbUserData);
            })
            .catch((err) => res.status(500).json(err));
    },

    // Remove user by its _id
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.userId })
            .then((dbUserData) => {
                if (!dbUserData) {
                    return res.status(404).json({ message: 'No user found with this id' });
                }
                // BONUS: Remove user's associated thoughts
                return Thought.deleteMany({ username: dbUserData.username });
            })
            .then(() => res.json({ message: 'User and associated thoughts deleted successfully' }))
            .catch((err) => res.status(500).json(err));
    },

    // Add a new friend to a user's friend list
    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $addToSet: { friends: params.friendId } },
            { new: true }
        )
            .then((dbUserData) => {
                if (!dbUserData) {
                    return res.status(404).json({ message: 'No user found with this id' });
                }
                res.json(dbUserData);
            })
            .catch((err) => res.status(500).json(err));
    },

    // Remove a friend from a user's friend list
    removeFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId } },
            { new: true }
        )
            .then((dbUserData) => {
                if (!dbUserData) {
                    return res.status(404).json({ message: 'No user found with this id' });
                }
                res.json(dbUserData);
            })
            .catch((err) => res.status(500).json(err));
    },
};

module.exports = userController;
