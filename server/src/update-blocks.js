require('isomorphic-fetch');
const getCurrentBlockNumber = require('./get-current-block-number');
const getMissingBlocks = require('./get-missing-blocks');
const getMissingMethods = require('./get-missing-methods');
const getMethod = require('./get-method');
const sortBlocks = require('./sort-blocks');
const stripBlock = require('./strip-block');
const {log} = require('./helpers');
const loadABI = require('./load-abi')
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

      newInputs.forEach((input) => {
        if(input && typeof(input) === 'object') {
          strippedMissingBlocks[i].transactions[count].method = input

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
    if(!contractsLoaded.includes(contract)) {
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
