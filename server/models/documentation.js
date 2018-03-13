
const mongoose = require('mongoose')
const {MONGOOSE_URL} = require('../config');

mongoose.connect(MONGOOSE_URL);


const documentationSchema = mongoose.Schema({
  interfaceId: { type: String },
  name: { type: String },
  items: [{
    methodId: { type: String },
    specification: { type: String },
    description: { type: String },
    inputs: [{ type: String }],
    outputs: [{ type: String }],
    properties: { type: String }
  }]
});

module.exports = mongoose.model('Documentation', documentationSchema);


// interfaceId + methodId + specification => string
