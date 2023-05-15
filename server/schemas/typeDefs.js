const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID!
        username: String
        email: String
        matchHistory: [Match]
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
        addProfile(name: String!, email: String!, password: String!): Auth
        login(email: String!, password: String!): Auth

    }

`;

module.exports = typeDefs;

// fill in Type Query & Type Mutation