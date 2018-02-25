require('isomorphic-fetch');
const getCurrentBlockNumber = require('./get-current-block-number');
const getMissingBlocks = require('./get-missing-blocks');
const getMissingMethods = require('./get-missing-methods');
const getMethod = require('./get-method');
const sortBlocks = require('./sort-blocks');
const stripBlock = require('./strip-block');
const {log} = require('./helpers');
const {
  BLOCKS_IN_CACHE,
  REFRESH_INTERVAL,
  ACTIVE_TIME,
  BLOCK_CONFIRMATIONS
} = require('../config');

let blocks = [];
let lastRequestTime = 0;

async function updateBlocks() {
  const currentBlockNumber =
    (await getCurrentBlockNumber()) - BLOCK_CONFIRMATIONS;

  const missingBlocks = await getMissingBlocks(currentBlockNumber, blocks);

  const strippedMissingBlocks = missingBlocks.filter(Boolean).map(stripBlock);


  // console.log(strippedMissingBlocks)
  if(strippedMissingBlocks.length > 0 && strippedMissingBlocks[0].transactions && strippedMissingBlocks[0].transactions.length > 0) {
    for(var i = 0; i < strippedMissingBlocks.length; i++) {
      var newInputs = await getMissingMethods(strippedMissingBlocks[i])
      var count = 0

      newInputs.forEach((input) => {
        if(input && typeof(input) === 'object') {
          strippedMissingBlocks[i].transactions[count].method = input
        }
        count += 1
      })
    }


  }

  const newBlocks = blocks.concat(strippedMissingBlocks);

  sortBlocks(newBlocks);
  blocks = newBlocks.slice(0, BLOCKS_IN_CACHE);

  if (missingBlocks.length) {
    log('[DEBUG] updated blocks: ', blocks.map(b => b.number));
  }
}

function continuousUpdate() {
  if (!isActive()) {
    blocks = [];
    setTimeout(() => continuousUpdate(), REFRESH_INTERVAL);
    return;
  }

  updateBlocks()
    .then(() => setTimeout(() => continuousUpdate(), REFRESH_INTERVAL))
    .catch(error => {
      log('[DEBUG]: update block error: ', error);
      setTimeout(() => continuousUpdate(), REFRESH_INTERVAL);
    });
}
continuousUpdate();

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
