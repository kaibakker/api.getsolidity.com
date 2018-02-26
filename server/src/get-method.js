const {API_KEY, BASE_URL} = require('../config');

// var redis = require("redis"),
// client = redis.createClient();

const abiDecoder = require('abi-decoder'); // NodeJS

const getABIUrl = address =>
    `${BASE_URL}getabi&module=contract&address=${address}&apikey=${API_KEY}`;

// https://api.etherscan.io/api?module=contract&action=getabi&address=0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413&apikey=YourApiKeyToken
module.exports = function(tx) {


  if(tx.input == '0x') {
    return '0x'
  } else {
    return abiDecoder.decodeMethod(tx.input)
  }

  // client.get(tx.to, function(err, reply) {
  //   // reply is null when the key is missing
  //   console.log(reply);
  //   abiDecoder.addABI(JSON.parse(response.result));
  // });
  // console.log(getABIUrl(tx.to))

};
