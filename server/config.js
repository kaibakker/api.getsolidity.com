module.exports = {
  API_KEY: 'PSTR5GIXJDBY6U14CYGDF47HUXS9YXB7I5',
  BASE_URL: 'https://api.etherscan.io/api?action=',
  BLOCKS_IN_CACHE: 4,
  CONCURRENT_FETCHES: 2,
  REFRESH_INTERVAL: 5000,
  LOAD_CONTRACT_INTERVAL: 200,
  PORT: 8000,
  ACTIVE_TIME: 1000 * 60,
  BLOCK_CONFIRMATIONS: 5, // y is current block -> fetch y - BLOCK_CONFIRMATIONS
  MONGOOSE_URL: 'mongodb://localhost/getsolidity'
};
