const {API_KEY, BASE_URL} = require('../config');
const getAccountUrl = address =>
  `${BASE_URL}txlist&module=account&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${API_KEY}`;

module.exports = function(address) {
  return fetch(getAccountUrl(address))
    .then(response => {
      return response;
    })
    .then(response => response.json())
    .then(response => response.result);
};
