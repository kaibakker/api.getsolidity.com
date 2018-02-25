const {API_KEY, BASE_URL_CONTRACT} = require('../config');

// var redis = require("redis"),
// client = redis.createClient();

const abiDecoder = require('abi-decoder'); // NodeJS

const getABIUrl = address =>
    `${BASE_URL_CONTRACT}getabi&address=${address}&apikey=${API_KEY}`;

// https://api.etherscan.io/api?module=contract&action=getabi&address=0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413&apikey=YourApiKeyToken
module.exports = async function(tx) {
  if(tx.input == '0x') {
    return Promise.resolve('0x')
  }

  // client.get(tx.to, function(err, reply) {
  //   // reply is null when the key is missing
  //   console.log(reply);
  //   abiDecoder.addABI(JSON.parse(response.result));
  // });

  return fetch(getABIUrl(tx.to))
    .then(response => {
      return response;
    })
    .then(response => {
      return response.json()
    })
    .then(response => {
      var decodedData;
      // console.log(response.result)
      if(response.result && response.result.length > 0) {
        // client.set(tx.to, response.result)
        abiDecoder.addABI(JSON.parse(response.result));
        decodedData = abiDecoder.decodeMethod(tx.input)

        return decodedData
        // console.log("decodedData", decodedData)
        // var message = (`${decodedData.name}(${decodedData.params.map((input => { return `${input.type} ${input.name} = ${input.value}`})).join(', ')})`)
        // return decodedData
      }
      return decodedData
    }).catch((err) => { console.log("Error", err)});
};
