const { AuthenticationError } = require('apollo-server-express');

const { User, Match } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        users: async () => {
            return User.find().populate("matches");
        }
    },

    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);

            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('No profile with this email found!');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect password!');
            }

            const token = signToken(user);
            return { token, user };
        },
        addMatch: async (parent, { result }, context) => {
            const match = await Match.create({ result, userId: context.user._id });

            const user = await User.findOneAndUpdate({ _id: context.user._id }, {
                $addToSet: {
                    matches: match._id,
                }
            }).populate("matches");
            return user;
        }

    },
};

module.exports = resolvers;