import React from 'react'; // eslint-disable-line no-unused-vars
import './transaction.css';
import {gweiToEther} from '../../helper';
import {TX_BLACK_ETHER} from '../../config';
import Parameter from './../parameter/parameter'


export default ({
  data,
  onSelect,
  onClick,
  fromHighlight,
  fromColor,
  toHighlight,
  toColor
}) => {
  const {input, hash, value, to, from} = data;
  const hasInput = input.length > 3;
  const isFrom = fromHighlight === from;
  const isTo = toHighlight === to;
  const etherValue = Math.min(gweiToEther(value), TX_BLACK_ETHER);
  const luminance = Math.max(8, Math.round(etherValue / TX_BLACK_ETHER * 20));
  let color = `hsla(1, 0%, ${100 - luminance}%, 1)`;

  if (isFrom) {
    color = fromColor;
  }

  if (isTo) {
    color = toColor;
  }

  const classes = [
    'transaction',
    // hasInput && 'transaction--input',
    !to && 'transaction--create'
  ]
    .filter(Boolean)
    .join(' ');


  if(data.abi && data.to) {
    const decoded = [] //SolidityCoder.decodeParams(data.abi.inputs.map((item) => item.type), data.input.slice(10))
    return (
      <div
        className={classes}
        style={{backgroundColor: color}}
        onClick={() => onSelect(hash)}
        // onMouseLeave={() => onSelect(null)}
      >
        $name $param1 $value1 $param2 $value2
        { data.to && data.to.slice(0, 10) } { ''}
        { data.abi.name.replace(/([A-Z])/g, function(str){ return " " + str.toLowerCase(); }) }

        { data.abi.inputs && data.abi.inputs.map((input) => {
          return  <Parameter parameter={ input } />
        }) }

        { data.abi.payable && `, ${gweiToEther(data.value).toPrecision(2)} ETH`}
        <a href={'http://localhost:5800/contract/web3?address=' + data.to} >visit</a>
      </div>

    );
  } else if(data.to && data.input == '0x') {
    return  (
      <div
        className={classes}
        style={{backgroundColor: color}}
        onClick={() => onSelect(hash)}
        // onMouseLeave={() => onSelect(null)}
      >

      </div>

    );
  } else if(data.to) {
    return  (
      <div
        className={classes}
        style={{backgroundColor: color}}
        onClick={() => onSelect(hash)}
        // onMouseLeave={() => onSelect(null)}
      >

        { data.to && data.to.substring(0, 10) } unknown { data.value !== 0 && gweiToEther(data.value).toPrecision(2) } { data.value !== 0 && 'ETH' }
      </div>

    );
  } else {
    return  (
      <div
        className={classes}
        style={{backgroundColor: color}}
        onClick={() => onSelect(hash)}
        // onMouseLeave={() => onSelect(null)}
      >


      </div>

    );
  }
};
