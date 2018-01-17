export const API_URL = process.env.NODE_ENV === 'production' ?
  `${window.location.origin}/api/blocks` :
  'http://localhost:8081/api/blocks';
export const REFRESH_TIME = 1000 * 5;
export const TX_BLACK_ETHER = 20;
export const CHAIN_MARGIN_TOP = 20;
export const ETHERSCAN_BASE_URL = 'https://etherscan.io';
export const MENU_OPTIONS = {
  contractCalls: false,
  contractCreates: false,
  sortOrder: 'index',
  fromAddress: '',
  toAddress: ''
};
