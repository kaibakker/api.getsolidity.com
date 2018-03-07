const getAccount = require('./get-account');
const PQueue = require('p-queue');
const {BLOCKS_IN_CACHE, CONCURRENT_FETCHES} = require('../config');
const getMissingMethods = require('./get-missing-methods');

const queue = new PQueue({concurrency: CONCURRENT_FETCHES});

var account;

module.exports = async function(address) {
  const account = await getAccount(address)
  const newInputs = getMissingMethods({ transactions: account })


  var count = 0

  newInputs.forEach((input) => {
    if(input && typeof(input) === 'object') {
      account[count].abi = input
    }
    count += 1
  })
  return account;
};
