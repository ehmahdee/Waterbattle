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

    }
    type Mutation {

    }

`;

module.exports = typeDefs;

// fill in Type Query & Type Mutation