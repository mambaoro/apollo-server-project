/* eslint consistent-return:0 import/order:0 */

const express = require('express');
const logger = require('./logger');

const argv = require('./argv');
const port = require('./port');
const setup = require('./middlewares/frontendMiddleware');
const isDev = process.env.NODE_ENV !== 'production';
const ngrok =
  (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel
    ? require('ngrok')
    : false;
const { resolve } = require('path');
const app = express();

const { ApolloServer } = require('apollo-server-express');

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
const schema = require('./gql/schema');
const resolvers = require('./gql/resolvers');
const models = require('./gql/models/');
const sequelize = require('./gql/models/');

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: async () => ({ models, me: models.User.findByLogin('mbaoro') }),
});

server.applyMiddleware({ app, path: '/graphql' });

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';

// use the gzipped bundle
app.get('*.js', (req, res, next) => {
  req.url = req.url + '.gz'; // eslint-disable-line
  res.set('Content-Encoding', 'gzip');
  next();
});

const eraseDatabaseOnSync = true;

// Start your app.
sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    createUserWithMessages();
  }
  app.listen(port, host, async err => {
    if (err) {
      return logger.error(err.message);
    }

    // Connect to ngrok in dev mode
    if (ngrok) {
      let url;
      try {
        url = await ngrok.connect(port);
      } catch (e) {
        return logger.error(e);
      }
      logger.appStarted(port, prettyHost, url);
    } else {
      logger.appStarted(port, prettyHost);
    }
  });
});

const createUserWithMessages = async () => {
  await models.User.create(
    {
      username: 'mbaoro',
      email: 'mam.baoro@outlook.fr',
      password: '4589rf4',
      messages: [
        {
          text: 'Published the Road to learn React',
        },
      ],
    },
    { include: [models.Message] },
  );
  await models.User.create(
    {
      username: 'rwieruch',
      email: 'hello@robin.com',
      password: '89dd533',
      messages: [
        {
          text: 'Happy to release...',
        },
        {
          text: 'Published a complete...',
        },
      ],
    },
    {
      include: [models.Message],
    },
  );
};
