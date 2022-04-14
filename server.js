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
      merchandise(id: ID): Merchandise
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
  merchandise: ({ id }) => dbJson.find((item) => item.id === id),
};

app.use('/', graphqlHTTP({ schema, rootValue }));

// virtual bidder

function virtualBid() {
  const virtualBidders = ['mystic-fox', 'magical-lion', 'swift-zebra', 'smart-monkey', 'sneaky-snake', 'majestic-tiger', 'roaming-jellyfish'];

  dbJson.forEach((item) => {
    // generate a random percentage from 1 to 2
    const increase = Math.random() * 2;
    item.lastBid *= Number(1.0 + (increase / 100));

    // select a random fake user ID
    const index = Math.floor(Math.random() * 7);
    item.lastBidUser = virtualBidders[index];
  });
}

app.listen(
  3000,
  () => {
    setInterval(virtualBid, 5000); // change bid every 5 sec
    console.log('Server started and listening on port 3000...');
  },
);
