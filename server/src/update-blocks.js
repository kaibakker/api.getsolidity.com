require('isomorphic-fetch');
const getCurrentBlockNumber = require('./get-current-block-number');
const getMissingBlocks = require('./get-missing-blocks');
const getMissingMethods = require('./get-missing-methods');
const getMethod = require('./get-method');
const sortBlocks = require('./sort-blocks');
const stripBlock = require('./strip-block');
const {log} = require('./helpers');
const loadABI = require('./load-abi')
const loadTokens = require('./load-tokens')
const {
  BLOCKS_IN_CACHE,
  REFRESH_INTERVAL,
  ACTIVE_TIME,
  BLOCK_CONFIRMATIONS,
  LOAD_CONTRACT_INTERVAL
} = require('../config');

let blocks = [];
let contractBacklog = []
let contractsLoaded = []
let lastRequestTime = 0;
//
// var redis = require("redis"),
//     client = redis.createClient();

// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });

// client.on("error", function (err) {
//     console.log("Error " + err);
// });
//
// client.set("string key", "string val", redis.print);
//
// client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
// client.hkeys("hash key", function (err, replies) {
//     console.log(replies.length + " replies:");
//     replies.forEach(function (reply, i) {
//         console.log("    " + i + ": " + reply);
//     });
//     client.quit();
// });

async function updateBlocks() {
  const currentBlockNumber =
    (await getCurrentBlockNumber()) - BLOCK_CONFIRMATIONS;
    console.log(currentBlockNumber)
  const missingBlocks = await getMissingBlocks(currentBlockNumber, blocks);

  const strippedMissingBlocks = missingBlocks.filter(Boolean).map(stripBlock);
  // console.log(strippedMissingBlocks)


  // console.log(strippedMissingBlocks)
  if(strippedMissingBlocks.length > 0 && strippedMissingBlocks[0].transactions && strippedMissingBlocks[0].transactions.length > 0) {
    // let newContracts = strippedMissingBlocks[0].transactions.map((item) => {return item.to})
    // console.log(newContracts)
    // contractBacklog = contractBacklog.concat(newContracts)


    for(var i = 0; i < strippedMissingBlocks.length; i++) {
      var newInputs = getMissingMethods(strippedMissingBlocks[i])
      var count = 0

      newInputs.forEach((abi) => {
        if(abi && typeof(abi) === 'object') {
          strippedMissingBlocks[i].transactions[count].abi = abi
          const to = strippedMissingBlocks[i].transactions[count].to
          strippedMissingBlocks[i].transactions[count].to = loadTokens(to)
          // const snor =
          // console.log("snor", snor)
          // strippedMissingBlocks[i].transactions[count].methods = SolidityCoder.decodeParams(abi.inputs.map((item) => item.type), strippedMissingBlocks[i].transactions[count].input.slice(10))

        } else if(strippedMissingBlocks[i].transactions[count].input != '0x') {
          contractBacklog.push(strippedMissingBlocks[i].transactions[count].to)
        }
        count += 1
      })
    }
  }
  console.log(contractBacklog)
  const newBlocks = blocks.concat(strippedMissingBlocks);

  sortBlocks(newBlocks);
  blocks = newBlocks.slice(0, BLOCKS_IN_CACHE);

  if (missingBlocks.length) {
    log('[DEBUG] updated blocks: ', blocks.map(b => b.number));
  }
}

async function updateContracts() {
  if(contractBacklog.length >= 1) {


    const contract = contractBacklog.shift()
    if(contract && !contractsLoaded.includes(contract)) {
      console.log("contract", contract)
      await loadABI(contract);
    }
    contractsLoaded.push(contract)

    console.log("Update contract", contractBacklog.length, contractsLoaded.length)
  }
}
function continuousUpdateBlocks() {
  if (!isActive()) {
    blocks = [];
    setTimeout(() => continuousUpdateBlocks(), REFRESH_INTERVAL);
    return;
  }

  updateBlocks()
    .then(() => setTimeout(() => continuousUpdateBlocks(), REFRESH_INTERVAL))
    .catch(error => {
      log('[DEBUG]: update block error: ', error);
      setTimeout(() => continuousUpdateBlocks(), REFRESH_INTERVAL);
    });
}

function continuousUpdateContracts() {
  // if (!isActive()) {
  //   contractBacklog = [];
  //   setTimeout(() => continuousUpdateContracts(), LOAD_CONTRACT_INTERVAL);
  //   return;
  // }
  updateContracts()
    .then(() => setTimeout(() => continuousUpdateContracts(), LOAD_CONTRACT_INTERVAL))
    .catch(error => {
      log('[DEBUG]: update contract error: ', error);
      setTimeout(() => continuousUpdateContracts(), LOAD_CONTRACT_INTERVAL);
    });
}
continuousUpdateContracts();
continuousUpdateBlocks();

function setLastRequestTime(time) {
  lastRequestTime = time;
}

function isActive() {
  return Date.now() - lastRequestTime < ACTIVE_TIME;
}

module.exports = {
  getBlocks: () => blocks,
  setLastRequestTime
};
