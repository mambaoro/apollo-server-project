const jwt = require('jsonwebtoken');
const createToken = async user => {
  const { id, email, username } = user;
  return jwt.sign({ id, email, username });
};

module.exports = {
  Query: {
    user: async (parent, { id }, { models }) => models.User.findById(id),
    users: async (parent, args, { models }) => models.User.findAll(),
    me: async (parent, args, { models, me }) => {
      if (!me) {
        return null;
      }
      return models.User.findById(me.id);
    },
  },
  Mutation: {
    signUp: async (parent, { username, email, password }, { models }) => {
      const user = await models.User.create({
        username,
        email,
        password,
      });
      return { token: createToken(user) };
    },
  },
  User: {
    messages: async (user, args, { models }) =>
      models.Message.findAll({
        where: {
          userId: user.id,
        },
      }),
  },
};
