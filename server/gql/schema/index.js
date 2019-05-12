const { gql } = require('apollo-server-express');
const user = require('./user');
const message = require('./message');

const linkSchema = gql`
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
  type Subscription {
    _: Boolean
  }
`;

module.exports = [linkSchema, user, message];
