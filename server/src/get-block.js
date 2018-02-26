const {API_KEY, BASE_URL} = require('../config');
const {getHexFromDecimal} = require('./helpers');
const getBlockUrl = hexNumber =>
  `${BASE_URL}eth_getBlockByNumber&module=proxy&tag=${hexNumber}&boolean=true&apikey=${API_KEY}`;

module.exports = function(number) {
  const hexNumber = getHexFromDecimal(number);
  console.log(getBlockUrl(hexNumber))
  return fetch(getBlockUrl(hexNumber))
    .then(response => {
      return response;
    })
    .then(response => response.json())
    .then(response => response.result);
};
