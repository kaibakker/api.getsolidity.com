const {API_KEY, BASE_URL} = require('../config');
const Web3 = require('web3');
// var redis = require("redis"),
// client = redis.createClient();
//
// const {promisify} = require('util');
// const getAsync = promisify(client.hget).bind(client);

const Contract = require('../models/contract')


const abiDecoder = require('abi-decoder'); // NodeJS

const getABIUrl = address =>
    `${BASE_URL}getabi&module=contract&address=${address}&apikey=${API_KEY}`;

// https://api.etherscan.io/api?module=contract&action=getabi&address=0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413&apikey=YourApiKeyToken

Contract.find({}).then((contracts) => {
  contracts.forEach(function(contract) {
    abiDecoder.addABI(contract.abi)
  })

  console.log("ength:", Object.keys(abiDecoder.getMethodIDs()).length )
})


module.exports = async function(address) {
  // const res = await getAsync(['ABIs', contract]);

  Contract.findOne({ address: address }).then((contract) => {
    if(contract) {
      abiDecoder.addABI(contract.abi);
    } else {
      console.log(getABIUrl(address))
      fetch(getABIUrl(address))
        .then(response => {
          return response;
        })
        .then(response => {
          return response.json()
        })
        .then(response => {
          if(response.result && response.result.length > 0) {
            var abi = JSON.parse(response.result)

            console.log(abi)
            const newContract = new Contract({
              contractName: address,
              abi: abi,
              networks: {
                1: {
                  address: address,
                  events: {},
                  links: {},
                }
              },
            })
            newContract.save()
          } else {


            // client.hset("ABIs", contract, '', redis.print);
            // store empty
          }
        }).catch((err) => { console.log(err) });
    }
  }).catch((err) => {
    res.send(err)
  })

  // console.log(getABIUrl(contract))

};
