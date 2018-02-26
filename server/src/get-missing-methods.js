const getMethod = require('./get-method');
const PQueue = require('p-queue');
const {BLOCKS_IN_CACHE, CONCURRENT_FETCHES} = require('../config');

// const queue = new PQueue({concurrency: CONCURRENT_FETCHES});

module.exports = function(block) {
  // console.log(block.transactions[0])
  const inputs = block.transactions.map(tx => getMethod(tx));
  // console.log(inputs)
  return inputs;
};
