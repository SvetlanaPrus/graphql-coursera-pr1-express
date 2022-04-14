const express = require('express');
const cors = require('cors');

const { response } = require('express');
const dbJson = require('./items-db.json');

const app = express();

// allow cross origin access
app.use(cors({ origin: '*', credentials: true }));

// serve static file
app.use('/images', express.static('public'));

app.listen(
  3000,
  () => {
    console.log('Server started and listening on port 3000...');
  },
);
