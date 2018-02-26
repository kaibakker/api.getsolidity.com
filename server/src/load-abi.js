const {API_KEY, BASE_URL} = require('../config');

// var redis = require("redis"),
// client = redis.createClient();

const abiDecoder = require('abi-decoder'); // NodeJS

const getABIUrl = address =>
    `${BASE_URL}getabi&module=contract&address=${address}&apikey=${API_KEY}`;

// https://api.etherscan.io/api?module=contract&action=getabi&address=0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413&apikey=YourApiKeyToken

module.exports = async function(contract) {

  console.log(getABIUrl(contract))
  fetch(getABIUrl(contract))
    .then(response => {
      return response;
    })
    .then(response => {
      return response.json()
    })
    .then(response => {
      // console.log(response.result)
      if(response.result && response.result.length > 0) {
        // client.set(contract, response.result)
        abiDecoder.addABI(JSON.parse(response.result));
        // store somewhere

      } else {
        // store empty
      }
    }).catch((err) => { console.log(err) });
};
