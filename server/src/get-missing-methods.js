const abiDecoder = require('abi-decoder'); // NodeJS



module.exports = function(block) {
  return block.transactions.map(tx => {
    try {
      return abiDecoder.getMethodIDs()[tx.input.slice(2, 10)]
    } catch(e) {
      console.log(e)
      return tx.input
    }
  });
};
