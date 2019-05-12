module.exports = {
  Query: {
    message: async (parent, { id }, { models }) => models.Message.findById(id),
    messages: async (parent, args, { models }) => models.Message.findAll(),
  },
  Mutation: {
    createMessage: async (parent, { text }, { models, me }) => {
      try {
        return await models.Message.create({
          text,
          userId: me.id,
        });
      } catch (e) {
        throw new Error(e);
      }
    },
    deleteMessage: async (parent, { id }, { models }) =>
      models.Message.destroy({ where: { id } }),
  },
  Message: {
    user: async (message, args, { models }) =>
      models.User.findById(message.userId),
  },
};
