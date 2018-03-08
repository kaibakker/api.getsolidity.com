const express = require('express');
const app = express();
const morgan = require('morgan');
const {getBlocks, setLastRequestTime} = require('./src/update-blocks');
const cors = require('./src/cors');
const {PORT, API_KEY, MONGOOSE_URL} = require('./config');
const getAccount = require('./src/get-missing-account');
const {getDecimalFromHex} = require('./src/helpers');

const Contract = require('./models/contract')


// const {promisify} = require('util');
// const getAsync = promisify(client.hget).bind(client);

app.use(
  morgan(
    '[:date[clf]] :remote-addr :method :url :status :res[content-length] bytes - :response-time ms - :user-agent',
    {skip: req => !req.url.includes('blocks')}
  )
); // eslint-disable-line

app.use(cors);
app.disable('etag');

app.get('/', (req, res) => res.sendStatus(404));

app.get('/blocks', (req, res) => {
  const lastNumber = parseInt(req.query.last, 10);
  const blocks = getBlocks();

  setLastRequestTime(Date.now());

  // check for valid number
  if (isNaN(lastNumber)) {
    res.json(blocks);
    return;
  }

  const blocksToSend = blocks.filter(({number}) => number > lastNumber);
  res.json(blocksToSend);
});

app.get('/accounts/:address', async (req, res) => {
  const heap = await getAccount(req.params.address);

  const transactions = heap.map(tx => ({
    // creates: tx.creates,
    from: tx.from,
    gas: getDecimalFromHex(tx.gas),
    gasPrice: getDecimalFromHex(tx.gasPrice),
    hash: tx.hash,
    input: tx.input,
    to: tx.to,
    abi: tx.abi,
    methods: tx.methods,
    i: getDecimalFromHex(tx.transactionIndex),
    value:  getDecimalFromHex(tx.value)
  }));

  res.json(transactions);
});

app.get('/contracts/:address', async (req, res) => {
  // const res2 = await getAsync(['ABIs', req.params.address]);
  Contract.findOne({ contractName: req.params.address }).then((contract) => {
    res.json(contract)
  }).catch((err) => {
    res.send(err)
  })

  // const transactions = heap.map(tx => ({
  //   // creates: tx.creates,
  //   from: tx.from,
  //   gas: getDecimalFromHex(tx.gas),
  //   gasPrice: getDecimalFromHex(tx.gasPrice),
  //   hash: tx.hash,
  //   input: tx.input,
  //   to: tx.to,
  //   abi: tx.abi,
  //   methods: tx.methods,
  //   i: getDecimalFromHex(tx.transactionIndex),
  //   value:  getDecimalFromHex(tx.value)
  // }));

  // res.json(transactions);
});

app.get('/contracts', (req, res) => {
  Contract.find({ }).select({ "contractName": 1, "networks": 1}).then((contracts) => {
    res.json(contracts)
  }).catch((err) => {
    res.send(err)
  })
})

console.log(`Listening on port ${PORT}`);
console.log(`Using API KEY: ${API_KEY}`);
app.listen(PORT);
