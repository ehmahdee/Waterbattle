const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID!
        username: String
        email: String
        matches: [Match]!
        winCount: Int
    }
    type Match {
        _id: ID!
        userId: String!
        result: String!
        createdAt: String
    }
    type Auth {
        token: ID!
        user: User
    }
    type Query {
        users: [User]!
    }
    type Mutation {
        addUser(username: String!, email: String!, password: String!): Auth
        login(email: String!, password: String!): Auth
        addMatch(result: String!): User
    }

`;

module.exports = typeDefs;

// fill in Type Query & Type Mutation