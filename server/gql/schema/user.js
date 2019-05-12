const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Query {
    user(id: ID!): User
    users: [User!]
    me: User
  }

  extend type Mutation {
    signUp(username: String!, email: String!, password: String!): Token!
  }

  type Token {
    token: String!
  }
  type User {
    id: ID!
    username: String!
    email: String!
    messages: [Message!]
  }
`;
