const getAccount = require('./get-account');
const PQueue = require('p-queue');
const {BLOCKS_IN_CACHE, CONCURRENT_FETCHES} = require('../config');
const getMissingMethods = require('./get-missing-methods');

const queue = new PQueue({concurrency: CONCURRENT_FETCHES});

var account;

module.exports = async function() {
  console.log("ACCOUNt")
  const account = await getAccount('0xc30f370B4ca500eF0eF78a22F5aB8cD445760784')
  console.log("ACCOUNt")
  const newInputs = getMissingMethods({ transactions: account })

  console.log(newInputs)

  var count = 0

  newInputs.forEach((input) => {
    if(input && typeof(input) === 'object') {
      account[count].method = input
    }
    count += 1
  })
  return account;
};
