
const mongoose = require('mongoose')
const {MONGOOSE_URL} = require('../config');

mongoose.connect(MONGOOSE_URL);


const truffleContractSchema = mongoose.Schema({
  contractName: { type: String },
  abi: [{
    type: { type: String },
    name: { type: String },
    inputs: [{
      type: { type: String },
      value: { type: String }
    }],
    outputs: [{
      type: { type: String },
      value: { type: String }
    }],
    constant: { type: Boolean },
    payable: { type: Boolean },
  }],
  ast: { type: mongoose.Schema.Types.Mixed },
  deployedBytecode: { type: mongoose.Schema.Types.Mixed },
  source: { type: String },
  sourceMap: { type: mongoose.Schema.Types.Mixed },
  deployedSourceMap: { type: mongoose.Schema.Types.Mixed },
  schemaVersion: { type: String },
  // updatedAt:
  networks: { type: mongoose.Schema.Types.Mixed },
  "x-definitions": [{
    type: { type: String },
    body: { type: mongoose.Schema.Types.Mixed }

  }]
});

module.exports = mongoose.model('TruffleContract', truffleContractSchema);
