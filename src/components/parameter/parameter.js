import React from 'react'; // eslint-disable-line no-unused-vars
import './params.css';
import {gweiToEther, ellipsedHash, toGwei, isMobile} from '../../helper';
import {ETHERSCAN_BASE_URL} from '../../config';


const getValue = function(parameter) {
  if(parameter.type == 'address') {
    // if(parameter.value.substring(0, 10) == '0x00000000') {
    //   return "Null Address"
    // } else {
    //   return parameter.value.substring(0, 10)
    // }
    return parameter.name

  } else if(parameter.type == 'bytes32') {
    return parameter.name
  } else {
    return parameter.value
  }
}
export default ({parameter}) => (
  <span>
     { getValue(parameter) + ", "}
  </span>
);
