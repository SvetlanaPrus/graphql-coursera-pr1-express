const express = require('express');
const cors = require('cors');

const { response } = require('express');

const { graphqlHTTP } = require('express-graphql');
const gql = require('graphql-tag');
const { buildASTSchema } = require('graphql');
const dbJson = require('./items-db.json');

const app = express();

// allow cross origin access
app.use(cors({ origin: '*', credentials: true }));

// serve static file
app.use('/images', express.static('public'));

// schema
const schema = buildASTSchema(gql(`
  type Query {
      hello: String!
      merchandises: [ Merchandise ]
  }

  type Merchandise {
      id: ID
      name: String
      description: String
      lastBid: Float
      lastBidUser: String
      imageUrl: String
  }
`));

// resolver
const rootValue = {
  hello: () => 'Hello World!',
  merchandises: () => dbJson,
};

app.use('/', graphqlHTTP({ schema, rootValue }));

app.listen(
  3000,
  () => {
    console.log('Server started and listening on port 3000...');
  },
);
