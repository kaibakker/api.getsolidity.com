const {API_KEY, BASE_URL} = require('../config');
const Web3 = require('web3');
// var redis = require("redis"),
// client = redis.createClient();

// const {promisify} = require('util');
// const getAsync = promisify(client.hget).bind(client);

var symbols = []

const getABIUrl = address =>
    `${BASE_URL}getabi&module=contract&address=${address}&apikey=${API_KEY}`;

// https://api.etherscan.io/api?module=contract&action=getabi&address=0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413&apikey=YourApiKeyToken

// client.hgetall("symbols", function(err, obj) {
//   symbols = obj
// })


module.exports = function(address) {
  return symbols[address]
};
